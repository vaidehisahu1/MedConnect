"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';

export default function DoctorSignup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        experience: 0,
        fee: 0,
        location: '',
        about: '',

        // Registration
        registrationNumber: '',
        registrationCouncil: '',
        registrationYear: '',

        // Education
        degree: '',
        college: '',
        completionYear: '',
        experienceYear: ''
    });

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post("/users/doctor/signup", formData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            router.push('/doctor/home'); // Redirect to new dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Join MedConnect
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Let's build your dedicated profile.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-center text-sm font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section A: Profile Details */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                            Section A: Profile Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-slate-600 text-sm font-bold mb-2">Doctor's Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Dr. Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email" /* fixed typo previously it was name="name" which was wrong copy paste */
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Specialization</label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition bg-white"
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                    <option value="Dentist">Dentist</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">City</label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition bg-white"
                                >
                                    <option value="">Select City</option>
                                    <option value="New York">New York</option>
                                    <option value="London">London</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Bangalore">Bangalore</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Consultation Fee ($)</label>
                                <input
                                    type="number"
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-slate-600 text-sm font-bold mb-2">About</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section B: Medical Registration */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                            Section B: Medical Registration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Registration Number</label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Registration Council</label>
                                <input
                                    type="text"
                                    name="registrationCouncil"
                                    value={formData.registrationCouncil}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Registration Year</label>
                                <input
                                    type="text"
                                    name="registrationYear"
                                    value={formData.registrationYear}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section C: Education Qualification */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                            Section C: Education Qualification
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Degree</label>
                                <input
                                    type="text"
                                    name="degree"
                                    placeholder="e.g. MBBS, MD"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">College/Institute</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2">Year of Completion</label>
                                <input
                                    type="text"
                                    name="completionYear"
                                    value={formData.completionYear}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-teal-600 transition shadow-lg shadow-teal-100 text-lg"
                        >
                            {loading ? "Registering..." : "Complete Registration"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-primary hover:text-teal-600 transition">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
