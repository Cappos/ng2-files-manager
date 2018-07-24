import {Component, OnInit} from '@angular/core';
import {FileElement} from './file-explorer/model/file-element';
import {FileService} from './service/file.service';
import {Observable} from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    fileElements: Observable<FileElement[]>;
    currentRoot: FileElement;
    currentPath: string;
    currentPathId: FileElement[] = [];
    canNavigateUp = false;
    selected: FileElement[];
    cuted: FileElement[];
    fileTypes: string = 'image/*,video/*,.pdf,.csv,.doc,.xls';


    constructor(private fileService: FileService) {
    }

    ngOnInit() {
        this.updateFileElementQuery();
    }

    addFolder(folder: { name: string }) {
        const newFolder = {
            isFolder: true,
            name: folder.name,
            parent: this.currentRoot ? this.currentRoot.currentPath : ''
        };
        this.fileService.add(newFolder).subscribe(res => {
            this.updateFileElementQuery();
        })
    }

    addFile(file) {
        if (file.fileAdded) {
            this.updateFileElementQuery();
        }
    }

    removeElement(element) {
        this.fileService.delete(element).subscribe(res => {
            this.updateFileElementQuery();
        });
    }

    renameElement(element: FileElement) {
        let name = element.isFolder ? element.name : `${element.name}.${element.extension}`;
        this.fileService.rename(element.currentPath, name, element.parent, element.isFolder).subscribe(res => {
            this.updateFileElementQuery();
        });
    }

    updateFileElementQuery() {
        this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot : 'root');
    }

    navigateUp() {
        if (this.currentRoot && this.currentRoot.parent === '') {
            this.currentRoot = null;
            this.canNavigateUp = false;
            this.updateFileElementQuery();
        } else {
            this.currentRoot = this.fileService.get(this.currentRoot.parent);
            this.updateFileElementQuery();
        }
        this.currentPath = this.popFromPath(this.currentPath);
        if (this.currentPath === '') {
            this.currentPath = '/';
        }
        this.currentPathId.splice(-1, 1);
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.updateFileElementQuery();
        this.currentPath = this.pushToPath(this.currentPath, element.name);
        if (this.currentPathId.indexOf(element) != -1) {
            let index = this.currentPathId.indexOf(element);
            this.currentPathId.splice(index + 1);
        }
        else {
            this.currentPathId.push(element);
        }
        this.canNavigateUp = true;

    }

    pushToPath(path: string, folderName: string) {
        let p = path ? path : '';
        p += `${folderName}/`;
        return p;
    }

    popFromPath(path: string) {
        let p = path ? path : '';
        const split = p.split('/');
        split.splice(split.length - 2, 1);
        p = split.join('/');
        return p;
    }

    onPaste(ev: any) {
        let currentPath = this.currentPath.replace(/\s/g, '\\ ');
        console.log(this.currentPath);
        this.fileService.update(ev, this.currentPath).subscribe((res) => {
            this.updateFileElementQuery();
        });
    }
}
