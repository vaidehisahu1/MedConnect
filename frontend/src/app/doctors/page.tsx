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

      const fromApi = (data.doctors ?? []) as Partial<Doctor>[];

      const normalized: Doctor[] = fromApi.map((d) => ({
        _id: d._id ?? "",
        name: d.name ?? "",
        specialization: d.specialization ?? "",
        experience: d.experience ?? 0,
        fee: d.fee ?? 0,
        location: d.location ?? "",
        image: d.image || "/default-image.jpg",
        slots: d.slots ?? [],
      }));

      setDoctors(normalized);
      setTotalPages(typeof data.pages === "number" ? data.pages : 1);
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
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">Find Your Doctor</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Search name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
          />

          <select
            value={specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Specializations</option>
            <option value="General Physician">General Physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Neurologist">Neurologist</option>
          </select>

          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Cities</option>
            <option value="New York">New York</option>
            <option value="London">London</option>
            <option value="California">California</option>
            <option value="Texas">Texas</option>
            <option value="Chicago">Chicago</option>
          </select>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex justify-end">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="">Sort By</option>
            <option value="fee_asc">Fee: Low to High</option>
            <option value="fee_desc">Fee: High to Low</option>
            <option value="experience_desc">Experience: High to Low</option>
          </select>
        </div>
      </div>

      {/* Doctors grid */}
      {loading ? (
        <div className="text-center py-12">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No doctors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-primary text-white rounded-lg">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
