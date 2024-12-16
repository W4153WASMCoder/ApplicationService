import { Request, Response, NextFunction } from "express";

const generateUID = (): string => {
    return (
        Date.now().toString(36) + Math.random().toString(36).substring(2, 11)
    );
};

export function log_init(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const uid = generateUID();
    // res.setHeader("uid", uid);
    req.uid = uid;
    const timestamp = new Date().toISOString();
    console.log(
        `[${timestamp}] ${uid} : ${req.method} ${req.originalUrl} request being served.`,
    );
    next();
}

export function log_close(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const uid = req.uid;
    const timestamp = new Date().toISOString();
    console.log(
        `[${timestamp}] ${uid} : ${req.method} ${req.originalUrl} request served.`,
    );
    next();
}
