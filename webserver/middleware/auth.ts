// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { User } from "../services/user_service.js";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { tokenid } = req.headers;
    const uid = req.uid;
    console.log(uid);

    if (!tokenid) {
        res.status(401).json({
            status: "error",
            message: "TokenID header missing",
        });
        return;
    }

    try {
        const userId = await User.verifyToken(tokenid as string, uid as string);
        (req as any).userId = userId; // Attach UserID to request
        next();
    } catch (error: any) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ status: "error", message: "Invalid TokenID" });
    }
};
