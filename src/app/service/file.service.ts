import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FileElement} from '../file-explorer/model/file-element';
import {v4} from 'uuid';
import {BehaviorSubject, Observable} from 'rxjs';
import _ from 'lodash';

const url = 'http://localhost:8000/folder';

export interface IFileService {
    add(fileElement: FileElement);

    delete(files: any): Observable<any>;

    update(oldPath: string, currentPath: string): Observable<any>;

    queryInFolder(folderId: any): Observable<FileElement[]>;

    get(id: string): FileElement;
}

@Injectable()
export class FileService {

    private map = new Map<string, FileElement>();
    private querySubject: BehaviorSubject<FileElement[]>;

    constructor(private http: HttpClient) {
    }

    add(fileElement: FileElement) {
        fileElement.id = v4();
        this.map.set(fileElement.id, _.cloneDeep(fileElement));
        return fileElement;
    }

    delete(files: any) {
        console.log(files);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let paths = [];

        files.forEach(el => {
            paths.push({dir: el.parent, filename: el.name, isFolder: el.isFolder});
        });

        let body = {paths: paths};
        return this.http.post<any>(`${url}/delete`, body, {headers: headers});
    }

    update(oldPath: any, currentPath: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let paths = [];
        oldPath.forEach(el => {
            let newPath = `${currentPath}/${el.name}`;
            paths.push({oldPath: el.currentPath, currentPath: newPath});
        });
        let body = {paths: paths};
        return this.http.post<any>(`${url}/move`, body, {headers: headers});
    }

    queryInFolder(folder: any) {
        const result: FileElement[] = [];
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let body = {path: folder.currentPath ? folder.currentPath : '/'};

        this.http.post<any>(url, body, {headers: headers}).subscribe((res) => {
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
