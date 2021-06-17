import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
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

  private subject_label: Subject<any> = new Subject();
  private subject_ex_label: Subject<any> = new Subject();

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  typesData = [];
  morphologyData = [];
  valueTraits = [];
  memoryTraits = [];

  formCore = new FormGroup({
    inheritance: new FormArray([this.createInheritance()]),
    type: new FormControl(''),
    label: new FormArray([this.createLabel()]),
    morphoTraits: new FormArray([this.createMorphoTraits()])
  })

  labelData = [];
  memoryLabel = [];

  staticOtherDef = [];
  staticMorpho = [];

  morphoTraits: FormArray;
  inheritanceArray: FormArray;
  labelArray: FormArray;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.lexicalService.getMorphologyData().subscribe(
      data => {
        this.morphologyData = data;
        /* console.log(this.morphologyData) */
      }
    )

    setTimeout(() => {
      //@ts-ignore
      $('.denotes-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 1000);
    this.loadPeople();

    this.formCore = this.formBuilder.group({
      inheritance: this.formBuilder.array([]),
      type: '',
      label: this.formBuilder.array([]),
      morphoTraits: this.formBuilder.array([]),
    })

    this.onChanges();
    this.subject_label.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onChangeLabel(data)
      }
    )

    this.subject_ex_label.pipe(debounceTime(1000)).subscribe(
      data => {
        
        this.onChangeExistingLabelValue(data['evt'], data['i']);
      }
    )

    this.lexicalService.getFormTypes().subscribe(
      data => {
        this.typesData = data;
      },
      error => {
        console.log(error)
      }
    )

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

        this.staticMorpho = [];
        this.staticOtherDef = [];
      }
      this.object = changes.formData.currentValue;
      console.log(this.object)
      if (this.object != null) {

        this.valueTraits = [];
        this.memoryTraits = [];
        this.memoryLabel = [];
        this.labelData = [];

        for (var i = 0; i < this.object.inheritedMorphology.length; i++) {
          const trait = this.object.inheritedMorphology[i]['trait'];
          const value = this.object.inheritedMorphology[i]['value'];
          this.addInheritance(trait, value);
        }

        this.formCore.get('type').setValue(this.object.type, { emitEvent: false });

        for (var i = 0; i < this.object.label.length; i++) {

          const trait = this.object.label[i]['propertyID'];
          const value = this.object.label[i]['propertyValue'];

          this.labelData.push(trait);

          if (value != '') {
            this.addLabel(trait, value);
            this.memoryLabel.push(trait);


            this.staticOtherDef.push({ trait: trait, value: value })
          }

        }

        for (var i = 0; i < this.object.morphology.length; i++) {
          const trait = this.object.morphology[i]['trait'];
          const value = this.object.morphology[i]['value'];
          this.addMorphoTraits(trait, value);
          this.onChangeTrait(trait, i);

          this.staticMorpho.push({ trait: trait, value: value })
        }
      }
    }, 200)

  }

  onChanges(): void {
    /* this.formCore.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    }) */
  }

  onChangeType(evt) {
    this.lexicalService.spinnerAction('on');
    const newType = evt.target.value;
    const formId = this.object.formInstanceName
    const parameters = { relation: "type", value: newType }
    this.lexicalService.updateForm(formId, parameters).pipe(debounceTime(500)).subscribe(
      data => {
        this.lexicalService.spinnerAction('off');
        //this.lexicalService.refreshLexEntryTree();
        this.lexicalService.updateLexCard(this.object)
      }, error => {
        console.log(error);
        //this.lexicalService.refreshLexEntryTree();
        this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
        this.lexicalService.spinnerAction('off');
      }
    )
  }

  debounceKeyup(evt, i) {
    this.lexicalService.spinnerAction('on');
    this.subject_label.next({ evt, i })
  }

  debounceKeyupExisting(evt, i){
    this.lexicalService.spinnerAction('on');
    this.subject_ex_label.next({ evt, i })
  }

  onChangeExistingValue(evt, i) {
    this.lexicalService.spinnerAction('on');
    this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;
    const trait = this.morphoTraits.at(i).get('trait').value;
    const oldValue = this.morphoTraits.at(i).get('value').value;
    const newValue = evt.target.value;
    if (newValue != '') {
      let parameters = {
        type: "morphology",
        relation: trait,
        value: newValue,
        currentValue: oldValue
      }

      this.staticMorpho[i] = { trait: trait, value: newValue }
      let lexId = this.object.lexicalEntryInstanceName;

      this.lexicalService.updateLinguisticRelation(lexId, parameters).pipe(debounceTime(1000)).subscribe(
        data => {
          console.log(data)
          this.lexicalService.refreshAfterEdit(data);
          this.lexicalService.spinnerAction('off');
        },
        error => {
          console.log(error)
          this.lexicalService.refreshAfterEdit({ label: this.object.label });
          this.lexicalService.spinnerAction('off');
        }
      )

    } else {
      this.lexicalService.spinnerAction('off');
    }
  }

  onChangeValue(i) {
    this.lexicalService.spinnerAction('on');
    this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;
    const trait = this.morphoTraits.at(i).get('trait').value;
    const value = this.morphoTraits.at(i).get('value').value;
    if (trait != '' && value != '') {
      console.log("qua chiamo il servizio");
      let parameters = {
        type: "morphology",
        relation: trait,
        value: value
      }
      let formId = this.object.formInstanceName;

      this.staticMorpho.push({ trait: trait, value: value })

      this.lexicalService.updateLinguisticRelation(formId, parameters).pipe(debounceTime(1000)).subscribe(
        data => {
          console.log(data)
          this.lexicalService.spinnerAction('off');
          this.lexicalService.refreshAfterEdit(data);
          //this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard(this.object)
        },
        error => {
          console.log(error)
          this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
        }
      )
    } else {
      this.lexicalService.spinnerAction('off');
    }
  }

  onChangeTrait(evt, i) {

    if (evt.target != undefined) {
      setTimeout(() => {
        this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;
        this.morphoTraits.at(i).patchValue({ trait: evt.target.value, value: "" });
        console.log(evt.target.value)
        if (evt.target.value != '') {
          var arrayValues = this.morphologyData.filter(x => {
            return x['propertyId'] == evt.target.value;
          })['0']['propertyValues'];
          this.valueTraits[i] = arrayValues;
          this.memoryTraits[i] = evt.target.value;
        } else {
          var arrayValues = [];
          this.valueTraits[i] = arrayValues
          this.memoryTraits.splice(i, 1)
        }



      }, 250);
    } else {

      setTimeout(() => {

        var arrayValues = this.morphologyData.filter(x => {
          return x['propertyId'] == evt;
        })['0']['propertyValues'];
        this.valueTraits[i] = arrayValues;
        console.log(this.valueTraits)
        this.memoryTraits.push(evt);

      }, 250);
    }
  }

  onChangeLabelTrait(evt, i) {

    setTimeout(() => {
      this.labelArray = this.formCore.get('label') as FormArray;
      this.labelArray.at(i).patchValue({ propertyID: evt.target.value, propertyValue: "" });
      console.log(this.labelArray)
      if (evt.target.value != '') {

        this.memoryLabel[i] = evt.target.value;
      } else {

        this.memoryLabel.splice(i, 1)
      }



    }, 250);
  }

  onChangeExistingLabelValue(evt, i) {
    this.lexicalService.spinnerAction('on');
    this.labelArray = this.formCore.get('label') as FormArray;
    const trait = this.labelArray.at(i).get('propertyID').value;
    const newValue = evt.target.value;

    console.log(this.object)

    if (newValue != '') {
      const parameters = { relation: trait, value: newValue }

      this.staticOtherDef[i] = { trait: trait, value: newValue }
      let formId = this.object.formInstanceName;

      this.lexicalService.updateForm(formId, parameters).pipe(debounceTime(1000)).subscribe(
        data => {
          console.log(data)
          this.lexicalService.spinnerAction('off');
          //this.lexicalService.refreshLexEntryTree();
          this.lexicalService.updateLexCard(data)
        }, error => {
          console.log(error);
          //this.lexicalService.refreshLexEntryTree();
          const data = this.object;
          data['whatToSearch'] = 'form';
          data['new_label'] = newValue;
          data['changeLabel'] = true;
          this.lexicalService.refreshAfterEdit(data);
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
        }
      )

    } else {
      this.lexicalService.spinnerAction('off');
      this.staticOtherDef[i] = { trait: trait, value: "" }
    }
  }

  onChangeLabel(object) {

    this.labelArray = this.formCore.get('label') as FormArray;
    const trait = this.labelArray.at(object.i).get('propertyID').value;
    const newValue = object.evt.target.value;
    const formId = this.object.formInstanceName;
    const parameters = { relation: trait, value: newValue }
    console.log(this.object)

    this.staticOtherDef.push({ trait: trait, value: newValue })

    if (trait != undefined && newValue != '') {
      this.lexicalService.updateForm(formId, parameters).pipe(debounceTime(1000)).subscribe(
        data => {
          console.log(data)
          this.lexicalService.spinnerAction('off');
          /* this.lexicalService.refreshAfterEdit(data); */
          this.lexicalService.updateLexCard(data)
        }, error => {
          console.log(error);
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
        }
      )
    } else {
      this.lexicalService.spinnerAction('off');
    }
  }

  createMorphoTraits(t?, v?): FormGroup {
    if (t != undefined) {
      return this.formBuilder.group({
        trait: new FormControl(t, [Validators.required, Validators.minLength(0)]),
        value: new FormControl(v, [Validators.required, Validators.minLength(0)])
      })
    } else {
      return this.formBuilder.group({
        trait: new FormControl('', [Validators.required, Validators.minLength(0)]),
        value: new FormControl('', [Validators.required, Validators.minLength(0)])
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
    if (t != undefined) {
      return this.formBuilder.group({
        propertyID: new FormControl(t, [Validators.required, Validators.minLength(0)]),
        propertyValue: new FormControl(v, [Validators.required, Validators.minLength(0)])
      })
    } else {
      return this.formBuilder.group({
        propertyID: new FormControl('', [Validators.required, Validators.minLength(0)]),
        propertyValue: new FormControl('', [Validators.required, Validators.minLength(0)])
      })
    }

  }

  addLabel(t?, v?) {
    this.labelArray = this.formCore.get('label') as FormArray;
    if (t != undefined) {
      this.labelArray.push(this.createLabel(t, v));
    } else {
      this.labelArray.push(this.createLabel());
    }

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

  removeElement(index) {
    this.morphoTraits = this.formCore.get('morphoTraits') as FormArray;

    const trait = this.morphoTraits.at(index).get('trait').value;
    const value = this.morphoTraits.at(index).get('value').value;

    console.log(trait + value)

    if (trait != '') {

      let formId = this.object.formInstanceName;

      let parameters = {
        type: 'morphology',
        relation: trait,
        value: value
      }

      this.lexicalService.deleteLinguisticRelation(formId, parameters).subscribe(
        data => {
          console.log(data)
          //TODO: inserire updater per card last update
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          console.log(error)
        }
      )
    }

    this.staticMorpho.splice(index, 1);
    this.morphoTraits.removeAt(index);
  }

  removeLabel(index) {
    this.labelArray = this.formCore.get('label') as FormArray;


    const trait = this.labelArray.at(index).get('propertyID').value;
    const value = this.labelArray.at(index).get('propertyValue').value;

    console.log(trait + value)

    if (trait != '') {

      let formId = this.object.formInstanceName;

      let parameters = {
        type: 'morphology',
        relation: trait,
        value: value
      }

      this.lexicalService.deleteLinguisticRelation(formId, parameters).subscribe(
        data => {
          console.log(data)
          //TODO: inserire updater per card last update
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          console.log(error)
        }
      )
    }
    this.staticOtherDef.splice(index, 1)
    this.labelArray.removeAt(index);
  }

}
