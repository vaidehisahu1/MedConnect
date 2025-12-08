"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";
import DoctorCard from "../../components/DoctorCard";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  fee: number;
  location: string;
  image: string;
  slots: string[];
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (specialization) params.append("specialization", specialization);
      if (city) params.append("city", city);
      if (sort) params.append("sort", sort);
      params.append("page", String(page));
      params.append("limit", "6");

      const { data } = await api.get(`/doctors?${params.toString()}`);

      // Handle both array (simple backend) and paginated object (advanced backend)
      let doctorData: any[] = [];
      let total = 1;

      if (Array.isArray(data)) {
        doctorData = data;
        total = 1; // No pagination from backend
      } else if (data.doctors && Array.isArray(data.doctors)) {
        doctorData = data.doctors;
        total = typeof data.pages === "number" ? data.pages : 1;
      }

      const fromApi = (doctorData ?? []) as Partial<Doctor>[];

      const normalized: Doctor[] = fromApi.map((d) => {
        let imageUrl = d.image || "/default-image.jpg";
        if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
          imageUrl = `/${imageUrl}`;
        }
        return {
          _id: d._id ?? "",
          name: d.name ?? "",
          specialization: d.specialization ?? "",
          experience: d.experience ?? 0,
          fee: d.fee ?? 0,
          location: d.location ?? "",
          image: imageUrl,
          slots: d.slots ?? [],
        };
      });

      setDoctors(normalized);
      setTotalPages(total);
    } catch (err: unknown) {
      console.error("Cannot load doctors", err);
      setDoctors([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, specialization, city, sort, page]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Find Your Doctor
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Search from our network of verified healthcare professionals. Filter by
          specialty, location, and more.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-12">
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row gap-4 items-center"
        >
          <div className="relative flex-grow w-full lg:w-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search doctors by name, specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-48">
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-700"
              >
                <option value="">All Specializations</option>
                <option value="General Physician">General Physician</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Psychiatrist">Psychiatrist</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-700"
              >
                <option value="">All Cities</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-700"
              >
                <option value="">Sort by Rating</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
                <option value="experience_desc">Experience: High to Low</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </form>
      </div>

      <div className="mb-6 flex items-center gap-2 text-slate-500 font-medium">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {doctors.length} doctors found
      </div>

      {/* Doctors grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading verified doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg text-slate-500 font-medium">No doctors found matching your criteria.</p>
          <button onClick={() => { setSearch(""); setSpecialization(""); setCity(""); setPage(1) }} className="mt-4 text-primary font-bold hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-16 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-3 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition text-slate-600 font-medium"
          >
            Previous
          </button>

          <span className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-teal-100 flex items-center">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-3 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition text-slate-600 font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
