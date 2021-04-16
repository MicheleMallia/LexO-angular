import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LexicalEntriesService {

  private _data: BehaviorSubject<object> = new BehaviorSubject(null);

  //private baseUrl = "https://licodemo.ilc.cnr.it/LexO-backend/service/lexicon/"
  private baseUrl = "/LexO-backend/service/lexicon/"

  item$ = this._data.asObservable();

  constructor(private http: HttpClient) { }

  sendToCoreTab(object: object) {
    this._data.next(object)
  }

  //POST: /lexicon/lexicalEntries ---> get lexical entries list
  getLexicalEntriesList(parameters: any): Observable<any> {
    return this.http.post(this.baseUrl + "data/lexicalEntries", parameters);
  }

  //POST: /lexicon/lexicalSenses ---> get lexical entries list
  getLexicalSensesList(parameters: any): Observable<any> {
    return this.http.post(this.baseUrl + "data/lexicalSenses", parameters);
  }

  //GET /lexicon/languages --> get languages list
  getLanguages(): Observable<any> {
    return this.http.get(this.baseUrl + "statistics/languages?key=lexodemo");
  }

  //GET /lexicon/types --> get types list
  getTypes(): Observable<any> {
    return this.http.get(this.baseUrl + "statistics/types?key=lexodemo");
  }

  //GET /lexicon/authors --> get authors list
  getAuthors(): Observable<any> {
    return this.http.get(this.baseUrl + "statistics/authors?key=lexodemo");
  }

  //GET /lexicon/pos --> get pos list
  getPos(): Observable<any> {
    return this.http.get(this.baseUrl + "statistics/pos?key=lexodemo");
  }

  //GET /lexicon/states --> get states list
  getStatus(): Observable<any> {
    return this.http.get(this.baseUrl + "statistics/status?key=lexodemo");
  }
}
