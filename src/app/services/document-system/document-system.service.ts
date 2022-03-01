import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentSystemService {

  private baseUrl_document = "https://lari2.ilc.cnr.it/belexo/"

  private _epigraphyData: BehaviorSubject<object> = new BehaviorSubject(null);
  epigraphyData$ = this._epigraphyData.asObservable();

  constructor(private http: HttpClient) { }

  sendToEpigraphyTab(object: object) {
    this._epigraphyData.next(object)
  } 

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

  //POST ​/api​/crud​/renameFolder --> rename folder
  renameFolder(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/renameFolder", parameters)
  }


  //POST ​/api​/crud​/uploadFile --> upload text
  uploadFile(parameters, element_id, request_uuid): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/uploadFile?requestUUID="+request_uuid+"&element-id="+element_id+"", parameters)
  }

  //POST ​/api​/crud​/removeFile --> upload text
  removeFile(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/removeFile", parameters)
  }

  //POST ​/api​/crud​/renameFile --> upload text
  renameFile(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/renameFile", parameters)
  }

  //POST ​/api​/crud​/moveFileTo --> move file to another folder
  moveFileTo(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/moveFileTo", parameters)
  }

  //POST ​/api​/crud​/copyFileTo --> move file to another folder
  copyFileTo(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/copyFileTo", parameters)
  }

  //POST ​/api​/crud​/downloadFile --> move file to another folder
  downloadFile(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/downloadFile", parameters)
  }

  //POST ​/api​/crud​/updateMetadata --> move file to another folder
  updateMetadata(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/updateMetadata", parameters)
  }
  
  //POST ​/api​/crud​/deleteMetadata --> move file to another folder
  deleteMetadata(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/crud/deleteMetadata", parameters)
  }

  //POST ​/api​/crud​/searchFiles --> move file to another folder
  searchFiles(parameters): Observable<any> {
    return this.http.post(this.baseUrl_document + "api/searchFiles", parameters)
  }
}
