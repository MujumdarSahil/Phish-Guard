import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-base text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4">
          <Link
            to="/dashboard"
            className="btn btn-primary inline-flex items-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <Link
            to="/scan"
            className="btn btn-secondary inline-flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Scan URL
          </Link>
        </div>
      </div>
    </div>
  );
}