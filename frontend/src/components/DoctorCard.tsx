"use client";

import Link from "next/link";
import Image from "next/image";

interface DoctorProps {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  fee: number;
  location: string;
  image: string;
  slots: string[];
}

export default function DoctorCard({ doctor }: { doctor: DoctorProps }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col">
      <div className="relative h-48 bg-teal-light/30">
        <Image
          src={doctor.image}
          alt={doctor.name}
          width={500}
          height={500}
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
        <p className="text-primary text-sm font-medium">{doctor.specialization}</p>

        <p className="mt-2 text-sm text-gray-600">{doctor.location}</p>
        <p className="mt-2 text-gray-800 font-bold">₹{doctor.fee}</p>

        <Link
          href={`/doctors/${doctor._id}`}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
