import { Link } from "wouter";

export function LandingRoute() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full p-6 bg-stone-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-stone-800">SendThePhotos</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/events"
                  className="text-stone-700 hover:text-stone-900"
                >
                  Events
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-stone-700 hover:text-stone-900"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-stone-700 hover:text-stone-900"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-stone-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              Share Photos Effortlessly
            </h2>
            <p className="text-xl text-stone-600 mb-8">
              Upload, organize, and share your event photos with ease.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/events"
                className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="px-6 py-3 border border-stone-800 text-stone-800 rounded-lg hover:bg-stone-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-stone-800 mb-12">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-stone-50 rounded-lg">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-bold mb-2">Easy Uploads</h3>
                <p className="text-stone-600">
                  Quickly upload photos from any device with our intuitive
                  interface.
                </p>
              </div>
              <div className="p-6 bg-stone-50 rounded-lg">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-bold mb-2">Share Instantly</h3>
                <p className="text-stone-600">
                  Generate shareable links or QR codes to distribute to your
                  event guests.
                </p>
              </div>
              <div className="p-6 bg-stone-50 rounded-lg">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                <p className="text-stone-600">
                  Access your photos on any device with our responsive design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-6 bg-stone-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">
              Get In Touch
            </h2>
            <p className="text-lg text-stone-600 mb-8">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <a
              href="mailto:contact@sendthephotos.com"
              className="px-6 py-3 bg-stone-800 text-white rounded-lg inline-block hover:bg-stone-700"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 px-6 bg-stone-800 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">SendThePhotos</h2>
          </div>
          <div>
            <p>
              &copy; {new Date().getFullYear()} SendThePhotos. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
