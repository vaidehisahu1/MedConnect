"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../lib/api";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/doctors/login", { email, password });

      // Verify it's a doctor account
      if (data.role !== "doctor") {
        setError("Access denied. Doctor account required.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/doctor/home");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl shadow-slate-300/50 border-2 border-slate-200">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Doctor Login
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your slots and profile.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 text-center font-semibold shadow-md shadow-red-100">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border-2 border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-500 focus:z-10 sm:text-sm bg-white shadow-sm hover:border-slate-400 transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border-2 border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-500 focus:z-10 sm:text-sm bg-white shadow-sm hover:border-slate-400 transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3.5 px-4 border-2 border-transparent text-sm font-bold rounded-xl text-white ${
                loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
              } focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-xl shadow-teal-200 hover:shadow-2xl hover:shadow-teal-300 transition-all duration-200 transform hover:-translate-y-0.5`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-teal-200 group-hover:text-teal-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/doctor/signup"
              className="font-bold text-primary hover:text-teal-600 transition"
            >
              Register as Doctor
            </Link>
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Are you a patient?{" "}
              <Link href="/login" className="font-bold text-primary hover:text-teal-600 transition">
                Patient Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

