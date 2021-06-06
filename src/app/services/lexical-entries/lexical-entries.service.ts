import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LexicalEntriesService {

  private _coreFormData: BehaviorSubject<object> = new BehaviorSubject(null);
  private _vartransData: BehaviorSubject<object> = new BehaviorSubject(null);
  private _rightPanelData: BehaviorSubject<object> = new BehaviorSubject(null);
  private _deleteLexicalEntryReq: BehaviorSubject<object> = new BehaviorSubject(null);
  private _refreshTreeReq: BehaviorSubject<object> = new BehaviorSubject(null);
  private _updateLexCardReq: BehaviorSubject<object> = new BehaviorSubject(null);
  private _spinnerAction: BehaviorSubject<string> = new BehaviorSubject(null);

  //private baseUrl = "https://licodemo.ilc.cnr.it/LexO-backend/service/lexicon/"
  private baseUrl = "/LexO-backend/service/"
  private baseUrl_document = "http://lari2.ilc.cnr.it:81/belexo/"
  private key = "PRINitant19";
  private author = "michele";

  coreData$ = this._coreFormData.asObservable();
  vartransData = this._vartransData.asObservable();
  rightPanelData$ = this._rightPanelData.asObservable();
  deleteReq$ = this._deleteLexicalEntryReq.asObservable();
  refreshTreeReq$ = this._refreshTreeReq.asObservable();
  updateLexCardReq$ = this._updateLexCardReq.asObservable();
  spinnerAction$ = this._spinnerAction.asObservable();

  constructor(private http: HttpClient) { }

  sendToCoreTab(object: object) {
    this._coreFormData.next(object)
  }

  sendToVartransTab(object: object) {
    this._vartransData.next(object)
  }

  sendToRightTab(object: object) {
    this._rightPanelData.next(object);
  }

  deleteRequest() {
    this._deleteLexicalEntryReq.next(null);
  }

  refreshLexEntryTree() {
    this._refreshTreeReq.next(null);
  }

  updateLexCard(object: object) {
    this._updateLexCardReq.next(object)
  }

  spinnerAction(string: string) {
    this._spinnerAction.next(string)
  }

  //POST: /lexicon/lexicalEntries ---> get lexical entries list
  getLexicalEntriesList(parameters: any): Observable<any> {
    return this.http.post(this.baseUrl + "lexicon/data/lexicalEntries", parameters);
  }

  //POST: /lexicon/lexicalSenses ---> get lexical entries list
  getLexicalSensesList(parameters: any): Observable<any> {
    return this.http.post(this.baseUrl + "lexicon/data/lexicalSenses", parameters);
  }

  //GET /lexicon/data/{id}/elements --> get elements of lexical entry
  getLexEntryElements(instance: string): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/" + instance + "/elements");
  }

  //GET ​/lexicon​/data​/{id}​/lexicalEntry --> get specific aspect (morphology, syntax, ...) associated with a given lexical entry
  //TODO: RICORDA CHE PRIMA O POI DEVI CAMBIARE ASPETTO QUANDO QUESTI ULTIMI SARANNO DISPONIBILI
  getLexEntryData(instance: string): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/" + instance + "/lexicalEntry?key=" + this.key + "&aspect=core");
  }

  //GET /lexicon/data/{id}/lexicalEntryLinguisticRelation --> This method returns the relations with other lexical entities according to the input type
  getLexEntryLinguisticRelation(lexId: string, property: string): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/" + lexId + "/lexicalEntryLinguisticRelation?key=" + this.key + "&property=" + property + "");
  }


  //GET /lexicon/data/{id}/forms --> get forms of lexical entry
  getLexEntryForms(instance: string): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/" + instance + "/forms");
  }


  //GET /lexicon/data/{id}/form --> get data about a single form 
  getFormData(formId: string, aspect: string): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/" + formId + "/form?key=" + this.key + "&aspect=" + aspect)
  }

  //GET /lexicon/data/{id}/senses --> get list of senses of a lexical entry
  getSensesList(instance: string): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/" + instance + "/senses");
  }

  //GET /lexicon/data/languages --> Lexicon languages list
  getLexiconLanguages(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/data/languages");
  }

  //GET /lexicon/languages --> get languages list
  getLanguages(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/statistics/languages?key=" + this.key + "");
  }

  //GET /lexicon/types --> get types list
  getTypes(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/statistics/types?key=" + this.key + "");
  }

  //GET /lexicon/authors --> get authors list
  getAuthors(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/statistics/authors?key=" + this.key + "");
  }

  //GET /lexicon/pos --> get pos list
  getPos(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/statistics/pos?key=" + this.key + "");
  }

  //GET /lexicon/states --> get states list
  getStatus(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/statistics/status?key=" + this.key + "");
  }


  //GET /lexicon/creation/lexicalEntry --> create new lexical entry
  newLexicalEntry(): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/creation/lexicalEntry?key=" + this.key + "&author=" + this.author);
  }


  //GET /lexicon/delete/{id}/lexicalEntry --> delete lexical entry
  deleteLexicalEntry(lexId): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/delete/" + lexId + "/lexicalEntry?key=" + this.key);
  }

  //POST ​/lexicon​/update​/{id}​/lexicalEntry --> lexical entry update
  updateLexicalEntry(lexId, parameters): Observable<any> {
    return this.http.post(this.baseUrl + "lexicon/update/" + lexId + "/lexicalEntry?key=" + this.key + "&author=" + this.author, parameters);
  }


  //POST ​/lexicon​/update​/{id}​/linguisticRelation --> linguistic Relation update for Core
  updateLinguisticRelation(lexId, parameters): Observable<any> {
    return this.http.post(this.baseUrl + "lexicon/update/" + lexId + "/linguisticRelation?key=" + this.key + "&author=" + this.author, parameters);
  }

  //POST /lexicon/update/{id}/form --> update form values
  updateForm(formId, parameters): Observable<any> {
    return this.http.post(this.baseUrl + "lexicon/update/" + formId + "/form?key=" + this.key + "&author=" + this.author, parameters);
  }

  //GET  /lexinfo/data/morphology --> get data about morphology
  getMorphologyData(): Observable<any> {
    return this.http.get(this.baseUrl + "lexinfo/data/morphology");
  }

  ///GET /ontolex/data/formType --> get data about form types
  getFormTypes(): Observable<any> {
    return this.http.get(this.baseUrl + "ontolex/data/formType");
  }

  ///GET /ontolex/data/formType --> get data about form types
  getLexEntryTypes(): Observable<any> {
    return this.http.get(this.baseUrl + "ontolex/data/lexicalEntryType");
  }


  //GET /lexicon/creation/form --> create new form
  createNewForm(lexId): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/creation/form?lexicalEntryID="+ lexId +"&key=" + this.key + "&author=" + this.author);
  }

  //GET /lexicon/creation/form --> create new form
  createNewSense(lexId): Observable<any> {
    return this.http.get(this.baseUrl + "lexicon/creation/lexicalSense?lexicalEntryID="+ lexId +"&key=" + this.key + "&author=" + this.author);
  }

  //$$$$$$$$$$$$$$$$$$$$$$$$ DOCUMENT SYSTEM TREE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//

  //GET /api/getDocumentSystem  ---> return document system
  getDocumentSystem(): Observable<any> {
    return this.http.get(this.baseUrl_document + "/api/getDocumentSystem?requestUUID=11")
  }
}
