import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
  type BinaryLike,
} from "node:crypto";
import { promisify } from "node:util";
import * as v from "valibot";
import type { Config } from "../config.ts";
import { users, type DB } from "../db.ts";

const scryptAsync = promisify<BinaryLike, BinaryLike, number, Buffer>(scrypt);

const Credentials = v.object({
  email: v.string(),
  password: v.string(),
});

export function createAuthApp(db: DB, conf: Pick<Config, "authSecret">) {
  const auth = Router();

  auth.post("/login", async (req, res) => {
    const creds = await v.safeParseAsync(Credentials, req.body);

    if (!creds.success) {
      res.status(422).json({
        error: "Invalid credentials",
        issues: creds.issues,
      });
      return;
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, creds.output.email),
      columns: {
        id: true,
        salt: true,
        hashedPassword: true,
      },
    });

    if (!user) {
      await scryptAsync("dummy", "dummy", 64);
      timingSafeEqual(Buffer.from("dummy"), Buffer.from("dummy"));

      res.status(401).json({
        error: "Authentication failed: invalid email or password",
      });
      return;
    }

    const derivedKey = await scryptAsync(creds.output.password, user.salt, 64);

    if (timingSafeEqual(derivedKey, user.hashedPassword)) {
      res.json({
        token: jwt.sign(
          {
            userID: user.id,
          },
          conf.authSecret,
          { expiresIn: "7d" }
        ),
      });
    } else {
      res.status(401).json({
        error: "Authentication failed: invalid email or password",
      });
    }
  });

  auth.post("/signup", async (req, res) => {
    const creds = await v.safeParseAsync(Credentials, req.body);

    if (!creds.success) {
      res.status(422).json({
        error: "Invalid credentials",
        issues: creds.issues,
      });
      return;
    }

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, creds.output.email),
      columns: {
        id: true,
      },
    });

    if (existingUser) {
      res.status(422).json({
        error: "Provided email is already registered",
      });
      return;
    }

    const salt = randomBytes(16);
    const derivedKey = await scryptAsync(creds.output.password, salt, 64);

    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email: creds.output.email,
        hashedPassword: derivedKey,
        salt: salt,
      })
      .returning({ id: users.id });

    res.json(user);
  });

  return auth;
}
