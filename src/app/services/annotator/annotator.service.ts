﻿/*
  © Copyright 2021-2022  Istituto di Linguistica Computazionale "A. Zampolli", Consiglio Nazionale delle Ricerche, Pisa, Italy.
 
This file is part of EpiLexo.

EpiLexo is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

EpiLexo is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with EpiLexo. If not, see <https://www.gnu.org/licenses/>.
*/

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
  private _deleteAnnoRequest: BehaviorSubject<any> = new BehaviorSubject(null);
  triggerSearch$ = this._triggerSearch.asObservable();
  deleteAnnoReq$ = this._deleteAnnoRequest.asObservable();

  triggerSearch(string : string) {
    this._triggerSearch.next(string)
  } 

  deleteAnnotationRequest(id : number){
    this._deleteAnnoRequest.next(id)
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

  updateAnnotation(annotation : object) : Observable<any>{
    return this.http.put(this.baseUrl + 'annotation', annotation);
  }

}
