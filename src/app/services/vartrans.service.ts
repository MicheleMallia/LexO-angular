import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VartransService {
  
  private _destroy_relation: BehaviorSubject<object> = new BehaviorSubject(null);
  destroy_relation$ = this._destroy_relation.asObservable();

  constructor() { }

  destroyRelation(object:any){
    this._destroy_relation.next(object)
  }
  
  
}
