// src/routes/projects.ts
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { ProjectService } from "../services/project_service.js";
import { paginate, Pagination } from "../middleware/pagination.js";
import { generateHATEOASLinks } from "../lib/hateoas.js";
import { Project } from "../models/files_models.js";

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
 *         links:
 *           type: object
 *           properties:
 *             self:
 *               type: string
 *               description: Link to the project itself
 *             update:
 *               type: string
 *               description: Link to update the project
 *             delete:
 *               type: string
 *               description: Link to delete the project
 *             open:
 *               type: string
 *               description: Link to open project files
 *       example:
 *         ProjectID: 1
 *         OwningUserID: 42
 *         ProjectName: "My Project"
 *         CreationDate: "2024-10-28T12:00:00Z"
 *         links:
 *           self: "http://localhost:8000/projects/1"
 *           update: "http://localhost:8000/projects/1"
 *           delete: "http://localhost:8000/projects/1"
 *           open: "http://localhost:8000/project_files?ProjectID=1&UserID=42"
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
 *     summary: List all projects for a user with pagination
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
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Number of projects to return
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of projects to skip before starting to return results
 *     responses:
 *       200:
 *         description: A paginated list of projects with HATEOAS links
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
 *                 links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                       description: Link to the current page of projects
 *                     first:
 *                       type: string
 *                       description: Link to the first page of projects
 *                     last:
 *                       type: string
 *                       description: Link to the last page of projects
 *                     prev:
 *                       type: string
 *                       description: Link to the previous page of projects
 *                     next:
 *                       type: string
 *                       description: Link to the next page of projects
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
        // adding the project and getting the data
        const newProject = await ProjectService.addProject(userId, ProjectName);

        // generate links
        const links = {
            self: `${req.protocol}://${req.get("host")}/projects/${newProject.ProjectID}`,
            update: `${req.protocol}://${req.get("host")}/projects/${newProject.ProjectID}`,
            delete: `${req.protocol}://${req.get("host")}/projects/${newProject.ProjectID}`,
            open: `${req.protocol}://${req.get("host")}/project_files?ProjectID=${newProject.ProjectID}&UserID=${newProject.OwningUserID}`,
        };

        res.status(201).json({
            status: "success",
            message: "Project created",
            data: {
                ...newProject,
                links, // including hateos links in the response back
            },
        });
    } catch (error: any) {
        console.error("Error creating project:", error);
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

router.get("/", paginate, async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { limit, offset } = (req as any).pagination as Pagination;

    try {
        // Fetch total project count and the paginated list of projects
        const { Projects, total } = await ProjectService.listProjects(
            userId,
            limit,
            offset,
        );

        // Generate HATEOAS links for pagination
        const paginationLinks = generateHATEOASLinks(req, total, limit, offset);

        // Add HATEOAS links to each project in the data
        const projectsWithLinks = Projects.map((project: Project) => ({
            project,
            links: {
                self: `${req.protocol}://${req.get("host")}/projects/${project.ProjectID}`,
                update: `${req.protocol}://${req.get("host")}/projects/${project.ProjectID}`,
                delete: `${req.protocol}://${req.get("host")}/projects/${project.ProjectID}`,
                open: `${req.protocol}://${req.get("host")}/project_files?ProjectID=${project.ProjectID}&UserID=${project.OwningUserID}`,
            },
        }));

        res.json({
            status: "success",
            data: projectsWithLinks,
            links: paginationLinks,
        });
    } catch (error) {
        console.error("Error listing projects:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

export default router;
