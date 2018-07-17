import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatDialogModule, MatGridListModule, MatIconModule, MatInputModule, MatMenuModule,
    MatToolbarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {FileExplorerComponent} from './file-explorer/file-explorer.component';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import {UploadModule} from '../upload/upload.module';

@NgModule({
  imports: [
      CommonModule,
      MatToolbarModule,
      FlexLayoutModule,
      MatIconModule,
      MatGridListModule,
      MatMenuModule,
      BrowserAnimationsModule,
      MatDialogModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      UploadModule
  ],
    declarations: [FileExplorerComponent, NewFolderDialogComponent, RenameDialogComponent],
    exports: [FileExplorerComponent],
    entryComponents: []
})
export class FileExplorerModule { }
