import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { DataService, Person } from '../lexical-entry-core-form/data.service';

@Component({
  selector: 'app-sense-core-form',
  templateUrl: './sense-core-form.component.html',
  styleUrls: ['./sense-core-form.component.scss']
})
export class SenseCoreFormComponent implements OnInit {

  @Input() senseData: any;

  private subject: Subject<any> = new Subject();

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;

  definitionData = [];
  definitionMemory = [];

  senseCore = new FormGroup({
    definition: new FormArray([this.createDefinition()]),
    usage: new FormControl('', [Validators.required, Validators.minLength(5)]),
    reference: new FormArray([this.createReference()]),
    lexical_concept: new FormArray([this.createLexicalConcept()]),
    sense_of: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  definitionArray : FormArray;
  lexicalConceptArray: FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    setTimeout(() => {
      //@ts-ignore
      $('.denotes-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 1000);
    this.loadPeople();

    this.subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onChangeDefinition(data)
      }
    )

    this.senseCore = this.formBuilder.group({
      definition: this.formBuilder.array([]),
      usage: '',
      reference: this.formBuilder.array([this.createReference()]),
      lexical_concept: this.formBuilder.array([]),
      sense_of: ''
    })

    this.onChanges();

  }

  private loadPeople() {
    this.peopleLoading = true;
    this.dataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (this.object != changes.senseData.currentValue) {
        this.lexicalConceptArray = this.senseCore.get('lexical_concept') as FormArray;
        this.lexicalConceptArray.clear();

        this.definitionArray = this.senseCore.get('definition') as FormArray;
        this.definitionArray.clear();
      }
      this.object = changes.senseData.currentValue;
      if (this.object != null) {
        
        this.definitionData = [];
        this.definitionMemory = [];

        for(var i = 0; i < this.object.definition.length; i++){
          const pId = this.object.definition[i]['propertyID'];
          const pVal = this.object.definition[i]['propertyValue'];
          this.definitionData.push(pId);

          if(pVal != ''){
            this.definitionMemory.push(pId);
            this.addDefinition(pId, pVal)
          }
          
        }
        this.senseCore.get('usage').setValue(this.object.usage, { emitEvent: false });
        this.addLexicalConcept(this.object.concept);
        this.senseCore.get('sense_of').setValue(this.object.sense, { emitEvent: false });
      }
    }, 10)
  }

  getDefinitionValid() {
    let value = this.senseCore.get('definition').value;
    if (value != '' && value != null) {
      if (value.match(/^.{5,}/) == null) {
        return false;
      } else {
        return (value.match(/^.{5,}/).length > 0);
      }
    } else {
      return false;
    }
  }

  getExampleValid() {
    let value = this.senseCore.get('example').value;
    if (value != '' && value != null) {
      if (value.match(/^.{5,}/) == null) {
        return false;
      } else {
        return (value.match(/^.{5,}/).length > 0);
      }
    } else {
      return false;
    }
  }

  onChanges(): void {
    this.senseCore.get('usage').valueChanges.pipe(debounceTime(1000)).subscribe(newDef => {
      this.lexicalService.spinnerAction('on');
      let senseId = this.object.senseInstanceName;
      let parameters = {
        relation: "usage",
        value: newDef
      }
      this.lexicalService.updateSense(senseId, parameters).subscribe(
        data => {
          this.lexicalService.spinnerAction('off');
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
        }
      )
    })

    this.senseCore.get('reference').valueChanges.pipe(debounceTime(1000)).subscribe(newDef => {
      this.lexicalService.spinnerAction('on');
      let senseId = this.object.senseInstanceName;
      let parameters = {
        relation: "reference",
        value: newDef[0]['entity']
      }
      console.log(senseId)
      console.log(parameters);
      this.lexicalService.updateSense(senseId, parameters).subscribe(
        data => {
          this.lexicalService.spinnerAction('off');
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          console.log(error)
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
        }
      )
    })
  }

  onChangeDefinitionTrait(evt, i) {

    setTimeout(() => {
      this.definitionArray = this.senseCore.get('definition') as FormArray;
      this.definitionArray.at(i).patchValue({ propertyID: evt.target.value, propertyValue: "" });
      if (evt.target.value != '') {
        
        this.definitionMemory[i] = evt.target.value;
      } else {
        
        this.definitionMemory.splice(i, 1)
      }



    }, 250);
  }

  createReference() {
    return this.formBuilder.group({
      entity: new FormControl(null, [Validators.required, Validators.minLength(5)])
    })
  }

  addDefinition(pId?, pVal?){
    this.definitionArray = this.senseCore.get('definition') as FormArray;
    if(pId != undefined){
      this.definitionArray.push(this.createDefinition(pId, pVal));
    }else{
      this.definitionArray.push(this.createDefinition());
    }
  }

  removeDefinition(index){
    const definitionArray = this.senseCore.get('definition') as FormArray;
    definitionArray.removeAt(index)
  }

  debounceKeyup(evt, i) {
    this.lexicalService.spinnerAction('on');
    this.subject.next({ evt, i })
  }

  createDefinition(pId?, pVal?){
    if(pId != undefined){
      return this.formBuilder.group({
        propertyID: new FormControl(pId, [Validators.required, Validators.minLength(0)]),
        propertyValue : new FormControl(pVal, [Validators.required, Validators.minLength(0)])
      })
    }else{
      return this.formBuilder.group({
        propertyID: new FormControl(null, [Validators.required, Validators.minLength(0)]),
        propertyValue : new FormControl(null, [Validators.required, Validators.minLength(0)])
      })
    }
    
  }

  onChangeDefinition(object) {

    this.definitionArray = this.senseCore.get('definition') as FormArray;
    const trait = this.definitionArray.at(object.i).get('propertyID').value;
    const newValue = object.evt.target.value;
    const formId = this.object.senseInstanceName;
    const parameters = { relation: trait, value: newValue }

    if(trait != undefined && newValue != ''){
      this.lexicalService.updateSense(formId, parameters).pipe(debounceTime(1000)).subscribe(
        data => {
          console.log(data)
          this.lexicalService.spinnerAction('off');
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard(data)
        }, error => {
          console.log(error);
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
        }
      )
    }else {
      this.lexicalService.spinnerAction('off');
    }
  }


  removeReference(index) {
    const referenceArray = this.senseCore.get('reference') as FormArray;
    referenceArray.removeAt(index)
  }

  createLexicalConcept(e?) {
    if (e != undefined) {
      return this.formBuilder.group({
        lex_concept: new FormControl(e, [Validators.required, Validators.minLength(5)])
      })
    } else {
      return this.formBuilder.group({
        lex_concept: new FormControl(null, [Validators.required, Validators.minLength(5)])
      })
    }

  }

  addLexicalConcept(entity?) {
    this.lexicalConceptArray = this.senseCore.get('lexical_concept') as FormArray;
    if (entity != undefined) {
      this.lexicalConceptArray.push(this.createLexicalConcept(entity));
    } else {
      this.lexicalConceptArray.push(this.createLexicalConcept());
    }
  }

  removeLexicalConcept(index) {
    this.lexicalConceptArray = this.senseCore.get('lexical_concept') as FormArray;
    this.lexicalConceptArray.removeAt(index);
  }
}
