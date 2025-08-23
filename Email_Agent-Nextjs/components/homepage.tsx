// app/page.tsx (acts as homepage in Next.js 13+ with App Router)

"use client";

import React from "react";

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to My Homepage</h1>
      <p className="mt-4 text-lg text-gray-700">
        This is a simple Next.js homepage built with TypeScript.
      </p>
      <button className="mt-6 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        Get Started
      </button>
    </main>
  );
}
