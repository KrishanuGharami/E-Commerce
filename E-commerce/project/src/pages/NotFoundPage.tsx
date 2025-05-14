import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-300px)] flex flex-col items-center justify-center px-4 py-16 animate-fade-in">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 text-center mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button leftIcon={<Home size={18} />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;