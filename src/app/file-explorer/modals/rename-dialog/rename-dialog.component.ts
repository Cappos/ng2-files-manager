import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-rename-dialog',
    templateUrl: './rename-dialog.component.html',
    styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {
    folderName: string;
    folderOldName: string;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any) {

    }

    ngOnInit() {
        this.folderName = this.data.element.orginalName ? this.data.element.orginalName : this.data.element.name;
    }

}