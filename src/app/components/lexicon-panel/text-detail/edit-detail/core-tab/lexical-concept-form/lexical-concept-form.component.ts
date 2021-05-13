import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { DataService, Person } from '../../core-tab/lexical-entry-core-form/data.service';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-lexical-concept-form',
  templateUrl: './lexical-concept-form.component.html',
  styleUrls: ['./lexical-concept-form.component.scss']
})
export class LexicalConceptFormComponent implements OnInit {

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  componentRef: any;

  @Input() lexicalConceptData : any;

  lexicalConceptForm = new FormGroup({
    label: new FormControl(''),
    definition : new FormControl(''),
    hierachicalRelation: new FormArray([this.createHierachicalRelation()]),
    scheme: new FormArray([this.createScheme()]),
    conceptReference: new FormArray([this.createConceptReference()])
  })

  hierachicalRelation: FormArray;
  scheme: FormArray;
  conceptReference: FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    
    this.lexicalConceptForm = this.formBuilder.group({
      label: '',
      definition : '',
      hierachicalRelation: this.formBuilder.array([this.createHierachicalRelation()]),
      scheme: this.formBuilder.array([this.createScheme()]),
      conceptReference: this.formBuilder.array([this.createConceptReference()])
    })
    this.onChanges();
    this.loadPeople();
    this.triggerTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(()=> {
      if(this.object != changes.lexicalConceptData.currentValue){
        if(this.conceptReference != null){
          this.conceptReference.clear();
          this.hierachicalRelation.clear();
          this.scheme.clear();
        }
      }
      this.loadPeople();
      this.object = changes.lexicalConceptData.currentValue;
      if(this.object != null){
        this.lexicalConceptForm.get('label').setValue(this.object.label, {emitEvent:false});
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
    this.lexicalConceptForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    })
  }

  createScheme(): FormGroup {
    return this.formBuilder.group({
      target: ''
    })
  }

  addScheme() {
    this.scheme = this.lexicalConceptForm.get('scheme') as FormArray;
    this.scheme.push(this.createScheme());
    this.triggerTooltip();
  }

  removeScheme(index) {
    this.scheme = this.lexicalConceptForm.get('scheme') as FormArray;
    this.scheme.removeAt(index);
  }

  addHierachicalRelation() {
    this.hierachicalRelation = this.lexicalConceptForm.get('hierachicalRelation') as FormArray;
    this.hierachicalRelation.push(this.createHierachicalRelation());
    this.triggerTooltip();
  }

  removeHierachicalRelation(index) {
    this.hierachicalRelation = this.lexicalConceptForm.get('hierachicalRelation') as FormArray;
    this.hierachicalRelation.removeAt(index);
  }

  addConceptReference() {
    this.conceptReference = this.lexicalConceptForm.get('conceptReference') as FormArray;
    this.conceptReference.push(this.createConceptReference());
    this.triggerTooltip();
  }

  removeConceptReference(index) {
    this.conceptReference = this.lexicalConceptForm.get('conceptReference') as FormArray;
    this.conceptReference.removeAt(index);
  }


  createHierachicalRelation(): FormGroup {
    return this.formBuilder.group({
      relation: '',
      entity: ''
    })
  }

  createConceptReference(): FormGroup {
    return this.formBuilder.group({
      target: ''
    })
  }

}

