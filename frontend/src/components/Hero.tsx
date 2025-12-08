"use client";

import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-primary text-sm font-semibold mb-8 border border-teal-100">
                    <svg
                        className="w-4 h-4"
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
                    Trusted by 50,000+ patients
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
                    Find & Book the <span className="text-primary">Best Doctors</span>
                    <br className="hidden md:block" /> Near You
                </h1>

                <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Connect with top healthcare specialists. Search, compare, and book
                    appointments instantly with verified doctors.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/doctors"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl text-lg hover:bg-teal-600 transition shadow-lg shadow-teal-200 hover:shadow-xl hover:-translate-y-1"
                    >
                        Find a Doctor
                        <svg
                            className="w-5 h-5 inline-block ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>

                    <Link
                        href="/doctors"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl text-lg border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                        View All Specialties
                    </Link>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </div>
        </section>
    );
}
