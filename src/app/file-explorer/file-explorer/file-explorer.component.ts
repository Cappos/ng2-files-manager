import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

    @Output() folderAdded = new EventEmitter<{ name: string }>();
    @Output() elementRemoved = new EventEmitter<FileElement>();
    @Output() elementRenamed = new EventEmitter<FileElement>();
    @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
    @Output() navigatedDown = new EventEmitter<FileElement>();
    @Output() navigatedUp = new EventEmitter();

    selection: any = [];
    cuted: any = [];
    context: any;

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    deleteElement(element: FileElement) {
        this.elementRemoved.emit(element);
    }

    navigate(element: FileElement) {
        if (element.isFolder) {
            this.navigatedDown.emit(element);
        }
    }

    navigateUp() {
        this.navigatedUp.emit();
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
        viewChild.openMenu();
    }

    onSelect(event: MouseEvent, element: any) {

        if (!(event.metaKey || event.ctrlKey)) {
            this.selection = [element];
        }
        else {
            const selected = this.isSelected(element);
            if (selected > -1) {
                this.selection.splice(selected, 1);
            } else {
                this.selection.push(element);
            }
        }
    }

    isSelected(item) {
        let selected = -1;
        const {id, isFolder, parent} = item;
        this.selection.map((selectedItem, i) => {
            if (selectedItem.id === id && selectedItem.isFolder === isFolder && selectedItem.parent === parent) {
                selected = i;
            }
        });
        return selected;
    }

    onCut() {
        this.cuted = this.selection.length ? this.selection.map(item => Object.assign({}, item)) : [this.context];
        this.selection = [];
        console.log(this.cuted);
    }

    isCut(item: any) {
        const {id, isFolder, parent} = item;
        return this.cuted
            .filter((cutedItem) => cutedItem.id == id && cutedItem.isFolder == isFolder && cutedItem.parent == parent).length;
    }

}
