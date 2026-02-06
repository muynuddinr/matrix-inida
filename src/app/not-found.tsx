import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="text-center max-w-md">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-4">
            404
          </h1>
          <h2 className="text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mb-12">
          <div className="inline-block">
            <svg
              className="w-48 h-48 text-gray-700 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-500 text-sm mb-4">
            Need help? Feel free to contact us
          </p>
          <Link
            href="/contact"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
