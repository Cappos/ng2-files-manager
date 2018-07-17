import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {FileExplorerModule} from './file-explorer/file-explorer.module';
import {MatCardModule} from '@angular/material';
import {FileService} from './service/file.service';
import {NewFolderDialogComponent} from './file-explorer/modals/new-folder-dialog/new-folder-dialog.component';
import {RenameDialogComponent} from './file-explorer/modals/rename-dialog/rename-dialog.component';
import {UploadModule} from './upload/upload.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FileExplorerModule,
        MatCardModule,
        UploadModule
    ],
    providers: [FileService],
    entryComponents: [NewFolderDialogComponent, RenameDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
