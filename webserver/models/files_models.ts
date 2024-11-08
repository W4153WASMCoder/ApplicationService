export interface Project {
    ProjectID: number | null;
    OwningUserID: number;
    ProjectName: string;
    CreationDate: Date;
}
export interface ProjectFile {
    FileID: number | null;
    ProjectID: number;
    ParentDirectory: number | null;
    FileName: string;
    IsDirectory: boolean;
    CreationDate: Date;
}
export interface ProjectFileStructure {
    file: ProjectFile;
    //key is file name
    children: Map<string, ProjectFileStructure | ProjectFile>;
}
