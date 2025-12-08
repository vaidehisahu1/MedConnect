"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

interface Slot {
    date: string;
    time: string;
    available?: boolean;
    _id?: string;
}

interface BookingWidgetProps {
    doctorId: string;
    slots: Slot[] | string[];
    consultationFee: number;
}

export default function BookingWidget({
    doctorId,
    slots,
    consultationFee,
}: BookingWidgetProps) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Simple calendar logic
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        // Prevent selecting past dates
        if (newDate < new Date(today.setHours(0, 0, 0, 0))) return;
        setSelectedDate(newDate);
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) return;
        setStatus("loading");

        try {
            // Format date as YYYY-MM-DD
            const formattedDate = selectedDate.toISOString().split("T")[0];

            await api.post("/appointments", {
                doctor: doctorId,
                date: formattedDate,
                time: selectedTime,
            });

            setStatus("success");
            setTimeout(() => router.push("/appointments"), 1500); // Redirect to new Appointments page
        } catch (error) {
            console.error("Booking error:", error);
            setStatus("error");
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Book Appointment</h3>

            {/* Date Selection */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                    Select Date *
                </label>
                <div className="p-4 border border-slate-200 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-full">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="font-bold text-slate-800">
                            {monthNames[currentMonth]} {currentYear}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-full">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs text-slate-400 font-medium mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(currentYear, currentMonth, day);
                            const isPast = date < new Date(today.setHours(0, 0, 0, 0));
                            const isSelected = selectedDate?.toDateString() === date.toDateString();

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    disabled={isPast}
                                    className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center mx-auto transition ${isSelected
                                            ? "bg-primary text-white shadow-md shadow-teal-200"
                                            : isPast
                                                ? "text-slate-300 cursor-not-allowed"
                                                : "text-slate-700 hover:bg-teal-50 hover:text-primary"
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                    Select Time Slot *
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {(() => {
                        // Handle both old format (string[]) and new format (Slot[])
                        let availableSlots: string[] = [];
                        
                        if (slots.length > 0) {
                            if (typeof slots[0] === 'string') {
                                // Old format: string array
                                availableSlots = slots as string[];
                            } else {
                                // New format: Slot objects - filter by selected date
                                const slotObjects = slots as Slot[];
                                if (selectedDate) {
                                    const formattedDate = selectedDate.toISOString().split("T")[0];
                                    availableSlots = slotObjects
                                        .filter(slot => slot.date === formattedDate && slot.available !== false)
                                        .map(slot => slot.time)
                                        .sort(); // Sort times
                                } else {
                                    // If no date selected, show all unique times
                                    const uniqueTimes = [...new Set(slotObjects.map(s => s.time))];
                                    availableSlots = uniqueTimes.sort();
                                }
                            }
                        }

                        return availableSlots.length > 0 ? (
                            availableSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 px-1 text-xs sm:text-sm border rounded-xl font-medium transition ${selectedTime === time
                                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-teal-500 hover:text-teal-600"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))
                        ) : (
                            <div className="col-span-3 text-sm text-slate-400 italic text-center py-2">
                                {selectedDate ? "No slots available for this date." : "Please select a date first."}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Action Button */}
            {status === "success" ? (
                <div className="w-full py-4 bg-green-100 text-green-700 rounded-xl text-center font-bold">
                    Appointment Booked!
                </div>
            ) : (
                <button
                    onClick={handleBook}
                    disabled={!selectedDate || !selectedTime || status === "loading"}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition ${!selectedDate || !selectedTime || status === "loading"
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1 shadow-slate-200"
                        }`}
                >
                    {status === "loading" ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Book Appointment
                            <span className="text-xs font-normal opacity-70 ml-1">
                                (₹{consultationFee})
                            </span>
                        </>
                    )}
                </button>
            )}

            {status === "error" && (
                <p className="text-red-500 text-sm font-medium mt-3 text-center">
                    Failed to book appointment. Please try again.
                </p>
            )}
        </div>
    );
}
