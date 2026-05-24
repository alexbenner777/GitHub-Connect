import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://trendspartner.space",
  "https://www.trendspartner.space",
  ...(process.env.REPLIT_DEV_DOMAIN ? [`https://${process.env.REPLIT_DEV_DOMAIN}`] : []),
  ...(process.env.RENDER_EXTERNAL_URL ? [process.env.RENDER_EXTERNAL_URL] : []),
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:5000", "http://localhost:22520"] : []),
];

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (!isProduction) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      const err: any = new Error(`CORS: origin not allowed — ${origin}`);
      err.status = 403;
      cb(err);
    },
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов, попробуйте через 15 минут" },
});

const investLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов на инвестиции" },
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authLimiter);
app.use("/api/investments", investLimiter);

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const staticDir = path.resolve(__dirname, "../../trends-landing/dist/public");
  app.use(express.static(staticDir));
  app.get("/{*any}", (_req: Request, res: Response) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any)?.status ?? (err as any)?.statusCode ?? 500;
  const message = status < 500 ? String((err as any)?.message ?? "Bad request") : "Internal server error";
  if (status >= 500) logger.error(err, "Unhandled error");
  res.status(status).json({ error: message });
});

export default app;
