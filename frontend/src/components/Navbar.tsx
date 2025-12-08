"use client";

import Link from "next/link";

export default function Navbar() {
  // read localStorage safely
  let user: { name?: string } | null = null;
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        user = JSON.parse(raw);
      } catch {
        user = null;
      }
    }
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b p-4 flex gap-6">
      <Link href="/">Home</Link>
      <Link href="/doctors">Find Doctors</Link>

      {user ? (
        <>
          <span>Hello {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
