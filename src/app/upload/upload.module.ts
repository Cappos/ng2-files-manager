import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule, MatDialogModule, MatIconModule, MatListModule, MatProgressBarModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import {UploadComponent} from './upload.component';
import {UploadDialogComponent} from './dialog/upload-dialog.component';
import {UploadService} from './upload.service';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatListModule, FlexLayoutModule, HttpClientModule, BrowserAnimationsModule, MatProgressBarModule, MatIconModule],
    declarations: [UploadComponent, UploadDialogComponent],
    exports: [UploadComponent],
    providers: [UploadService],
    entryComponents: [UploadDialogComponent]
})
export class UploadModule { }
