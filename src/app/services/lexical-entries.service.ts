import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LexicalEntriesService {

  private _data : BehaviorSubject<object> = new BehaviorSubject(null);
  //private _siblings : BehaviorSubject<object[]> = new BehaviorSubject(null);
  
  item$ = this._data.asObservable();
  //sub$ = this._siblings.asObservable(); 

  constructor() { }

  sendToCoreTab(object: object) {
    this._data.next(object)
  }

  /* sendSiblings(object: object[]) {
    this._siblings.next(object)
  } */
}
