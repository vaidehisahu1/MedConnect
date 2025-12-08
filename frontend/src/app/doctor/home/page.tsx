"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

export default function DoctorHome() {
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/doctor/login");
      return;
    }

    // Verify it's a doctor
    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "doctor") {
        router.push("/login");
        return;
      }
    } catch {
      router.push("/doctor/login");
      return;
    }

    fetchPendingAppointments();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingAppointments, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchPendingAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/doctor-appointments");
      const pending = data.filter((apt: Appointment) => apt.status === "pending");
      setPendingCount(pending.length);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Doctor Dashboard</h1>
        <p className="text-slate-600">Manage your slots and view your profile</p>
      </div>

      {/* Appointment Notifications */}
      {pendingCount > 0 && (
        <div 
          onClick={() => router.push("/doctor/appointments")}
          className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900 mb-1">
                  {pendingCount} New {pendingCount === 1 ? 'Booking' : 'Bookings'}!
                </h3>
                <p className="text-orange-700 font-medium">Click to view and manage patient appointments</p>
              </div>
            </div>
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* View Appointments Card */}
        <div
          onClick={() => router.push("/doctor/appointments")}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-300/50 border-2 border-slate-200 cursor-pointer hover:shadow-2xl hover:shadow-orange-300/50 hover:border-orange-400 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 relative">
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {pendingCount}
                </span>
              )}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
              <p className="text-slate-600 text-sm font-medium">View patient bookings</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            See all patient appointments, accept or reject bookings, and manage your schedule.
          </p>
          <div className="mt-6 flex items-center text-orange-600 font-bold text-lg group-hover:gap-2 transition-all">
            <span>View Appointments</span>
            <svg
              className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Manage Slots Card */}
        <div
          onClick={() => router.push("/doctor/slots")}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-300/50 border-2 border-slate-200 cursor-pointer hover:shadow-2xl hover:shadow-teal-300/50 hover:border-teal-400 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Manage Slots</h2>
              <p className="text-slate-600 text-sm font-medium">Create and manage availability</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            Add time slots for different dates to make yourself available for appointments. 
            Patients can book appointments based on your available slots.
          </p>
          <div className="mt-6 flex items-center text-teal-600 font-bold text-lg group-hover:gap-2 transition-all">
            <span>Get Started</span>
            <svg
              className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* View Profile Card */}
        <div
          onClick={() => router.push("/doctor/profile")}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-300/50 border-2 border-slate-200 cursor-pointer hover:shadow-2xl hover:shadow-blue-300/50 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">View Profile</h2>
              <p className="text-slate-600 text-sm font-medium">See your professional profile</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            View your complete profile including specialization, experience, fees, 
            and all the information patients see about you.
          </p>
          <div className="mt-6 flex items-center text-blue-600 font-bold text-lg group-hover:gap-2 transition-all">
            <span>View Profile</span>
            <svg
              className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

