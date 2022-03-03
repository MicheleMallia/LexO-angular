import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnotatorService {
  private baseUrl = "https://lari2.ilc.cnr.it/belexo/api/v1/"

  constructor(private http: HttpClient) { }

  private _triggerSearch: BehaviorSubject<any> = new BehaviorSubject(null);
  triggerSearch$ = this._triggerSearch.asObservable();

  triggerSearch(string : string) {
    this._triggerSearch.next(string)
  } 

  getTokens(id: number) : Observable<any> {
    return this.http.get(this.baseUrl + 'token?nodeid='+id);
  }

  addAnnotation(parameters : object, id : number) : Observable<any>{
    return this.http.post(this.baseUrl + 'annotation?nodeid='+id, parameters);
  }

  getAnnotation(id : number) : Observable<any>{
    return this.http.get(this.baseUrl + 'annotation?nodeid='+id);
  }

  deleteAnnotation(id: number) : Observable<any> {
    return this.http.delete(this.baseUrl + 'annotate?annotationID='+id);
  }

}
