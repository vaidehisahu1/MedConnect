import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

// STRICT WORKING CORS SETUP
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://med-connect-d9mb.vercel.app", // Vercel main
      "https://medconnect-tsae.onrender.com", // Render backend
      /\.vercel\.app$/, // allow preview deployments
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// allow preflight and credentials ALWAYS
app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running on Render");
});

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo DB error =>", err));

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";

// import userRoutes from "./routes/userRoutes.js";
// import doctorRoutes from "./routes/doctorRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";

// dotenv.config();

// const app = express();

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://med-connect-d9mb.vercel.app",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.options("*", cors());


// app.use(express.json());


// app.use("/api/users", userRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);


// app.get("/", (req, res) => {
//   res.send("Backend is running on Render");
// });

// // test commit

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// // server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
