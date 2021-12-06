import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BibliographyService {

  constructor(private http: HttpClient) { }


  private baseUrl = "https://api.zotero.org/groups/2552746/items";
  
  private _addBiblioItem: BehaviorSubject<any> = new BehaviorSubject(null);
  private _triggerPanel: BehaviorSubject<object> = new BehaviorSubject(null);
  addBiblioReq$ = this._addBiblioItem.asObservable();
  triggerPanel$ = this._triggerPanel.asObservable();

  sendDataToBibliographyPanel(object: any) {
    this._addBiblioItem.next(object)
  }

  triggerPanel(object: object) {
    this._triggerPanel.next(object)
  } 

  bootstrapData(start? : number, sortField? : string, direction? : string) : Observable<any> {
    return this.http.get(this.baseUrl + '?limit=25&start='+start+'&sort='+sortField+'&direction='+direction+'&v=3');
  }

  filterBibliography(start? : number, sortField? : string, direction? : string, query?, queryMode?) : Observable<any> {
    return this.http.get(this.baseUrl + '?limit=25&q='+query+'&qmode='+queryMode+'&start='+start+'&sort='+sortField+'&direction='+direction+'&v=3');
  }

}
