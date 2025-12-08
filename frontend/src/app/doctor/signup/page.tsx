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
        specialization: 'General Physician',
        experience: 0,
        fee: 0,
        location: '',
        about: '',
    });

    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const { data } = await api.post('/api/auth/doctor/signup', formData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            router.push('/dashboard');
        } catch (err: unknown) {

            if (
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                (err as { response?: { data?: { message?: string } } }).response
            ) {
                const typedErr = err as { response?: { data?: { message?: string } } };
                setError(typedErr.response?.data?.message || 'Signup failed');
            } else {
                setError('Signup failed');
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-3xl font-bold text-primary mb-2 text-center">
                Doctor Registration
            </h2>
            <p className="text-gray-500 text-center mb-8">
                Join our network of healthcare professionals
            </p>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Specialization</label>
                        <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                        >
                            <option value="General Physician">General Physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Years of Experience</label>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Consultation Fee ($)
                        </label>
                        <input
                            type="number"
                            name="fee"
                            value={formData.fee}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">City/Location</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                        >
                            <option value="">Select City</option>
                            <option value="New York">New York</option>
                            <option value="London">London</option>
                            <option value="California">California</option>
                            <option value="Texas">Texas</option>
                            <option value="Chicago">Chicago</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">About You</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your medical background..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50 h-24"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-teal-dark transition shadow-lg mt-6"
                >
                    Register as Doctor
                </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-secondary font-semibold hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
