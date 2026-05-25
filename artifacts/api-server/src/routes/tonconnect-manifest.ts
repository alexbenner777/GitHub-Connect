import { Router } from "express";

const router = Router();

router.get("/tonconnect-manifest.json", (req, res) => {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "";
  const origin = `${proto}://${host}`;

  res.json({
    url: origin,
    name: "Trends Investment",
    iconUrl: `${origin}/favicon.svg`,
  });
});

export default router;
