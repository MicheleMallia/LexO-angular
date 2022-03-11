import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpanderService {
  
  isEpigraphyExpanded = false;
  isEditExpanded = false;

  isEditOpen = false;
  isEpigraphyOpen = false;

  private _expandEpigraphy: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private _expandEdit: BehaviorSubject<boolean> = new BehaviorSubject(null);
  expEpigraphy$ = this._expandEpigraphy.asObservable();
  expEdit$ = this._expandEdit.asObservable();

  constructor() { }

  expandCollapseEpigraphy(trigger?){
    if(trigger != undefined){
      this.isEpigraphyExpanded = trigger;
      this._expandEpigraphy.next(this.isEpigraphyExpanded)
    }else{
      this.isEpigraphyExpanded = !this.isEpigraphyExpanded;
      this._expandEpigraphy.next(this.isEpigraphyExpanded)
    }
  }
  
  expandCollapseEdit(trigger?){
    if(trigger != undefined){
      this.isEditExpanded = trigger;
      this._expandEdit.next(this.isEditExpanded)
    }else{
      this.isEditExpanded = !this.isEditExpanded;
      this._expandEdit.next(this.isEditExpanded)
    }
  }

  openCollapseEdit(trigger?){
    if(trigger != undefined){
      this.isEditOpen = trigger;
    }else{
      this.isEditOpen = !this.isEditOpen
    }
  }

  openCollapseEpigraphy(trigger?){
    if(trigger != undefined){
      this.isEpigraphyOpen = trigger;
    }else{
      this.isEpigraphyOpen = !this.isEpigraphyOpen
    }
  }

  isEditTabExpanded(){
    return this.isEditExpanded;
  }

  isEpigraphyTabExpanded(){
    return this.isEpigraphyExpanded;
  }

  isEditTabOpen(){
    return this.isEditOpen;
  }

  isEpigraphyTabOpen(){
    return this.isEpigraphyOpen;
  }

}
