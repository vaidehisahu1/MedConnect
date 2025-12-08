"use client";

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import DoctorCard from '../../components/DoctorCard';

interface Doctor {
    _id: string;
    name: string;
    specialization: string;
    experience: number;
    fee: number;
    location: string;
    image?: string;
    slots: string[];
}

export default function Doctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [city, setCity] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (specialization) params.append("specialization", specialization);
            if (city) params.append("city", city);

            // SORTING FIX
            if (sort === "fee_asc") {
                params.append("sort", "fee");
                params.append("order", "asc");
            }
            if (sort === "fee_desc") {
                params.append("sort", "fee");
                params.append("order", "desc");
            }
            if (sort === "experience_desc") {
                params.append("sort", "experience");
                params.append("order", "desc");
            }

            params.append("page", page.toString());
            params.append("limit", "6");

            const { data } = await api.get(`/doctors?${params.toString()}`);

            setDoctors(data.doctors);
            setTotalPages(data.pages);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort, specialization, city]);

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
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <input
                        type="text"
                        placeholder="Search name or specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    />

                    <select
                        value={specialization}
                        onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
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
                        onChange={(e) => { setCity(e.target.value); setPage(1); }}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">All Cities</option>
                        <option value="New York">New York</option>
                        <option value="London">London</option>
                        <option value="California">California</option>
                    </select>

                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                        Search
                    </button>
                </form>

                <div className="mt-4 flex justify-end">
                    <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">Sort by</option>
                        <option value="fee_asc">Fee: Low to High</option>
                        <option value="fee_desc">Fee: High to Low</option>
                        <option value="experience_desc">Experience: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Doctors */}
            {loading ? (
                <div className="text-center py-12">Loading doctors...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor._id}
                                doctor={{ ...doctor, image: doctor.image || "/default-image.jpg" }}
                            />
                        ))}
                    </div>

                    {doctors.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No doctors found.
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Previous
                    </button>

                    <span className="px-4 py-2 bg-primary text-white rounded-lg">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
