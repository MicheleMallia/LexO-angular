import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { DataService, Person } from '../../core-tab/lexical-entry-core-form/data.service';

@Component({
  selector: 'app-etymology-form',
  templateUrl: './etymology-form.component.html',
  styleUrls: ['./etymology-form.component.scss']
})
export class EtymologyFormComponent implements OnInit {

  @Input() etymData: any;

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  componentRef: any;


  etyForm = new FormGroup({
    label: new FormControl(''),
    author: new FormControl(''),
    uncertain : new FormControl(null),
    component: new FormArray([this.createComponent()]),
    subterm: new FormArray([this.createSubterm()])
  })

  componentArray: FormArray;
  subtermArray: FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.etyForm = this.formBuilder.group({
      label: '',
      author: '',
      uncertain : false,
      component: this.formBuilder.array([]),
      subterm : this.formBuilder.array([]),
    })
    this.onChanges();
    this.loadPeople();
    this.triggerTooltip();
  }

  triggerTooltip() {
    setTimeout(() => {
      //@ts-ignore
      $('.vartrans-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (this.object != changes.etymData.currentValue) {
        if (this.componentArray != null || this.subtermArray != null) {
          this.componentArray.clear();
          this.subtermArray.clear();
          
        }
      }
      this.loadPeople();
      this.object = changes.etymData.currentValue;
      if (this.object != null) {
        this.etyForm.get('label').setValue(this.object.label, { emitEvent: false });
      }
      this.triggerTooltip();
    }, 10)
  }

  private loadPeople() {
    this.peopleLoading = true;
    this.dataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });
  }

  onChanges(): void {
    this.etyForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      //console.log(searchParams)
    })
  }

  addSubterm() {
    this.subtermArray = this.etyForm.get('subterm') as FormArray;
    this.subtermArray.push(this.createSubterm());
    
   }

  addComponent() { 
    this.componentArray = this.etyForm.get('component') as FormArray;
    this.componentArray.push(this.createComponent());
  }

  removeComponent(index){
    this.componentArray = this.etyForm.get('component') as FormArray;
    this.componentArray.removeAt(index);
  }

  addRelation(index){
    const control = (<FormArray>this.etyForm.controls['component']).at(index).get('relation') as FormArray;
    control.push(this.createRelation());
  }

  removeRelation(ix, iy){
    const control = (<FormArray>this.etyForm.controls['component']).at(ix).get('relation') as FormArray;
    control.removeAt(iy);
  }

  addSubtermElement(index){
    const control = (<FormArray>this.etyForm.controls['subterm']).at(index).get('subterm_array') as FormArray;
    control.push(this.createSubtermComponent());
  }

  removeSubtermElement(ix, iy){
    const control = (<FormArray>this.etyForm.controls['subterm']).at(ix).get('subterm_array') as FormArray;
    control.removeAt(iy);
  }

  removeSubterm(index){
    this.componentArray = this.etyForm.get('subterm') as FormArray;
    this.componentArray.removeAt(index);
    
  }

  createRelation(){
    return this.formBuilder.group({
      trait: '',
      value: ''
    })
  }

  removeSubtermComponent(ix, iy){
    const control = (<FormArray>this.etyForm.controls['component']).at(ix).get('sub_term') as FormArray;
    control.removeAt(iy);
  }

  removeCorrespondsToComponent(ix, iy){
    const control = (<FormArray>this.etyForm.controls['component']).at(ix).get('corresponds_to') as FormArray;
    control.removeAt(iy);
  }

  createComponent() {
    return this.formBuilder.group({
      sub_term: new FormArray([this.createSubtermComponent()]),
      corresponds_to: new FormArray([this.createSubtermComponent()]),
      relation: new FormArray([])
    })
  }

  createSubtermComponent() {
    return this.formBuilder.group({
      entity: ''
    })
  }

  createSubterm() {
    return this.formBuilder.group({
      subterm_array : new FormArray([this.createSubtermComponent()])
    })
  }

}
