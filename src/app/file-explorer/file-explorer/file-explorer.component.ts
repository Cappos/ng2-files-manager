import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileElement} from '../model/file-element';
import {MatDialog, MatMenuTrigger} from '@angular/material';
import {NewFolderDialogComponent} from '../modals/new-folder-dialog/new-folder-dialog.component';
import {RenameDialogComponent} from '../modals/rename-dialog/rename-dialog.component';

@Component({
    selector: 'app-file-explorer',
    templateUrl: './file-explorer.component.html',
    styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

    @Input() fileElements: FileElement[];
    @Input() canNavigateUp: string;
    @Input() path: string;
    @Input() pathId: any;
    @Input() fileTypes: string;

    @Output() folderAdded = new EventEmitter<{ name: string }>();
    @Output() filesAdded = new EventEmitter<{ fileAdded: boolean }>();
    @Output() elementRemoved = new EventEmitter<FileElement>();
    @Output() elementRenamed = new EventEmitter<FileElement>();
    @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
    @Output() navigatedDown = new EventEmitter<FileElement>();
    @Output() navigatedUp = new EventEmitter();
    @Output() navigatedToFolder = new EventEmitter();
    @Output() select = new EventEmitter();
    @Output() cut = new EventEmitter();

    selection: any = [];
    cuted: any = [];


    constructor(public dialog: MatDialog) {
        console.log(this.path);
    }

    ngOnInit() {
    }

    deleteElement() {
        this.elementRemoved.emit(this.selection);
    }

    navigate(element: FileElement) {
        if (element.isFolder) {
            this.navigatedDown.emit(element);
        }
    }

    navigateUp() {
        this.navigatedUp.emit();
    }

    navigateToFolder(folder) {
        this.navigatedToFolder.emit(folder);
    }

    moveElement(element: FileElement, moveTo: FileElement) {
        this.elementMoved.emit({element: element, moveTo: moveTo});
    }

    openNewFolderDialog() {
        const dialogRef = this.dialog.open(NewFolderDialogComponent);
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.folderAdded.emit({name: res});
            }
        });
    }

    filesAdd(ev) {
        this.filesAdded.emit({fileAdded: ev});
    }

    openRenameDialog(element: FileElement) {
        const dialogRef = this.dialog.open(RenameDialogComponent);
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                element.name = res;
                this.elementRenamed.emit(element);
            }
        });
    }

    openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
        event.preventDefault();
        event.stopPropagation();
        viewChild.openMenu();
    }

    openContextMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
        event.preventDefault();
        event.stopPropagation();
        viewChild.openMenu();

        // Todo get element id to be dynamic
        let ids = ['cdk-overlay-0', 'cdk-overlay-1', 'cdk-overlay-3', 'cdk-overlay-4', 'cdk-overlay-5'];
        let elements = this.getElementsByIds(ids);

        setTimeout(() => {
            elements.forEach(element => {
                element.style.cssText = `position: fixed; left: ${event.pageX}px; top: ${event.pageY}px `;
            });
        }, 20);
    }

    onSelect(event: MouseEvent, element: any) {
        const old = element.parent;
        if (!(event.metaKey || event.ctrlKey)) {
            this.selection = [element];
        }
        else {
            const selected = this.isSelected(element);
            if (selected > -1) {
                this.selection.splice(selected, 1);
            } else {
                element.oldParent = old;
                this.selection.push(element);
            }
        }
        this.select.emit({event, element});
    }

    isSelected(item) {
        let selected = -1;
        const {currentPath, isFolder, parent} = item;
        this.selection.map((selectedItem, i) => {
            if (selectedItem.currentPath === currentPath && selectedItem.isFolder === isFolder && selectedItem.parent === parent) {
                selected = i;
            }
        });
        return selected;
    }

    onCut(element) {
        this.cuted = this.selection.length ? this.selection.map(item => Object.assign({}, item)) : element;
        this.selection = [];
    }

    isCut(item: any) {
        const {id, isFolder, parent} = item;
        return this.cuted
            .filter((cutedItem) => cutedItem.id == id && cutedItem.isFolder == isFolder && cutedItem.parent == parent).length;
    }

    onPaste() {
        this.cut.emit(this.cuted);
        this.cuted = [];
    }

    orderACS() {
        this.fileElements.sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
        });
    }

    orderDCS() {
        this.fileElements.sort((a, b) => {
            if (a.name > b.name) return -1;
            else if (a.name < b.name) return 1;
            else return 0;
        });
    }

    getElementsByIds(ids) {
        let ele = [];
        for (let i = 0; i < ids.length; i++) {
            if (document.getElementById(ids[i])) {
                ele[i] = document.getElementById(ids[i]);
            }
        }
        return ele;
    };

}
