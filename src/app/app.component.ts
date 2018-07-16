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
    curenFolder: any;
    canNavigateUp = false;
    selected: FileElement[];
    cuted: FileElement[];


    constructor(private fileService: FileService) {
    }

    ngOnInit() {
        const folderA = this.fileService.add({name: 'Folder A', isFolder: true, parent: 'root', oldParent: ''});
        this.fileService.add({name: 'Folder B', isFolder: true, parent: 'root', oldParent: ''});
        this.fileService.add({name: 'Folder C', isFolder: true, parent: folderA.id, oldParent: ''});
        this.fileService.add({name: 'File A', isFolder: false, parent: 'root', oldParent: ''});
        this.fileService.add({name: 'File B', isFolder: false, parent: 'root', oldParent: ''});

        this.updateFileElementQuery();
    }

    addFolder(folder: { name: string }) {
        this.fileService.add({isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root', oldParent: ''});
        this.updateFileElementQuery();
    }

    removeElement(element: FileElement) {
        this.fileService.delete(element.id);
        this.updateFileElementQuery();
    }

    moveElement(event: { element: FileElement; moveTo: FileElement }) {
        this.fileService.update(event.element.id, {parent: event.moveTo.id});
        this.updateFileElementQuery();
    }

    renameElement(element: FileElement) {
        this.fileService.update(element.id, {name: element.name});
        this.updateFileElementQuery();
    }

    updateFileElementQuery() {
        this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
    }

    navigateUp() {
        if (this.currentRoot && this.currentRoot.parent === 'root') {
            this.currentRoot = null;
            this.curenFolder = null;
            this.canNavigateUp = false;
            this.updateFileElementQuery();
        } else {
            this.curenFolder = this.currentRoot;
            this.currentRoot = this.fileService.get(this.currentRoot.parent);
            this.updateFileElementQuery();
        }
        this.currentPath = this.popFromPath(this.currentPath);
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.curenFolder = element;
        this.updateFileElementQuery();
        this.currentPath = this.pushToPath(this.currentPath, element.name);
        this.canNavigateUp = true;
    }

    pushToPath(path: string, folderName: string) {
        let p = path ? path : '';
        p += `${folderName} / `;
        return p;
    }

    popFromPath(path: string) {
        let p = path ? path : '';
        const split = p.split(' / ');
        split.splice(split.length - 2, 1);
        p = split.join(' / ');
        return p;
    }

    onPaste(ev: any) {
        console.log(this.curenFolder);
        console.log(ev);
    }

}
