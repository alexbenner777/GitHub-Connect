import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import cabinetRouter from "./cabinet";
import investmentsRouter from "./investments";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(cabinetRouter);
router.use(investmentsRouter);
router.use(statsRouter);

export default router;
