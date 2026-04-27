import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(AuthMiddleware.authenticate);

router.post(
  "/", 
  AuthMiddleware.authorize(["doctor", "admin"]), 
  PatientController.create
);

router.get(
  "/", 
  AuthMiddleware.authorize(["doctor", "nurse", "admin"]), 
  PatientController.list
);

router.get(
  "/:id", 
  AuthMiddleware.authorize(["doctor", "nurse", "admin"]), 
  PatientController.getById
);

export default router;
