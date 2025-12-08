"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";

interface Appointment {
  date: string;
  time: string;
}

export default function DoctorHome() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const fetchData = async () => {
      try {
        const { data } = await api.get("/appointments/doctor-appointments");
        setAppointments(data);
      } catch {
        //
      }
    };

    fetchData();
  }, [router]);

  const nextAppointment = appointments[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, Doctor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-white shadow rounded-xl border">
          <h2 className="text-xl font-bold mb-2">Upcoming</h2>
          <p className="text-4xl font-bold text-primary">
            {appointments.length}
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl border">
          <h2 className="text-xl font-bold mb-2">Next Appointment</h2>
          <p>
            {nextAppointment
              ? `${new Date(nextAppointment.date).toDateString()} @ ${nextAppointment.time}`
              : "None"}
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl border">
          <h2 className="text-xl font-bold mb-2">Actions</h2>
          <button
            className="text-primary font-semibold underline"
            onClick={() => router.push("/dashboard")}
          >
            Manage Slots
          </button>
        </div>

      </div>
    </div>
  );
}
