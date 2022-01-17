import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpanderService {
  
  isEpygraphyExpanded = false;
  isEditExpanded = false;
  private _expandEpigraphy: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private _expandEdit: BehaviorSubject<boolean> = new BehaviorSubject(null);
  expEpigraphy$ = this._expandEpigraphy.asObservable();
  expEdit$ = this._expandEdit.asObservable();

  constructor() { }

  expandCollapseEpigraphy(){
    this.isEpygraphyExpanded = !this.isEpygraphyExpanded;
    this._expandEpigraphy.next(this.isEpygraphyExpanded)
  }
  
  expandCollapseEdit(){
    this.isEditExpanded = !this.isEditExpanded;
    this._expandEdit.next(this.isEditExpanded)
  }
}
