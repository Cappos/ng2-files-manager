export class FileElement {
    id?: string;
    isFolder: boolean;
    name: string;
    orginalName?: string;
    extension?: string;
    parent: string;
    oldParent: string;
    currentPath: string;
    oldPath: string;
    mimetype: string;
}
