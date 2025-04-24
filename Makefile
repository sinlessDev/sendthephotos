.PHONY: dev-resources dev-root dev

dev-root:
	@echo "Starting root dev server..."
	@pnpm dotenvx run -- node --import @swc-node/register/esm-register --watch ./src/main.ts

dev-resources:
	@echo "Starting resources dev server..."
	@cd resources && pnpm vite dev

dev:
	@$(MAKE) dev-root & \
	$(MAKE) dev-resources & \
	wait