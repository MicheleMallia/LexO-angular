import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { DataService, Person } from '../../core-tab/lexical-entry-core-form/data.service';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-lexical-entry-synsem-form',
  templateUrl: './lexical-entry-synsem-form.component.html',
  styleUrls: ['./lexical-entry-synsem-form.component.scss']
})
export class LexicalEntrySynsemFormComponent implements OnInit {

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  componentRef: any;

  @Input() lexData: any;

  synsemForm = new FormGroup({
    label: new FormControl(''),
    frames: new FormArray([this.createFrame()])
  })

  frameArray: FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.synsemForm = this.formBuilder.group({
      label: '',
      frames: this.formBuilder.array([])
    })
    this.onChanges();
    this.loadPeople();
    this.triggerTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (this.object != changes.lexData.currentValue) {
        if (this.frameArray != null) {
          this.frameArray.clear();
        }
      }
      this.loadPeople();
      this.object = changes.lexData.currentValue;
      if (this.object != null) {
        this.synsemForm.get('label').setValue(this.object.label, { emitEvent: false });

      }
      this.triggerTooltip();
    }, 10)
  }

  triggerTooltip() {
    setTimeout(() => {
      //@ts-ignore
      $('.vartrans-tooltip').tooltip({
        trigger: 'hover'
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
    this.synsemForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    })
  }

  addFrame() {
    this.frameArray = this.synsemForm.get('frames') as FormArray;
    this.frameArray.push(this.createFrame());
  }

  addArg(index){
    const control = (<FormArray>this.synsemForm.controls['frames']).at(index).get('args') as FormArray;
    control.push(this.createArg());
  }

  addForm(ix, iy){
    const control = ((<FormArray>this.synsemForm.controls['frames']).at(ix).get('args') as FormArray).at(iy).get('form') as FormArray;
    control.push(this.createForm());
  }

  removeArg(ix, iy){
    const control = (<FormArray>this.synsemForm.controls['frames']).at(ix).get('args') as FormArray;
    control.removeAt(iy);
  }

  removeForm(ix, iy, iz){
    const control = ((<FormArray>this.synsemForm.controls['frames']).at(ix).get('args') as FormArray).at(iy).get('form') as FormArray;
    control.removeAt(iz);
  }

  removeFrame(index) {
    this.frameArray = this.synsemForm.get('frames') as FormArray;
    this.frameArray.removeAt(index);
  }

  createFrame(): FormGroup {
    return this.formBuilder.group({
      label: '',
      type: '',
      example: '',
      args: new FormArray([])
    })
  }

  createArg() : FormGroup {
    return this.formBuilder.group({
      label: '',
      type: '',
      marker: '',
      optional: false,
      form: new FormArray([])
    })
  }

  createForm() : FormGroup {
    return this.formBuilder.group({
      form_label: ''
    })
  }


}
