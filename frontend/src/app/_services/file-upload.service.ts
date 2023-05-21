import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from '@environments/environment';
import { Image } from "@app/_models/image";

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    constructor(private http: HttpClient) {}
  
    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
  
        formData.append('image', file);
    
        const req = new HttpRequest('POST', `${environment.apiUrl}/images`, formData, {
            reportProgress: true,
            responseType: 'json',
        });
  
        return this.http.request(req);
    }
  
    getImage() {
        return this.http.get<Image>(`${environment.apiUrl}/images`);
    }
}