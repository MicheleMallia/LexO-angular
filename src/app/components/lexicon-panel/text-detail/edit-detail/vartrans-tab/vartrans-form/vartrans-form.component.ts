import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { DataService, Person } from '../../core-tab/core-form/data.service';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-vartrans-form',
  templateUrl: './vartrans-form.component.html',
  styleUrls: ['./vartrans-form.component.scss']
})
export class VartransFormComponent implements OnInit {

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  componentRef: any;

  vartransForm = new FormGroup({
    label: new FormControl(''),
    translatableAs: new FormArray([this.createTranslatableAs()]),
    lexicalRelationDirect: new FormArray([this.createLexicalRelationDirect()]),
    lexicalRelationIndirect: new FormArray([this.createLexicalRelationIndirect()])
  })

  translatableAs: FormArray;
  lexicalRelationDirect: FormArray;
  lexicalRelationIndirect: FormArray;


  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.vartransForm = this.formBuilder.group({
      label: '',
      translatableAs: this.formBuilder.array([this.createTranslatableAs()]),
      lexicalRelationDirect: this.formBuilder.array([this.createLexicalRelationDirect()]),
      lexicalRelationIndirect: this.formBuilder.array([this.createLexicalRelationIndirect()])
    })

    this.onChanges();

    console.log(this.vartransForm)
    this.loadPeople();
    this.lexicalService.coreData$.subscribe(
      object => {
        this.object = object
      }
    );
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
      sub_rel: new FormArray([this.createSubLexicalRelationIndirect()])
    })
  }

  createSubLexicalRelationIndirect(): FormGroup {
    return this.formBuilder.group({
      sub_relation: 'eee',
      sub_entity: ''
    })
  }
}
