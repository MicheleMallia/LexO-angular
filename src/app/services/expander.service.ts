import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpanderService {
  
  private _expand: BehaviorSubject<object> = new BehaviorSubject(null);
  exp$ = this._expand.asObservable();

  constructor() { }

  expandCollapse(object:any){
    this._expand.next(object)
  }
  
}
