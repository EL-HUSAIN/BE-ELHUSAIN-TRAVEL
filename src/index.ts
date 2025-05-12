import express from "express";
import routes from "./routers/routes";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*", // Menyediakan akses untuk semua origin (atau bisa sesuaikan dengan domain tertentu)
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
    allowedHeaders: ["Content-Type", "Authorization"], // Headers yang diizinkan
  })
);

app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
