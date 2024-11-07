// src/routes/project_files.ts
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { ProjectService } from "../services/project_service.js";
import { generateHATEOASLinks } from "../lib/hateoas.js";

const router = Router();

// Apply auth middleware to all file routes
router.use(authMiddleware);
/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectFile:
 *       type: object
 *       required:
 *         - projectID
 *         - fileName
 *         - isDirectory
 *       properties:
 *         FileID:
 *           type: integer
 *           description: Auto-generated ID of the file
 *         projectID:
 *           type: integer
 *           description: ID of the project the file belongs to
 *         parentDirectory:
 *           type: integer
 *           nullable: true
 *           description: ID of the parent directory, if any
 *         fileName:
 *           type: string
 *           description: Name of the file
 *         isDirectory:
 *           type: boolean
 *           description: Indicates if the file is a directory
 *         creationDate:
 *           type: string
 *           format: date-time
 *           description: Creation date of the file
 *       example:
 *         FileID: 1
 *         projectID: 101
 *         parentDirectory: null
 *         fileName: "example.txt"
 *         isDirectory: false
 *         creationDate: "2024-10-31T12:00:00Z"
 *     AddFileRequest:
 *       type: object
 *       required:
 *         - ProjectID
 *         - Filename
 *       properties:
 *         ProjectID:
 *           type: integer
 *           description: ID of the project
 *         Filename:
 *           type: string
 *           description: Name of the file to add
 *         ParentDirectory_FileID:
 *           type: integer
 *           nullable: true
 *           description: ID of the parent directory, if any
 *       example:
 *         ProjectID: 101
 *         Filename: "example.txt"
 *         ParentDirectory_FileID: null
 *     UpdateFileRequest:
 *       type: object
 *       required:
 *         - ProjectID
 *         - UpdatedFile
 *       properties:
 *         ProjectID:
 *           type: integer
 *           description: ID of the project
 *         UpdatedFile:
 *           type: object
 *           $ref: '#/components/schemas/ProjectFile'
 *     FileResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           description: Message detailing the operation result
 *           example: "File added"
 *         data:
 *           $ref: '#/components/schemas/ProjectFile'
 */

/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: Endpoints for managing project files
 */

/**
 * @swagger
 * /project_files:
 *   post:
 *     summary: Add a new file to a project
 *     tags: [Files]
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token for user validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddFileRequest'
 *     responses:
 *       201:
 *         description: File added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: Missing required ProjectID or Filename
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
 *                   example: "ProjectID and Filename are required"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project_files/{fileId}:
 *   delete:
 *     summary: Delete a file by its ID
 *     tags: [Files]
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token for user validation
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the file to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProjectID:
 *                 type: integer
 *                 description: ID of the project
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: Missing ProjectID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project_files/{fileId}:
 *   put:
 *     summary: Update a file by its ID
 *     tags: [Files]
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token for user validation
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the file to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFileRequest'
 *     responses:
 *       200:
 *         description: File updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: Missing required ProjectID or UpdatedFile
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project_files/{fileId}:
 *   get:
 *     summary: Get details of a file by its ID
 *     tags: [Files]
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token for user validation
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the file to retrieve
 *       - in: query
 *         name: ProjectID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: File details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: Missing required ProjectID
 *       500:
 *         description: Internal server error
 */

/**
 * @route POST /project_files
 * @desc Add a new file
 */
router.post("/", async (req: Request, res: Response) => {
    const { ProjectID, Filename, ParentDirectory_FileID } = req.body;
    const userId = (req as any).userId;

    if (!ProjectID || !Filename) {
        res.status(400).json({
            status: "error",
            message: "ProjectID and Filename are required",
        });
        return;
    }

    try {
        const status = await ProjectService.addFile(
            userId,
            ProjectID,
            Filename,
            ParentDirectory_FileID,
        );
        res.status(201).json({
            status: "success",
            message: "File added",
            data: status,
        });
    } catch (error) {
        console.error("Error adding file:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route DELETE /project_files/:fileId
 * @desc Delete a file
 */
router.delete("/:fileId", async (req: Request, res: Response) => {
    const { fileId } = req.params;
    const { ProjectID } = req.body;
    const userId = (req as any).userId;

    if (!ProjectID) {
        res.status(400).json({
            status: "error",
            message: "ProjectID is required",
        });
        return;
    }

    try {
        const status = await ProjectService.deleteFile(
            userId,
            ProjectID,
            Number(fileId),
        );
        res.json({ status: "success", message: "File deleted", data: status });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route PUT /project_files/:fileId
 * @desc Update a file
 */
router.put("/:fileId", async (req: Request, res: Response) => {
    const { fileId } = req.params;
    const { ProjectID, UpdatedFile } = req.body;
    const userId = (req as any).userId;

    if (!ProjectID || !UpdatedFile) {
        res.status(400).json({
            status: "error",
            message: "ProjectID and UpdatedFile are required",
        });
        return;
    }

    try {
        const status = await ProjectService.updateFile(
            userId,
            ProjectID,
            Number(fileId),
            UpdatedFile,
        );
        res.json({ status: "success", message: "File updated", data: status });
    } catch (error) {
        console.error("Error updating file:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route GET /project_files/:fileId
 * @desc Get a file
 */
router.get("/:fileId", async (req: Request, res: Response) => {
    const { fileId } = req.params;
    const { ProjectID } = req.query;
    const userId = (req as any).userId;

    if (!ProjectID) {
        res.status(400).json({
            status: "error",
            message: "ProjectID is required",
        });
        return;
    }

    try {
        const fileData = await ProjectService.getFile(
            userId,
            Number(ProjectID),
            Number(fileId),
        );
        res.json({ status: "success", data: fileData });
    } catch (error) {
        console.error("Error getting file:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route GET /project_files
 * @desc List all files in a project with pagination and HATEOAS links
 */
router.get("/", async (req: Request, res: Response) => {
    const { ProjectID, UserID } = req.query;

    if (!ProjectID) {
        res.status(400).json({
            status: "error",
            message: "ProjectID is required",
        });
        return;
    }

    // Access limit and offset from pagination middleware
    const { limit, offset } = (req as any).pagination;

    try {
        // Call the ProjectService to get paginated files and total count
        const { total, files } = await ProjectService.listFiles(
            Number(UserID),
            Number(ProjectID),
            limit,
            offset,
        );

        // Generate HATEOAS links
        const links = generateHATEOASLinks(req, total, limit, offset);

        // Respond with paginated files and HATEOAS links
        res.json({
            status: "success",
            total,
            limit,
            offset,
            data: files,
            links,
        });
    } catch (error: any) {
        console.error("Error listing files:", error.message);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

export default router;
