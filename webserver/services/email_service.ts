import axios from "axios";
import express from "express";

// base url for user service (change to aws later?)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
// const USER_SERVICE_BASE_URL = "http://ec2-18-223-15-246.us-east-2.compute.amazonaws.com";

// this should be in the user_service file but wanted to put here for now to not cause git conflicts
export const getUserEmail = async (userId: number): Promise<string> => {
    try {
        // get req to get user's email
        const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);

        // Extract the email from the response
        if (response.data && response.data.email) {
            return response.data.email;
        } else {
            throw new Error("Email not found in response");
        }
    } catch (err) {
        const error = err as Error;
        console.error(
            `Failed to fetch email for userId ${userId}:`,
            error.message,
        );
        throw new Error("Failed to fetch user email.");
    }
};

const router = express.Router();

// this should be in the project_service file but wanted to put here for now to not cause git conflicts
router.post("/project/created", async (req, res) => {
    const { projectId, userId } = req.body;

    try {
        // getting the users email from the user service
        const userEmail = await getUserEmail(userId);

        // email details
        const subject = "Your Project Was Successfully Created!";
        const message = `Congratulations! Your project with ID ${projectId} has been successfully created.`;

        // send the email with lambda
        await sendEmail(userEmail, subject, message);

        res.status(200).json({ message: "Email sent successfully." });
    } catch (err) {
        const error = err as Error;
        console.error(
            "Error processing project creation notification:",
            error.message,
        );
        res.status(500).json({
            message: "Failed to send email.",
            error: error.message,
        });
    }
});

// after creating lambda function get the gateway url and replace this
const API_GATEWAY_URL =
    "https://xyz123.execute-api.us-east-2.amazonaws.com/send-email";

export const sendEmail = async (
    toEmail: string,
    subject: string,
    message: string,
): Promise<void> => {
    try {
        const response = await axios.post(API_GATEWAY_URL, {
            toEmail,
            subject,
            message,
        });

        console.log("Email sent successfully:", response.data);
    } catch (err) {
        const error = err as Error;
        console.error("Error sending email via Lambda:", error.message);
        throw new Error("Failed to send email.");
    }
};

export default router;
