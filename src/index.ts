import express from "express";
import routes from "./routers/routes";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cookieParser from "cookie-parser";

const app = express();

// Jika di belakang reverse proxy (nginx), aktifkan:
// app.set('trust proxy', 1); // uncomment jika menggunakan secure cookies atau rate-limiter berbasis IP
app.set("trust proxy", true);

// --- Basic parsers & static ---
app.use(bodyParser.json({ limit: "10mb" })); // batasi body size
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../../uploads"), {
    // opsi keamanan: jangan izinkan directory listing
    index: false,
    // set header untuk file statis (optional)
  })
);

// --- Security middlewares ---
app.use(
  helmet({
    // helmet mengatur banyak header keamanan; kita akan tetap set CSP/frame-ancestors manual di bawah jika perlu
  })
);

// Prevent HTTP parameter pollution
app.use(hpp());

// Rate limiting (contoh sederhana)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per window per IP (sesuaikan)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Hide X-Powered-By
app.disable("x-powered-by");

// --- CORS: jangan pakai "*" di production. batasi ke origin yang valid ---
const allowedOrigins = [
  "https://elhusain.travel",
  "https://www.elhusain.travel",
  "https://panel.elhusain.travel",
  // tambahkan origin lain yang perlu akses
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests like curl/postman (origin == undefined)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: origin not allowed"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true, // jika Anda mengirim cookies / Authorization via browser
  })
);

// --- Clickjacking protection (CSP frame-ancestors + X-Frame-Options) ---
// Pilihan:
// - Jika NGINX sudah men-SET header global, jangan set lagi di sini (akan duplikat).
// - Jika Anda butuh per-route control, set header di Express dan jangan set global di Nginx.
app.use((req, res, next) => {
  // default: blok semua embedding (aman)
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Contoh pengecualian: route widget yang perlu di-embed oleh partner
app.get("/widget", (req, res, next) => {
  // override CSP untuk route ini agar hanya partner.example.com yang boleh embed
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://partner.example.com"
  );
  // jika X-Frame-Options ada dari middleware global, Anda boleh hapus:
  // res.removeHeader("X-Frame-Options"); // tapi jika Nginx menambahkan XFO, Anda tidak bisa menghapusnya dari Express
  res.send("<h1>Widget content</h1>");
});

// --- Routes utama ---
app.use("/api", routes);

// contoh health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
