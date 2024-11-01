export interface Project {
    ProjectID: number | null;
    OwningUserID: number;
    ProjectName: string;
    CreationDate: Date;
}
export interface ProjectFile {
    FileID: number | null;
    projectID: number;
    parentDirectory: number | null;
    fileName: string;
    isDirectory: boolean;
    creationDate: Date;
}
export interface ProjectFileStructure {
    file: ProjectFile;
    //key is file name
    children: Map<string, ProjectFileStructure | ProjectFile>;
}
