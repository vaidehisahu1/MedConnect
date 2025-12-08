"use client";

import Link from "next/link";

const specialties = [
    {
        name: "Cardiologist",
        count: "45+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        ),
        bg: "bg-red-50",
    },
    {
        name: "General Physician",
        count: "120+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
        bg: "bg-teal-50",
    },
    {
        name: "Neurologist",
        count: "32+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
            </svg>
        ),
        bg: "bg-purple-50",
    },
    {
        name: "Orthopedic",
        count: "56+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
        ),
        bg: "bg-orange-50",
    },
    {
        name: "Ophthalmologist",
        count: "38+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
            </svg>
        ),
        bg: "bg-blue-50",
    },
    {
        name: "Pediatrician",
        count: "67+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
        bg: "bg-pink-50",
    },
    {
        name: "Dermatologist",
        count: "42+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
            </svg>
        ),
        bg: "bg-green-50",
    },
    {
        name: "ENT Specialist",
        count: "29+ Doctors",
        icon: (
            <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
                {/* Placeholder generic ear/sound icon path */}
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
            </svg>
        ),
        bg: "bg-yellow-50",
    },
];

export default function SpecialtiesSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Browse by Specialty
                </h2>
                <p className="text-slate-500 mb-16 max-w-2xl mx-auto">
                    Choose from our wide range of medical specialties and find the right
                    doctor for your needs
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {specialties.map((spec) => (
                        <Link
                            href={`/doctors?specialization=${spec.name}`}
                            key={spec.name}
                            className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-300"
                        >
                            <div
                                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-colors ${spec.bg}`}
                            >
                                {spec.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                {spec.name}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium">{spec.count}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
