
"use client";

import Link from "next/link";
import Image from "next/image";

interface DoctorProps {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  fee: number;
  location: string;
  image: string;
  slots: string[];
}

export default function DoctorCard({ doctor }: { doctor: DoctorProps }) {
  // Generate random rating 4.5 - 5.0 for demo
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  // available tag logic (randomly today or tomorrow)
  const isToday = Math.random() > 0.5;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 flex flex-col md:flex-row gap-6 group">
      {/* Image Section */}
      <div className="relative w-full md:w-32 h-32 flex-shrink-0">
        <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-100">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {/* Availability Badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
          {isToday ? "Available Today" : "Available Tomorrow"}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {doctor.name}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <svg
                className="w-4 h-4 text-yellow-500 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-slate-700">{rating}</span>
            </div>
          </div>
          <p className="text-primary font-medium text-sm mb-3">
            {doctor.specialization}
          </p>

          {/* Metadata icons */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {doctor.experience} yrs exp
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {doctor.location}
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {doctor.slots.length} slots
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">
              Consultation Fee
            </span>
            <div className="text-lg font-bold text-slate-900">
              ₹ {doctor.fee}
            </div>
          </div>

          <Link
            href={`/doctors/${doctor._id}`}
            className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-teal-600 transition shadow-md shadow-teal-100 hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
