"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Doctors", href: "/doctors" },
    { name: "My Appointments", href: "/appointments" },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {/* Stethoscope Icon (SVGR or SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M10.5 8.25h3.125C14.075 8.25 14.5 7.695 14.5 7.01c0-.498-.247-.736-.554-.853A.41.41 0 0013.75 6.25H12c-.22 0-.421.066-.59.184A.807.807 0 0011.096 6H10.5A1.5 1.5 0 019 4.5v-1a1.5 1.5 0 011.5-1.5h3"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
            MedConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-gray-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 transition hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-primary rounded-lg hover:bg-teal-600 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
