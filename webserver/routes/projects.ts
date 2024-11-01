// src/routes/projects.ts
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { ProjectService } from "../services/project_service.js";

const router = Router();

// Apply auth middleware to all project routes
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - OwningUserID
 *         - ProjectName
 *       properties:
 *         ProjectID:
 *           type: integer
 *           description: Auto-generated ID of the project
 *         OwningUserID:
 *           type: integer
 *           description: ID of the user who owns the project
 *         ProjectName:
 *           type: string
 *           description: Name of the project
 *         CreationDate:
 *           type: string
 *           format: date-time
 *           description: Project creation date
 *       example:
 *         ProjectID: 1
 *         OwningUserID: 42
 *         ProjectName: "My Project"
 *         CreationDate: "2024-10-28T12:00:00Z"
 *     AddProjectRequest:
 *       type: object
 *       required:
 *         - ProjectName
 *       properties:
 *         ProjectName:
 *           type: string
 *           description: Name of the project to create
 *       example:
 *         ProjectName: "New Project"
 *     UpdateProjectRequest:
 *       type: object
 *       required:
 *         - ProjectName
 *       properties:
 *         ProjectName:
 *           type: string
 *           description: Updated name of the project
 *       example:
 *         ProjectName: "Updated Project Name"
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status of the response
 *           example: "success"
 *         message:
 *           type: string
 *           description: Message detailing the operation result
 *           example: "Project created"
 *         data:
 *           $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Endpoints related to project management
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Add a new project
 *     tags: [Projects]
 *     security:
 *       - TokenID: []
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Project name is required
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
 *                   example: "ProjectName is required"
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     security:
 *       - TokenID: []
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID for authentication
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Update the name of a project by ID
 *     tags: [Projects]
 *     security:
 *       - TokenID: []
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID for authentication
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Project name is required
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
 *                   example: "ProjectName is required"
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all projects for a user
 *     tags: [Projects]
 *     security:
 *       - TokenID: []
 *     parameters:
 *       - in: header
 *         name: TokenID
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID for authentication
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error
 */

/**
 * @route POST /projects
 * @desc Add a new project
 */
router.post("/", async (req: Request, res: Response) => {
    const { ProjectName } = req.body;
    const userId = (req as any).userId;

    if (!ProjectName) {
        res.status(400).json({
            status: "error",
            message: "ProjectName is required",
        });
        return;
    }

    try {
        const status = await ProjectService.addProject(userId, ProjectName);
        res.status(201).json({
            status: "success",
            message: "Project created",
            data: status,
        });
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route DELETE /projects/:projectId
 * @desc Delete a project
 */
router.delete("/:projectId", async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const userId = (req as any).userId;

    try {
        const status = await ProjectService.deleteProject(
            userId,
            Number(projectId),
        );
        res.json({
            status: "success",
            message: "Project deleted",
            data: status,
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route PUT /projects/:projectId
 * @desc Update project name
 */
router.put("/:projectId", async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { ProjectName } = req.body;
    const userId = (req as any).userId;

    if (!ProjectName) {
        res.status(400).json({
            status: "error",
            message: "ProjectName is required",
        });
        return;
    }

    try {
        const status = await ProjectService.updateProjectName(
            userId,
            Number(projectId),
            ProjectName,
        );
        res.json({
            status: "success",
            message: "Project updated",
            data: status,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

/**
 * @route GET /projects
 * @desc List all projects for a user
 */
router.get("/", async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const projects = await ProjectService.listProjects(userId);
        res.json({ status: "success", data: projects });
    } catch (error) {
        console.error("Error listing projects:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

export default router;
