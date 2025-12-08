"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

const AVAILABLE_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

interface User {
  _id: string;
  name: string;
  role: string;
  doctorId?: string;
}

interface Appointment {
  _id: string;
  user: {
    name: string;
  };
  doctor: {
    name: string;
  };
  date: string;
  time: string;
  status: string;
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // used only by doctors
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [updateStatus, setUpdateStatus] = useState("");

  const router = useRouter();

  // load logged user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored) as User);
  }, [router]);

  // get appointments
  useEffect(() => {
    if (!user) return;

    async function fetchAppointments() {
      try {
        const { data } = await api.get("/appointments/myappointments");
        setAppointments(data);
      } catch {
        console.log("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);


  function toggleSlot(slot: string) {
    setSelectedSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  }

  const saveSlots = async () => {
    setUpdateStatus("saving");
    // here later you will call your slot update endpoint
    setTimeout(() => setUpdateStatus("success"), 1000);
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        {user?.role === "doctor" ? "Doctor Dashboard" : "My Appointments"}
      </h1>

      {user?.role === "doctor" && (
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-4">
            Manage Availability Slots
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {AVAILABLE_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition ${
                  selectedSlots.includes(slot)
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={saveSlots}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-dark transition"
          >
            {updateStatus === "saving" ? "Saving..." : "Update Slots"}
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Upcoming Appointments
      </h2>

      {appointments.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No appointments scheduled.</p>
          {user?.role !== "doctor" && (
            <button
              onClick={() => router.push("/doctors")}
              className="text-primary font-bold hover:underline"
            >
              Book an Appointment
            </button>
          )}
        </div>
      ) : (
        appointments.map((apt) => (
          <div
            key={apt._id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {user?.role === "doctor"
                  ? `Patient: ${apt.user?.name}`
                  : `Dr. ${apt.doctor.name}`}
              </h3>
              <p className="text-gray-500 text-sm">
                {new Date(apt.date).toDateString()} at{" "}
                <span className="text-primary font-bold">{apt.time}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
              {apt.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
