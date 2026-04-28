import { Router } from "express";
import { VitalController } from "../controllers/vital.controller";
import { PrescriptionController } from "../controllers/prescription.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(AuthMiddleware.authenticate);

// Vitals
router.post(
  "/vitals",
  AuthMiddleware.authorize(["nurse", "admin"]),
  VitalController.create
);

router.get(
  "/vitals/:patientId",
  AuthMiddleware.authorize(["doctor", "nurse", "admin"]),
  VitalController.getByPatientId
);

// Prescriptions
router.post(
  "/prescriptions",
  AuthMiddleware.authorize(["doctor", "admin"]),
  PrescriptionController.create
);

router.get(
  "/prescriptions/pending",
  AuthMiddleware.authorize(["pharmacist", "admin"]),
  PrescriptionController.listPending
);

router.patch(
  "/prescriptions/:id/status",
  AuthMiddleware.authorize(["pharmacist", "admin"]),
  PrescriptionController.updateStatus
);

export default router;
