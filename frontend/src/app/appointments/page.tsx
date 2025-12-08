"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../../lib/api";

interface User {
    _id: string;
    name: string;
    role: string;
    email?: string;
}

interface Appointment {
    _id: string;
    doctor: {
        _id: string;
        name: string;
        specialization: string;
        image?: string;
        location?: string;
    };
    date: string;
    time: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
}

export default function MyAppointments() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(stored));
    }, [router]);

    useEffect(() => {
        if (!user) return;
        fetchAppointments();
    }, [user]);

    async function fetchAppointments() {
        try {
            const { data } = await api.get("/appointments/myappointments");
            setAppointments(data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await api.put(`/appointments/${id}/cancel`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            alert("Failed to cancel appointment");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this appointment record?")) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            alert("Failed to delete appointment");
        }
    };

    const handleReschedule = (doctorId: string) => {
        router.push(`/doctors/${doctorId}`);
    };

    // Filter appointments logic
    const upcomingAppointments = appointments.filter(
        (apt) => apt.status === "confirmed" || apt.status === "pending"
    );
    const pastAppointments = appointments.filter((apt) => apt.status === "completed");
    const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled");

    const getFilteredAppointments = () => {
        switch (activeTab) {
            case "upcoming":
                return upcomingAppointments;
            case "past":
                return pastAppointments;
            case "cancelled":
                return cancelledAppointments;
            default:
                return [];
        }
    };

    const filtered = getFilteredAppointments();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Profil Card */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center sticky top-24">
                            <div className="w-24 h-24 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-4 border-4 border-white shadow-sm">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                            <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full mt-2 uppercase tracking-wide">
                                Patient
                            </div>

                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-slate-600 text-sm">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {user?.email || "patient@example.com"}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-sm">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    +91 98765 43210
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-sm">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Mumbai, India
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
                            <button
                                onClick={() => router.push('/doctors')}
                                className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-teal-600 transition shadow-lg shadow-teal-100"
                            >
                                Book New
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-100 shadow-sm mb-8 w-full md:w-fit">
                            {(["upcoming", "past", "cancelled"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                                        ? "bg-primary text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                        }`}
                                >
                                    {tab} ({
                                        tab === 'upcoming' ? upcomingAppointments.length :
                                            tab === 'past' ? pastAppointments.length :
                                                cancelledAppointments.length
                                    })
                                </button>
                            ))}
                        </div>

                        {/* Appointment List */}
                        <div className="space-y-4">
                            {filtered.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No appointments found</h3>
                                    <p className="text-slate-500">You don't have any {activeTab} appointments.</p>
                                    {activeTab === 'upcoming' && (
                                        <button onClick={() => router.push('/doctors')} className="mt-4 text-primary font-bold hover:underline">
                                            Book your first appointment
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filtered.map((apt) => (
                                    <div
                                        key={apt._id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition group"
                                    >
                                        {/* Doctor Info */}
                                        <div className="flex items-center gap-4 flex-grow w-full md:w-auto">
                                            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                                <Image
                                                    src={(apt.doctor.image && (apt.doctor.image.startsWith('http') || apt.doctor.image.startsWith('/')))
                                                        ? apt.doctor.image
                                                        : `/${apt.doctor.image || 'default-image.jpg'}`}
                                                    alt={apt.doctor.name}
                                                    width={60}
                                                    height={60}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">Dr. {apt.doctor.name}</h3>
                                                <p className="text-primary text-sm font-medium">{apt.doctor.specialization}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {apt.doctor.location || "Clinic Visit"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex flex-col items-center md:items-end min-w-[140px]">
                                            <div className="text-slate-900 font-bold text-lg">{apt.time}</div>
                                            <div className="text-slate-500 text-sm font-medium">{new Date(apt.date).toDateString()}</div>
                                        </div>

                                        {/* Status & Action */}
                                        <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between gap-3">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {apt.status === 'pending' || apt.status === 'confirmed' ? 'Scheduled' : apt.status}
                                            </span>

                                            {activeTab === 'upcoming' && (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleCancel(apt._id)}
                                                        className="text-slate-400 hover:text-red-500 text-xs font-bold transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleReschedule(apt.doctor._id)}
                                                        className="text-primary hover:text-teal-600 text-xs font-bold transition"
                                                    >
                                                        Reschedule
                                                    </button>
                                                </div>
                                            )}
                                            {(activeTab === 'cancelled' || activeTab === 'past') && (
                                                <button
                                                    onClick={() => handleDelete(apt._id)}
                                                    className="text-red-300 hover:text-red-500 text-xs font-bold transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
