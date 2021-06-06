import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;

  senseCore = new FormGroup({
    definition: new FormControl('', [Validators.required, Validators.minLength(5)]),
    example: new FormControl('', [Validators.required, Validators.minLength(5)]),
    usage: new FormControl('', [Validators.required, Validators.minLength(5)]),
    reference: new FormArray([this.createReference()]),
    lexical_concept: new FormArray([this.createLexicalConcept()]),
    sense_of: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

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

    this.senseCore = this.formBuilder.group({
      definition: '',
      example: '',
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
      }
      this.object = changes.senseData.currentValue;
      if (this.object != null) {
        this.senseCore.get('definition').setValue(this.object.definition, { emitEvent: false });
        this.senseCore.get('usage').setValue(this.object.usage, { emitEvent: false });
        this.addLexicalConcept(this.object.concept);
        this.senseCore.get('sense_of').setValue(this.object.sense, { emitEvent: false });
      }
    }, 10)
  }

  getDefinitionValid(){
    let value = this.senseCore.get('definition').value;
    if (value != '' && value != null) {
      if(value.match(/^.{5,}/) == null){
        return false;
      }else {
        return (value.match(/^.{5,}/).length > 0);
      }
    } else {
      return false;
    }
  }

  getExampleValid(){
    let value = this.senseCore.get('example').value;
    if (value != '' && value != null) {
      if(value.match(/^.{5,}/) == null){
        return false;
      }else {
        return (value.match(/^.{5,}/).length > 0);
      }
    } else {
      return false;
    }
  }

  onChanges(): void {
    this.senseCore.get('definition').valueChanges.pipe(debounceTime(1000)).subscribe(newDef => {
      this.lexicalService.spinnerAction('on');
      let isValid = this.getExampleValid();
      if(isValid){
        let senseId = this.object.senseInstanceName;
        let parameters = {
          relation : "definition",
          value : newDef
        }
        this.lexicalService.updateSense(senseId, parameters).subscribe(
          data=> {
            this.lexicalService.spinnerAction('off');
            this.lexicalService.refreshLexEntryTree();
            this.lexicalService.updateLexCard(this.object)
          },error=>{
            this.lexicalService.refreshLexEntryTree();
            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
            this.lexicalService.spinnerAction('off');
          }
        )
      }
    })

    this.senseCore.get('example').valueChanges.pipe(debounceTime(1000)).subscribe(newExample => {
      this.lexicalService.spinnerAction('on');
      let isValid = this.getExampleValid();
      if(isValid){
        let senseId = this.object.senseInstanceName;
        let parameters = {
          relation : "senseExample",
          value : newExample
        }
        console.log(parameters)
        this.lexicalService.updateSense(senseId, parameters).subscribe(
          data=> {
            this.lexicalService.spinnerAction('off');
            this.lexicalService.refreshLexEntryTree();
            this.lexicalService.updateLexCard(this.object)
          },error=>{
            this.lexicalService.refreshLexEntryTree();
            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
            this.lexicalService.spinnerAction('off');
          }
        )
      }
    })
  }

  createReference() {
    return this.formBuilder.group({
      entity: new FormControl(null, [Validators.required, Validators.minLength(5)])
    })
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
