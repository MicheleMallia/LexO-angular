import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LexicalEntriesService {

  private _coreFormData: BehaviorSubject<object> = new BehaviorSubject(null);
  private _rightPanelData: BehaviorSubject<object> = new BehaviorSubject(null);
  private _deleteLexicalEntryReq : BehaviorSubject<object> = new BehaviorSubject(null);
  private _refreshTreeReq : BehaviorSubject<object> = new BehaviorSubject(null);
  private _updateLexCardReq : BehaviorSubject<object> = new BehaviorSubject(null);

  //private baseUrl = "https://licodemo.ilc.cnr.it/LexO-backend/service/lexicon/"
  private baseUrl = "/LexO-backend/service/lexicon/"
  private key = "PRINitant19";
  private author = "michele";

  coreData$ = this._coreFormData.asObservable();
  rightPanelData$ = this._rightPanelData.asObservable();
  deleteReq$ = this._deleteLexicalEntryReq.asObservable();
  refreshTreeReq$ = this._refreshTreeReq.asObservable();
  updateLexCardReq$ = this._updateLexCardReq.asObservable();

  constructor(private http: HttpClient) { }

  sendToCoreTab(object: object) {
    this._coreFormData.next(object)
  }

  sendToRightTab(object: object){
    this._rightPanelData.next(object);
  }

  deleteRequest(){
    this._deleteLexicalEntryReq.next(null);
  }

  refreshLexEntryTree(){
    this._refreshTreeReq.next(null);
  }

  updateLexCard(object: object){
    this._updateLexCardReq.next(object)
  }

  //POST: /lexicon/lexicalEntries ---> get lexical entries list
  getLexicalEntriesList(parameters: any): Observable<any> {
    return this.http.post(this.baseUrl + "data/lexicalEntries", parameters);
  }

  //POST: /lexicon/lexicalSenses ---> get lexical entries list
  getLexicalSensesList(parameters: any): Observable<any> {
    return this.http.post(this.baseUrl + "data/lexicalSenses", parameters);
  }

  //GET /lexicon/data/{id}/elements --> get elements of lexical entry
  getLexEntryElements(instance: string): Observable<any>{
    return this.http.get(this.baseUrl + "data/" + instance + "/elements");
  }

  //GET ​/lexicon​/data​/{id}​/lexicalEntry --> get specific aspect (morphology, syntax, ...) associated with a given lexical entry
  getLexEntryData(instance: string): Observable<any>{
    return this.http.get(this.baseUrl + "data/" + instance + "/lexicalEntry?key=lexodemo&aspect=core");
  }


  //GET /lexicon/data/{id}/forms --> get forms of lexical entry
  getLexEntryForms(instance: string): Observable<any>{
    return this.http.get(this.baseUrl + "data/" + instance + "/forms");
  }

  //GET /lexicon/data/{id}/senses --> get list of senses of a lexical entry
  getSensesList(instance: string): Observable<any>{
    return this.http.get(this.baseUrl + "data/" + instance + "/senses");
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


  //GET /lexicon/creation/lexicalEntry --> create new lexical entry
  newLexicalEntry(): Observable<any> {
    return this.http.get(this.baseUrl + "creation/lexicalEntry?key="+this.key+"&author="+this.author);
  }


  //GET /lexicon/delete/{id}/lexicalEntry --> delete lexical entry
  deleteLexicalEntry(lexId): Observable<any> {
    return this.http.get(this.baseUrl + "delete/"+lexId+"/lexicalEntry?key="+this.key+"&author="+this.author);
  }


  //GET lexicon/update/{id}/lexicalEntryLabel --> update label of lexical entry
  updateLexicalEntryLabel(lexId, label): Observable<any> {
    return this.http.get(this.baseUrl + "update/"+lexId+"/lexicalEntryLabel?key="+this.key+"&label="+label+"&author="+this.author);
  }

  //GET lexicon/update/{id}/lexicalEntryNote --> update note of lexical entry
  updateLexicalEntryNote(lexId, note): Observable<any> {
    return this.http.get(this.baseUrl + "update/"+lexId+"/lexicalEntryNote?key="+this.key+"&label="+note+"&author="+this.author);
  }
}
