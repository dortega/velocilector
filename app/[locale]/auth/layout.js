import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logo y texto */}
      <div className="fixed top-0 left-0 p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-light tracking-wide text-green-800">
            velocilector
          </span>
        </Link>
      </div>
      {children}
    </div>
  );
} 