"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "../../../lib/api";
import BookingWidget from "../../../components/BookingWidget";

interface Slot {
  date: string;
  time: string;
  available?: boolean;
  _id?: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  about: string;
  location: string;
  experience: number;
  fee: number;
  image?: string;
  slots?: Slot[] | string[];
}

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        console.error("Cannot load doctor", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );

  if (!doctor)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Doctor not found
      </div>
    );

  // Normalize image URL
  let imageUrl = doctor.image || "/default-image.jpg";
  if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
    imageUrl = `/${imageUrl}`;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Doctor Details */}
        <div className="flex-1">
          {/* Header Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner flex-shrink-0">
              <Image
                src={imageUrl}
                alt={doctor.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-teal-50 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
                {doctor.specialization}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {doctor.name}
              </h1>
              <p className="text-slate-500 mb-6 flex items-center justify-center md:justify-start gap-2">
                <svg
                  className="w-5 h-5 text-slate-400"
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
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Experience
                  </div>
                  <div className="text-slate-900 font-bold text-lg">
                    {doctor.experience} Years
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Patients
                  </div>
                  <div className="text-slate-900 font-bold text-lg flex items-center gap-1">
                    4.8
                    <svg
                      className="w-4 h-4 text-yellow-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Reviews
                  </div>
                  <div className="text-slate-900 font-bold text-lg">
                    378
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                {doctor.about ||
                  `Dr. ${doctor.name} is a dedicated ${doctor.specialization.toLowerCase()} with over ${doctor.experience
                  } years of experience in providing comprehensive care. Committed to patient well-being and keeping up with the latest medical advancements.`}
              </p>
            </div>
          </div>

          {/* Clinic Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Clinic Address
            </h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {doctor.location} Medical Center
                </h3>
                <p className="text-slate-500 mt-1">
                  {doctor.location}, Maharashtra 411004
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="w-full lg:w-[400px]">
          <BookingWidget
            doctorId={doctor._id}
            slots={doctor.slots || []}
            consultationFee={doctor.fee}
          />
        </div>
      </div>
    </div>
  );
}
