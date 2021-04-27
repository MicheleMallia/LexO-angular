import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { DataService, Person } from '../../core-tab/lexical-entry-core-form/data.service';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-lexical-entry-vartrans-form',
  templateUrl: './lexical-entry-vartrans-form.component.html',
  styleUrls: ['./lexical-entry-vartrans-form.component.scss']
})
export class LexicalEntryVartransFormComponent implements OnInit {

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  componentRef: any;

  @Input() lexData : any;

  vartransForm = new FormGroup({
    label: new FormControl(''),
    translatableAs: new FormArray([this.createTranslatableAs()]),
    lexicalRelationDirect: new FormArray([this.createLexicalRelationDirect()]),
    lexicalRelationIndirect: new FormArray([this.createLexicalRelationIndirect()])
  })

  translatableAs: FormArray;
  lexicalRelationDirect: FormArray;
  lexicalRelationIndirect: FormArray;
  lexicalRelationIndirectSub : FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    
    this.vartransForm = this.formBuilder.group({
      label: '',
      translatableAs: this.formBuilder.array([this.createTranslatableAs()]),
      lexicalRelationDirect: this.formBuilder.array([this.createLexicalRelationDirect()]),
      lexicalRelationIndirect: this.formBuilder.array([])
    })
    this.onChanges();
    this.loadPeople();
    this.triggerTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(()=> {
      if(this.object != changes.lexData.currentValue){
        if(this.lexicalRelationIndirect != null){
          this.lexicalRelationIndirect.clear();
        }
      }
      this.loadPeople();
      this.object = changes.lexData.currentValue;
      if(this.object != null){
        this.addLexicalRelationIndirect();
      }
      this.triggerTooltip();
  }, 10)
  }

  triggerTooltip(){
    setTimeout(() => {
      //@ts-ignore
      $('.vartrans-tooltip').tooltip({
        trigger : 'hover'
      });
    }, 500);
  }

  private loadPeople() {
    this.peopleLoading = true;
    this.dataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });
  }

  onChanges(): void {
    this.vartransForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    })
  }

  createTranslatableAs(): FormGroup {
    return this.formBuilder.group({
      entity: ''
    })
  }

  addTranslatableAs() {
    this.translatableAs = this.vartransForm.get('translatableAs') as FormArray;
    this.translatableAs.push(this.createTranslatableAs());
    this.triggerTooltip();
  }

  removeTranslatableAs(index) {
    this.translatableAs = this.vartransForm.get('translatableAs') as FormArray;
    this.translatableAs.removeAt(index);
  }

  addLexicalRelationDirect() {
    this.lexicalRelationDirect = this.vartransForm.get('lexicalRelationDirect') as FormArray;
    this.lexicalRelationDirect.push(this.createLexicalRelationDirect());
    this.triggerTooltip();
  }

  removeLexicalRelationDirect(index) {
    this.lexicalRelationDirect = this.vartransForm.get('lexicalRelationDirect') as FormArray;
    this.lexicalRelationDirect.removeAt(index);
  }

  addLexicalRelationIndirect() {
    this.lexicalRelationIndirect = this.vartransForm.get('lexicalRelationIndirect') as FormArray;
    this.lexicalRelationIndirect.push(this.createLexicalRelationIndirect());
    this.triggerTooltip();
  }

  removeLexicalRelationIndirect(index) {
    this.lexicalRelationIndirect = this.vartransForm.get('lexicalRelationIndirect') as FormArray;
    this.lexicalRelationIndirect.removeAt(index);
  }

  addLexicalRelationIndirectSub(index) {
    const control = (<FormArray>this.vartransForm.controls['lexicalRelationIndirect']).at(index).get('sub_rel') as FormArray;
    control.insert(index, this.createSubLexicalRelationIndirect())
    this.triggerTooltip();
  }

  removeLexicalRelationIndirectSub(index, iy) {
    const control = (<FormArray>this.vartransForm.controls['lexicalRelationIndirect']).at(index).get('sub_rel') as FormArray;
    control.removeAt(iy);
  }

  createLexicalRelationDirect(): FormGroup {
    return this.formBuilder.group({
      relation: '',
      entity: ''
    })
  }

  createLexicalRelationIndirect(): FormGroup {
    return this.formBuilder.group({
      a_entity: '',
      relation: '',
      b_entity: '',
      sub_rel: new FormArray([])
    })
  }

  createSubLexicalRelationIndirect(): FormGroup {
    return this.formBuilder.group({
      sub_relation: 'eee',
      sub_entity: ''
    })
  }
}
