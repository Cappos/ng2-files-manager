import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FileElement} from '../file-explorer/model/file-element';
import {v4} from 'uuid';
import {BehaviorSubject, Observable} from 'rxjs';
import _ from 'lodash';

const url = 'http://localhost:8000/folder';

export interface IFileService {
    add(folder: any): Observable<any>;

    delete(files: any): Observable<any>;

    rename(oldPath: string, newName: string, parent: string, isFolder: boolean): Observable<any>;

    update(oldPath: string, currentPath: string): Observable<any>;

    queryInFolder(folderId: any): Observable<FileElement[]>;

    get(id: string): FileElement;
}

@Injectable()
export class FileService {

    private map = new Map<string, FileElement>();
    private querySubject: BehaviorSubject<FileElement[]>;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) {
    }

    add(folder: any) {
        let body = {dir: folder};
        return this.http.post<any>(`${url}/create`, body, {headers: this.headers});
    }

    delete(files: any) {
        let paths = [];
        files.forEach(el => {
            paths.push({dir: el.parent, filename: el.name, isFolder: el.isFolder});
        });
        let body = {paths: paths};
        return this.http.post<any>(`${url}/delete`, body, {headers: this.headers});
    }

    rename(oldPath: string, newName: string, parent: string, isFolder: boolean) {
        let body = {oldPath: oldPath, newName: newName, parent: parent, isFolder: isFolder};
        return this.http.post<any>(`${url}/rename`, body, {headers: this.headers});
    }

    update(oldPath: any, currentPath: string) {
        let paths = [];

        oldPath.forEach(el => {
            console.log(currentPath);
            console.log(el.name);
            let newPath = `${currentPath}${el.name}`;
            paths.push({oldPath: el.currentPath, currentPath: newPath, isFolder: el.isFolder});
        });
        let body = {paths: paths};
        return this.http.post<any>(`${url}/move`, body, {headers: this.headers});
    }

    queryInFolder(folder: any) {
        const result: FileElement[] = [];
        let body = {path: folder.currentPath ? folder.currentPath : '/'};

        this.http.post<any>(url, body, {headers: this.headers}).subscribe((res) => {
            res.files.forEach(file => {
                this.map.set(file.currentPath, _.cloneDeep(file));
                result.push(_.cloneDeep(file));
            });
        });

        if (!this.querySubject) {
            this.querySubject = new BehaviorSubject(result);
        } else {
            this.querySubject.next(result);
        }
        return this.querySubject.asObservable();
    }

    get(currentPath: string) {
        return this.map.get(currentPath);
    }

}
