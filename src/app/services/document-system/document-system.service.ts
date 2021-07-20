import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentSystemService {

  private baseUrl_document = "https://lari2.ilc.cnr.it/belexo/"

  constructor(private http: HttpClient) { }

  //GET /api/getDocumentSystem  ---> return document system
  getDocumentSystem(): Observable<any> {
    return this.http.get(this.baseUrl_document + "api/getDocumentSystem?requestUUID=11")
  }

  //POST ​/api​/crud​/addFolder --> add folder to document system
  addFolder(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/addFolder", parameters)
  }

  //POST ​/api​/crud​/removeFolder --> remove Folder folder from document system
  removeFolder(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/removeFolder", parameters)
  }

  //POST ​/api​/crud​/moveFolder --> move Folder to another folder
  moveFolder(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/moveFolder", parameters)
  }

}
