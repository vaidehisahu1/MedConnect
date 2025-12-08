"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/api";
import Image from "next/image";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  about: string;
  location: string;
  experience: number;
  fee: number;
  image?: string;
  slots?: string[];
}

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

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

  async function book(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    try {
      await api.post("/appointments", {
        doctor: id,
        date,
        time,
      });

      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch {
      setStatus("error");
    }
  }

  if (loading) return <div className="py-16 text-center">Loading profile...</div>;
  if (!doctor) return <div className="py-16 text-center">Doctor not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow border rounded-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <Image
            src={doctor.image || "/default-image.jpg"}
            alt={doctor.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 md:w-2/3">
          <h1 className="text-3xl font-bold mb-2 text-primary">{doctor.name}</h1>
          <p className="text-secondary font-medium text-lg mb-4">
            {doctor.specialization}
          </p>

          <p><strong>Experience:</strong> {doctor.experience} years</p>
          <p><strong>Location:</strong> {doctor.location}</p>
          <p><strong>Fee:</strong> ₹{doctor.fee}</p>
          <p className="mt-4"><strong>About:</strong> {doctor.about}</p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold mb-4 text-primary">Book Appointment</h2>

          {status === "success" ? (
            <div className="p-4 text-green-700 bg-green-100 rounded">
              Appointment confirmed. Redirecting...
            </div>
          ) : (
            <form className="space-y-4" onSubmit={book}>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <select
                className="w-full border rounded p-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select time...</option>

                {(doctor.slots || []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full bg-secondary text-white font-bold py-2 rounded"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Booking..." : "Confirm"}
              </button>

              {status === "error" && (
                <p className="text-red-600 text-sm">Booking failed.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
