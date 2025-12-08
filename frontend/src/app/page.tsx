"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto text-center py-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to MedConnect</h1>
      <p className="text-gray-600 mb-8">
        Find doctors, book appointments and manage health easily.
      </p>

      <Link href="/doctors" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
        Find Doctors
      </Link>
    </div>
  );
}
