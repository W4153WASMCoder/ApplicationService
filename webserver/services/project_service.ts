// src/services/projectService.ts
import {
    ProjectFileStructure,
    Project,
    ProjectFile,
} from "../models/files_models.js";
// src/services/projectService.ts

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL;

export class ProjectService {
    /**
     * Adds a new project for the user.
     * @param userId User ID obtained from authentication middleware
     * @param ProjectName Name of the new project
     */
    static async addProject(
        userId: number,
        ProjectName: string,
    ): Promise<Project> {
        try {
            const response = await axios.post(
                `${PROJECT_SERVICE_URL}/projects`,
                {
                    OwningUserID: userId,
                    ProjectName,
                },
            );

            if (response.status !== 201)
                throw new Error("Failed to create project");

            const project = JSON.parse(response.data);
            return project;
        } catch (error: any) {
            console.error("Error adding project:", error.message);
            throw error;
        }
    }

    /**
     * Deletes a project.
     * @param userId User ID obtained from authentication middleware
     * @param projectId ID of the project to delete
     */
    static async deleteProject(
        userId: number,
        projectId: number,
    ): Promise<void> {
        try {
            const response = await axios.delete(
                `${PROJECT_SERVICE_URL}/projects/${projectId}`,
            );
            if (response.status !== 204)
                throw new Error("Failed to delete project");
        } catch (error: any) {
            console.error("Error deleting project:", error.message);
            throw error;
        }
    }

    /**
     * Updates the name of a project.
     * @param userId User ID obtained from authentication middleware
     * @param projectId ID of the project to update
     * @param ProjectName New name for the project
     */
    static async updateProjectName(
        userId: number,
        projectId: number,
        ProjectName: string,
    ): Promise<void> {
        try {
            const response = await axios.put(
                `${PROJECT_SERVICE_URL}/projects/${projectId}`,
                {
                    ProjectName,
                },
            );

            if (response.status !== 200)
                throw new Error("Failed to update project name");
        } catch (error: any) {
            console.error("Error updating project name:", error.message);
            throw error;
        }
    }

    /**
     * Lists all projects owned by the user.
     * @param userId User ID obtained from authentication middleware
     */
    static async listProjects(
        userId: number,
    ): Promise<{ Projects: Project[] }> {
        try {
            const response = await axios.get(
                `${PROJECT_SERVICE_URL}/projects`,
                {
                    params: {
                        OwningUserID: userId,
                    },
                },
            );

            if (response.status === 200) {
                const projects = response.data.data as Project[];
                return { Projects: projects };
            } else {
                throw new Error("Failed to list projects");
            }
        } catch (error: any) {
            console.error("Error listing projects:", error.message);
            throw error;
        }
    }

    /**
     * Adds a new file to a project.
     * @param userId User ID obtained from authentication middleware
     * @param ProjectID ID of the project
     * @param FileName Name of the new file
     * @param ParentDirectory_FileID ID of the parent directory (optional)
     */
    static async addFile(
        userId: number,
        ProjectID: number,
        FileName: string,
        ParentDirectory_FileID: number | null,
    ): Promise<void> {
        try {
            const response = await axios.post(
                `${PROJECT_SERVICE_URL}/project_files`,
                {
                    ProjectID,
                    ParentDirectory: ParentDirectory_FileID,
                    FileName,
                    IsDirectory: false,
                },
            );

            if (response.status !== 201) throw new Error("Failed to add file");
        } catch (error: any) {
            console.error("Error adding file:", error.message);
            throw error;
        }
    }

    /**
     * Deletes a file from a project.
     * @param userId User ID obtained from authentication middleware
     * @param ProjectID ID of the project
     * @param FileID ID of the file to delete
     */
    static async deleteFile(
        userId: number,
        ProjectID: number,
        FileID: number,
    ): Promise<string> {
        try {
            const response = await axios.delete(
                `${PROJECT_SERVICE_URL}/project_files/${FileID}`,
            );
            if (response.status === 204) {
                return "File deleted successfully";
            } else {
                throw new Error("Failed to delete file");
            }
        } catch (error: any) {
            console.error("Error deleting file:", error.message);
            throw error;
        }
    }

    /**
     * Updates a file in a project.
     * @param userId User ID obtained from authentication middleware
     * @param ProjectID ID of the project
     * @param FileID ID of the file to update
     * @param UpdatedFile Object containing updated file properties
     */
    static async updateFile(
        userId: number,
        ProjectID: number,
        FileID: number,
        UpdatedFile: Partial<ProjectFile>,
    ): Promise<void> {
        try {
            const response = await axios.put(
                `${PROJECT_SERVICE_URL}/project_files/${FileID}`,
                UpdatedFile,
            );

            if (response.status !== 200)
                throw new Error("Failed to update file");
        } catch (error: any) {
            console.error("Error updating file:", error.message);
            throw error;
        }
    }

    /**
     * Retrieves a file from a project.
     * @param userId User ID obtained from authentication middleware
     * @param ProjectID ID of the project
     * @param FileID ID of the file to retrieve
     */
    static async getFile(
        userId: number,
        ProjectID: number,
        FileID: number,
    ): Promise<ProjectFile> {
        try {
            const response = await axios.get(
                `${PROJECT_SERVICE_URL}/project_files/${FileID}`,
            );

            if (response.status === 200) {
                const fileData = JSON.parse(response.data) as ProjectFile;
                return fileData;
            } else {
                throw new Error("Failed to get file");
            }
        } catch (error: any) {
            console.error("Error getting file:", error.message);
            throw error;
        }
    }

    /**
     * Lists all files in a project and returns the file structure as JSON.
     * @param userId User ID obtained from authentication middleware
     * @param ProjectID ID of the project
     */
    static async listFiles(
        userId: number,
        ProjectID: number,
        limit: number,
        offset: number,
    ): Promise<{ total: number; files: ProjectFileStructure[] }> {
        try {
            const response = await axios.get(
                `${PROJECT_SERVICE_URL}/project_files`,
                {
                    params: {
                        ProjectID: ProjectID,
                        limit: limit, // Adjust limit as needed
                        offset: offset,
                    },
                },
            );

            if (response.status === 200) {
                const files = JSON.parse(response.data.data) as ProjectFile[];
                const fileStructure = this.buildFileStructure(files);
                return { total: files.length, files: fileStructure };
            } else {
                throw new Error("Failed to list files");
            }
        } catch (error: any) {
            console.error("Error listing files:", error.message);
            throw error;
        }
    }

    /**
     * Helper method to build the file structure from a list of files.
     * @param files Array of ProjectFile objects
     * @returns ProjectFileStructure[] with nested file structure
     */
    private static buildFileStructure(
        files: ProjectFile[],
    ): ProjectFileStructure[] {
        const fileMap = new Map<number, ProjectFileStructure>();
        const rootFiles: ProjectFileStructure[] = [];

        // Initialize fileMap with each file as an individual entry, with children as an empty Map<string, ProjectFileStructure | ProjectFile>
        files.forEach((file) => {
            fileMap.set(file.FileID!, {
                file,
                children: new Map<string, ProjectFileStructure | ProjectFile>(),
            });
        });

        // Build the hierarchical structure
        files.forEach((file) => {
            if (file.parentDirectory) {
                // If the file has a parent, add it as a child of that parent using fileName as the key
                const parent = fileMap.get(file.parentDirectory);
                if (parent) {
                    parent.children.set(
                        file.fileName,
                        fileMap.get(file.FileID!)!,
                    );
                }
            } else {
                // If no parent, this file is at the root level
                rootFiles.push(fileMap.get(file.FileID!)!);
            }
        });

        return rootFiles;
    }
}
