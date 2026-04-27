import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || "default-jwt-secret") as string;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export class AuthMiddleware {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }

  static authorize(roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Permission denied" });
      }
      next();
    };
  }
}
