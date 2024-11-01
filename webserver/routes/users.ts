import { Router, Request, Response } from "express";
import { User } from "../services/user_service.js";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       type: object
 *       properties:
 *         UserID:
 *           type: integer
 *           description: Auto-generated ID of the user
 *         sub:
 *           type: string
 *           description: Unique identifier from the OpenID provider
 *         email:
 *           type: string
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's full name
 *         picture:
 *           type: string
 *           description: URL to the user's profile picture
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the user's last login
 *       example:
 *         UserID: 1
 *         sub: "google-oauth2|1234567890"
 *         email: "user@example.com"
 *         name: "John Doe"
 *         picture: "https://example.com/johndoe.jpg"
 *         lastLogin: "2024-10-28T12:00:00Z"
 *     ActiveToken:
 *       type: object
 *       properties:
 *         TokenID:
 *           type: integer
 *           description: Auto-generated ID of the token
 *         UserID:
 *           type: integer
 *           description: The ID of the user the token belongs to
 *         TTL:
 *           type: integer
 *           description: Time to live in seconds for the token
 *         CreationDate:
 *           type: string
 *           format: date-time
 *           description: Token creation date
 *       example:
 *         TokenID: 123
 *         UserID: 1
 *         TTL: 3600
 *         CreationDate: "2024-10-31T12:00:00Z"
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *       example:
 *         username: "john.doe"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status of the login operation
 *           example: "success"
 *         message:
 *           type: string
 *           description: Message detailing the login result
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *               description: The ID of the authenticated user
 *             token:
 *               type: object
 *               $ref: '#/components/schemas/ActiveToken'
 *       example:
 *         status: "success"
 *         message: "Login successful"
 *         data:
 *           userId: 1
 *           token:
 *             TokenID: 123
 *             UserID: 1
 *             TTL: 3600
 *             CreationDate: "2024-10-31T12:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate user and generate a token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Username is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Username is required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @route POST /login
 * @desc Authenticate user and generate token
 */
router.post("/login", async (req: Request, res: Response) => {
    const { username } = req.body;

    // Validate input
    if (!username) {
        res.status(400).json({
            status: "error",
            message: "Username is required",
        });
        return;
    }

    try {
        // Find user by username
        const user = await User.findUserByUserName(username);
        // If user not found, return an error
        if (!user || !user.UserID) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }

        // Create token for the user
        const token = await User.createToken(user.UserID!);

        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: { userId: user.UserID, token },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

export default router;
