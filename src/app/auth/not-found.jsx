"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      {/* 404 Text */}
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Page Not Found
      </p>

      {/* Optional description */}
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-sm">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Back to Dashboard Button */}
      <Link href="/dashboard" passHref>
        <button className="mt-6 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}
