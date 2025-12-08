"use client";

import { useState, useEffect } from "react";
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
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // NEW

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching doctor details:", error.message);
        }
        setErrorMessage("Failed to fetch doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDoctor();
  }, [id]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/appointments", {
        doctor: id,
        date,
        time,
      });

      setBookingStatus("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error: unknown) {
      console.error("Booking failed:", error);
      // we cannot safely access error.response without Axios types
      setBookingStatus("error");
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (errorMessage) return <div className="text-center py-12 text-red-500">{errorMessage}</div>;
  if (!doctor) return <div className="text-center py-12">Doctor not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <Image
            src={doctor.image || "/default-doctor.jpg"}
            alt={doctor.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 md:w-2/3">
          <h1 className="text-3xl font-bold text-primary mb-2">{doctor.name}</h1>
          <p className="text-xl text-secondary font-medium mb-4">
            {doctor.specialization}
          </p>

          <div className="space-y-2 text-gray-700 mb-6">
            <p>
              <span className="font-semibold">Experience:</span> {doctor.experience} years
            </p>
            <p>
              <span className="font-semibold">Location:</span> {doctor.location}
            </p>
            <p>
              <span className="font-semibold">Consultation Fee:</span> ${doctor.fee}
            </p>
            <p>
              <span className="font-semibold">About:</span> {doctor.about}
            </p>
          </div>

          <hr className="my-6" />

          <h3 className="text-xl font-bold text-primary mb-4">Book Appointment</h3>
          {bookingStatus === "success" ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
              Appointment booked successfully! Redirecting to dashboard...
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              {bookingStatus === "error" && (
                <p className="text-red-500 text-sm">
                  Failed to book appointment. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={bookingStatus === "loading"}
                className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {bookingStatus === "loading" ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
