import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(AuthMiddleware.authenticate);
router.use(AuthMiddleware.authorize(["admin"]));

router.get("/audit-logs", AdminController.getAuditLogs);
router.get("/users", AdminController.getUsers);
router.patch("/users/:id/status", AdminController.updateUserStatus);

export default router;
