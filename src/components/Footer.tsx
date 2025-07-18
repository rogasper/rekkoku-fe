import { Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Rekkoku. All rights reserved.
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-gray-600">
          created with <Heart className="h-4 w-4 fill-red-500 text-red-500" />{" "}
          by{" "}
          <Link
            href="https://www.linkedin.com/in/rogasper/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:underline"
          >
            Rogasper
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
