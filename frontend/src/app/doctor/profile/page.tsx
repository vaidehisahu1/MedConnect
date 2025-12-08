"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../../../lib/api";

interface DoctorProfile {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  fee: number;
  location: string;
  about: string;
  image?: string;
  registrationNumber?: string;
  registrationCouncil?: string;
  registrationYear?: string;
  degree?: string;
  college?: string;
  completionYear?: string;
  experienceYear?: string;
  slots: Array<{ date: string; time: string; available: boolean }>;
}

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/doctor/login");
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/doctors/profile");
      setProfile(data);
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      if (error.response?.status === 401) {
        router.push("/doctor/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg mb-4">Failed to load profile</p>
          <button
            onClick={() => router.push("/doctor/home")}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-300 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = profile.image || "/default-image.jpg";

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/doctor/home")}
          className="flex items-center gap-2 text-slate-700 hover:text-teal-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-300/50 border-2 border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-teal-600 p-8 text-white">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0">
              <Image
                src={imageUrl}
                alt={profile.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-3 uppercase tracking-wide">
                {profile.specialization}
              </div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-white/90 text-lg mb-4">{profile.location}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-sm opacity-90">Experience</span>
                  <p className="font-bold text-lg">{profile.experience} years</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-sm opacity-90">Consultation Fee</span>
                  <p className="font-bold text-lg">₹{profile.fee}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-sm opacity-90">Available Slots</span>
                  <p className="font-bold text-lg">{profile.slots.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
            <p className="text-slate-600 leading-relaxed">{profile.about}</p>
          </div>

          {/* Education Section */}
          {(profile.degree || profile.college || profile.completionYear) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Education</h2>
              <div className="bg-slate-50 p-6 rounded-xl">
                {profile.degree && (
                  <p className="text-slate-700 mb-2">
                    <span className="font-semibold">Degree:</span> {profile.degree}
                  </p>
                )}
                {profile.college && (
                  <p className="text-slate-700 mb-2">
                    <span className="font-semibold">College/Institute:</span> {profile.college}
                  </p>
                )}
                {profile.completionYear && (
                  <p className="text-slate-700">
                    <span className="font-semibold">Year of Completion:</span> {profile.completionYear}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Registration Section */}
          {(profile.registrationNumber || profile.registrationCouncil || profile.registrationYear) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Medical Registration</h2>
              <div className="bg-slate-50 p-6 rounded-xl">
                {profile.registrationNumber && (
                  <p className="text-slate-700 mb-2">
                    <span className="font-semibold">Registration Number:</span> {profile.registrationNumber}
                  </p>
                )}
                {profile.registrationCouncil && (
                  <p className="text-slate-700 mb-2">
                    <span className="font-semibold">Registration Council:</span> {profile.registrationCouncil}
                  </p>
                )}
                {profile.registrationYear && (
                  <p className="text-slate-700">
                    <span className="font-semibold">Registration Year:</span> {profile.registrationYear}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Available Slots Section */}
          {profile.slots.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Slots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.slots.map((slot, index) => (
                  <div
                    key={`${slot.date}-${slot.time}-${index}`}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                  >
                    <p className="font-semibold text-slate-900">
                      {new Date(slot.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-primary font-bold">{slot.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.slots.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <p className="text-slate-500 mb-4">No slots available yet</p>
              <button
                onClick={() => router.push("/doctor/slots")}
                className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-300 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Create Slots
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

