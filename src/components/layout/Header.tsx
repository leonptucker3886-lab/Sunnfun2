import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Next.js Starter</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}