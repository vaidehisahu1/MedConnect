"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { TIME_SLOTS } from "../../../lib/constants";

interface Slot {
  date: string;
  time: string;
  available: boolean;
  _id?: string;
}

export default function DoctorSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: "", time: "" });
  const [editingSlot, setEditingSlot] = useState<{ date: string; time: string } | null>(null);
  const [editFormData, setEditFormData] = useState({ date: "", time: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    fetchSlots();
  }, [router]);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get("/doctors/slots");
      setSlots(data);
    } catch (error: any) {
      console.error("Failed to fetch slots:", error);
      setError(error.response?.data?.message || "Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.date || !formData.time) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await api.post("/doctors/slots", formData);
      setFormData({ date: "", time: "" });
      setShowForm(false);
      fetchSlots();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create slot");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!editingSlot) return;

    if (!editFormData.date || !editFormData.time) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await api.put("/doctors/slots", {
        oldDate: editingSlot.date,
        oldTime: editingSlot.time,
        newDate: editFormData.date,
        newTime: editFormData.time,
      });
      setEditingSlot(null);
      setEditFormData({ date: "", time: "" });
      fetchSlots();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update slot");
    }
  };

  const startEdit = (date: string, time: string) => {
    setEditingSlot({ date, time });
    setEditFormData({ date, time });
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingSlot(null);
    setEditFormData({ date: "", time: "" });
  };

  const handleDelete = async (date: string, time: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      await api.delete("/doctors/slots", { data: { date, time } });
      fetchSlots();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete slot");
    }
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const sortedDates = Object.keys(slotsByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Manage Slots</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-300 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {showForm ? "Cancel" : "Add New Slot"}
          </button>
          <button
            onClick={() => router.push("/doctor/home")}
            className="bg-white text-slate-700 px-6 py-3 rounded-xl font-bold shadow-md shadow-slate-200 border-2 border-slate-200 hover:bg-slate-50 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-6 shadow-md shadow-red-100 font-semibold">
          {error}
        </div>
      )}

      {/* Add Slot Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl shadow-slate-300/50 mb-6 border-2 border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Add New Slot</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none shadow-sm hover:border-slate-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Time</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none shadow-sm hover:border-slate-400 transition-colors"
              >
                <option value="">Select Time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-300 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Add Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slots List */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-xl shadow-slate-300/50 border-2 border-slate-200">
          <p className="text-slate-600 text-lg mb-6 font-semibold">No slots created yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-300 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Create Your First Slot
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white p-6 rounded-xl shadow-lg shadow-slate-300/50 border-2 border-slate-200">
              <h3 className="text-xl font-bold mb-4 text-slate-900">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slotsByDate[date].map((slot, index) => (
                  <div
                    key={`${slot.date}-${slot.time}-${index}`}
                    className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-lg border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200"
                  >
                    {editingSlot && editingSlot.date === slot.date && editingSlot.time === slot.time ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-700">Date</label>
                          <input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-slate-700">Time</label>
                          <select
                            value={editFormData.time}
                            onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                            required
                            className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm"
                          >
                            <option value="">Select Time</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md shadow-teal-200 hover:bg-teal-700 hover:shadow-lg transition-all duration-200"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-300 transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{slot.time}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(slot.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(slot.date, slot.time)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-bold px-2 py-1 rounded-lg transition-all duration-200"
                            title="Edit slot"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(slot.date, slot.time)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xl font-bold px-2 py-1 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Delete slot"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

