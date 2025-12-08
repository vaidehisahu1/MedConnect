import Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const { search, specialization, city, sort, page = 1, limit = 6 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    if (specialization) {
      query.specialization = specialization;
    }

    if (city) {
      query.location = city;
    }

    let sortOption = {};
    if (sort === "fee_asc") sortOption.fee = 1;
    if (sort === "fee_desc") sortOption.fee = -1;
    if (sort === "experience_desc") sortOption.experience = -1;

    const count = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      doctors,
      pages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  doctor ? res.json(doctor) : res.status(404).json({ message: "Not found" });
};

export const createDoctor = async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
};

export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  Object.assign(doctor, req.body);
  res.json(await doctor.save());
};

export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  await doctor.deleteOne();
  res.json({ message: "Doctor deleted" });
};
