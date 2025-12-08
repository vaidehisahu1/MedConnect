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
  createdAt: string;
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/doctor/login");
      return;
    }

    fetchAppointments();
    // Refresh every 30 seconds to get new appointments
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/doctor-appointments");
      // Sort by creation date (newest first)
      const sorted = data.sort((a: Appointment, b: Appointment) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAppointments(sorted);
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error);
      if (error.response?.status === 401) {
        router.push("/doctor/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/accept`);
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to accept appointment");
    }
  };

  const handleReject = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to reject this appointment?")) return;
    
    try {
      await api.put(`/appointments/${appointmentId}/reject`);
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to reject appointment");
    }
  };

  const pendingAppointments = appointments.filter(apt => apt.status === "pending");
  const confirmedAppointments = appointments.filter(apt => apt.status === "confirmed");
  const cancelledAppointments = appointments.filter(apt => apt.status === "cancelled");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600/30 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Appointment Notifications</h1>
          <p className="text-slate-600">View and manage patient bookings</p>
        </div>
        <button
          onClick={() => router.push("/doctor/home")}
          className="bg-white text-slate-700 px-6 py-3 rounded-xl font-bold shadow-md shadow-slate-200 border-2 border-slate-200 hover:bg-slate-50 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-semibold mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-700">{pendingAppointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-700">{confirmedAppointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border-2 border-slate-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Total</p>
              <p className="text-3xl font-bold text-slate-700">{appointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Appointments - Most Important */}
      {pendingAppointments.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-slate-900">New Bookings</h2>
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingAppointments.length}
            </span>
          </div>
          <div className="space-y-4">
            {pendingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-200 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {appointment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-900">{appointment.user.name}</p>
                        <p className="text-slate-600 text-sm">{appointment.user.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold text-slate-700">
                          {new Date(appointment.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-slate-700">{appointment.time}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Booked {new Date(appointment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAccept(appointment._id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-xl hover:shadow-green-300 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(appointment._id)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-xl hover:shadow-red-300 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Appointments */}
      {confirmedAppointments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Confirmed Appointments</h2>
          <div className="space-y-4">
            {confirmedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {appointment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-900">{appointment.user.name}</p>
                        <p className="text-slate-600 text-sm">{appointment.user.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold text-slate-700">
                          {new Date(appointment.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-slate-700">{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-slate-200">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-500 text-lg font-semibold mb-2">No appointments yet</p>
          <p className="text-slate-400">When patients book your slots, they will appear here</p>
        </div>
      )}
    </div>
  );
}

