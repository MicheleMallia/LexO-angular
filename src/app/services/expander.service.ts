import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpanderService {
  
  isExpanded = false;
  private _expand: BehaviorSubject<boolean> = new BehaviorSubject(null);
  exp$ = this._expand.asObservable();

  constructor() { }

  expandCollapse(){
    this.isExpanded = !this.isExpanded;
    this._expand.next(this.isExpanded)
  }
  
}
