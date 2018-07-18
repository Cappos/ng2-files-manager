import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UploadDialogComponent} from './dialog/upload-dialog.component';
import {UploadService} from './upload.service';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css'],
})

export class UploadComponent {
    @Output() filesUploaded = new EventEmitter();
    @Input() fileTypes: string;

    constructor(public dialog: MatDialog, public uploadService: UploadService) {
    }

    public openUploadDialog(fileTypes) {
        let dialogRef = this.dialog.open(UploadDialogComponent, {
            data: {
                fileType: fileTypes
            },
            width: '50%', height: '50%'
        });

        dialogRef.afterClosed().subscribe(res => {
            this.filesUploaded.emit(res);
        });
    }
}