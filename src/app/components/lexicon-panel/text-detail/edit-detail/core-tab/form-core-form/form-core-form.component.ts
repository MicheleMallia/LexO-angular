import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { DataService, Person } from '../lexical-entry-core-form/data.service';

@Component({
  selector: 'app-form-core-form',
  templateUrl: './form-core-form.component.html',
  styleUrls: ['./form-core-form.component.scss']
})
export class FormCoreFormComponent implements OnInit {

  @Input() formData: any;

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;

  formCore = new FormGroup({
    inheritance : new FormArray([this.createInheritance()]),
    form: new FormControl(''),
    type: new FormControl(''),
    label : new FormArray([this.createLabel()]),
    morphoTraits: new FormArray([this.createMorphoTraits()])
  })

  morphoTraits: FormArray;
  inheritanceArray : FormArray;
  labelArray : FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    setTimeout(() => {
      //@ts-ignore
      $('.denotes-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 1000);
    this.loadPeople();

    this.formCore = this.formBuilder.group({
      inheritance : this.formBuilder.array([]),
      form: '',
      type: '',
      label : this.formBuilder.array([]),
      morphoTraits: this.formBuilder.array([]),
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
      if (this.object != changes.formData.currentValue) {
        this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;
        this.morphoTraits.clear();

        this.inheritanceArray = this.formCore.get('inheritance') as FormArray;
        this.inheritanceArray.clear();

        this.labelArray = this.formCore.get('label') as FormArray;
        this.labelArray.clear();
      }
      this.object = changes.formData.currentValue;
      console.log(this.object)
      if (this.object != null) {

        for (var i = 0; i < this.object.inheritedMorphology.length; i++) {
          const trait = this.object.inheritedMorphology[i]['trait'];
          const value = this.object.inheritedMorphology[i]['value'];
          this.addInheritance(trait, value);
        }
        
        this.formCore.get('form').setValue(this.object.formInstanceName, { emitEvent: false });
        this.formCore.get('type').setValue(this.object.type, { emitEvent: false });

        for (var i = 0; i < this.object.label.length; i++) {
          const trait = this.object.label[i]['propertyID'];
          const value = this.object.label[i]['propertyValue'];
          this.addLabel(trait, value);
        }

        for (var i = 0; i < this.object.morphology.length; i++) {
          const trait = this.object.morphology[i]['trait'];
          const value = this.object.morphology[i]['value'];
          this.addMorphoTraits(trait, value);
        }

        /* this.formCore.get('phonetics').setValue(this.object.phonetics, { emitEvent: false }) */
      }
    }, 200)

  }

  onChanges(): void {
    this.formCore.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    })
  }

  createMorphoTraits(t?, v?): FormGroup {
    if (t != undefined) {
      return this.formBuilder.group({
        trait: t,
        value: v
      })
    } else {
      return this.formBuilder.group({
        trait: '',
        value: ''
      })
    }
  }

  createInheritance(t?, v?): FormGroup {
    return this.formBuilder.group({
      trait: t,
      value: v
    })
  }

  createLabel(t?, v?): FormGroup {
    return this.formBuilder.group({
      propertyID: t,
      propertyValue: v
    })
  }

  addLabel(t?, v?) {
    this.labelArray = this.formCore.get('label') as FormArray;
    this.labelArray.push(this.createLabel(t, v));
  }

  addInheritance(t?, v?) {
    this.inheritanceArray = this.formCore.get('inheritance') as FormArray;
    this.inheritanceArray.push(this.createInheritance(t, v));
  }

  addMorphoTraits(t?, v?) {
    this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;
    if (t != undefined) {
      this.morphoTraits.push(this.createMorphoTraits(t, v));
    } else {
      this.morphoTraits.push(this.createMorphoTraits());
    }
  }

  removeElement(index){
    this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;
    this.morphoTraits.removeAt(index);
}

}
