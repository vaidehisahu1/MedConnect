import Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch doctors" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    doctor ? res.json(doctor) : res.status(404).json({ message: "Not found" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch doctor" });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create doctor" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    Object.assign(doctor, req.body);
    res.json(await doctor.save());
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update doctor" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    await doctor.deleteOne();
    res.json({ message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete doctor" });
  }
};

// For Doctor Dashboard
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    // Allow updating limited fields for now (availability, slots, fees, etc.)
    const { slots, available, fee, experience, about } = req.body;

    if (slots) doctor.slots = slots;
    if (available !== undefined) doctor.available = available;
    if (fee) doctor.fee = fee;
    if (experience) doctor.experience = experience;
    if (about) doctor.about = about;

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Slot Management
export const createSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const { date, time } = req.body;

    // Check if slot already exists
    const slotExists = doctor.slots.some(
      slot => slot.date === date && slot.time === time
    );

    if (slotExists) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    doctor.slots.push({ date, time, available: true });
    await doctor.save();

    // Sort slots before returning
    const sortedSlots = doctor.slots.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    res.status(201).json({ message: "Slot created successfully", slots: sortedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create slot" });
  }
};

export const getSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    // Sort slots by date, then by time
    const sortedSlots = doctor.slots.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    res.json(sortedSlots);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch slots" });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const { oldDate, oldTime, newDate, newTime } = req.body;

    if (!oldDate || !oldTime || !newDate || !newTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the slot to update
    const slotIndex = doctor.slots.findIndex(
      slot => slot.date === oldDate && slot.time === oldTime
    );

    if (slotIndex === -1) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if new slot already exists
    const slotExists = doctor.slots.some(
      (slot, index) => slot.date === newDate && slot.time === newTime && index !== slotIndex
    );

    if (slotExists) {
      return res.status(400).json({ message: "New slot time already exists" });
    }

    // Check if there are any appointments for the old slot
    const Appointment = (await import("../models/Appointment.js")).default;
    const appointments = await Appointment.find({
      doctor: doctor._id,
      date: oldDate,
      time: oldTime,
      status: { $in: ["pending", "confirmed"] }
    });

    if (appointments.length > 0) {
      // Update appointments to new date/time
      await Appointment.updateMany(
        {
          doctor: doctor._id,
          date: oldDate,
          time: oldTime,
          status: { $in: ["pending", "confirmed"] }
        },
        {
          $set: { date: newDate, time: newTime }
        }
      );
    }

    // Update the slot
    doctor.slots[slotIndex].date = newDate;
    doctor.slots[slotIndex].time = newTime;

    await doctor.save();
    
    // Sort slots before returning
    const sortedSlots = doctor.slots.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    res.json({ message: "Slot updated successfully", slots: sortedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update slot" });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const { date, time } = req.body;

    // Check if there are any appointments for this slot
    const Appointment = (await import("../models/Appointment.js")).default;
    const appointments = await Appointment.find({
      doctor: doctor._id,
      date,
      time,
      status: { $in: ["pending", "confirmed"] }
    });

    if (appointments.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete slot with existing appointments. Please cancel appointments first." 
      });
    }

    doctor.slots = doctor.slots.filter(
      slot => !(slot.date === date && slot.time === time)
    );

    await doctor.save();
    
    // Sort slots before returning
    const sortedSlots = doctor.slots.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    res.json({ message: "Slot deleted successfully", slots: sortedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete slot" });
  }
};
