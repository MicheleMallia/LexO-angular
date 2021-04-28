import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
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
    partOfSpeech: new FormControl(''),
    gender: new FormControl(''),
    form: new FormControl(''),
    type: new FormControl(''),
    morphoTraits: new FormArray([this.createMorphoTraits()]),
    phonetics: new FormControl('')
  })

  morphoTraits: FormArray;

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
      partOfSpeech: '',
      gender: '',
      form: '',
      type: '',
      morphoTraits: this.formBuilder.array([]),
      phonetics: ''
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
      }
      this.object = changes.formData.currentValue;
      console.log(this.object)
      if (this.object != null) {
        this.formCore.get('partOfSpeech').setValue(this.object.morphology[0]['value'], { emitEvent: false });
        this.formCore.get('gender').setValue(this.object.morphology[1]['value'], { emitEvent: false });
        this.formCore.get('form').setValue(this.object.formInstanceName, { emitEvent: false });
        this.formCore.get('type').setValue(this.object.type, { emitEvent: false });

        for (var i = 0; i < this.object.morphology.length; i++) {
          const trait = this.object.morphology[i]['trait'];
          const value = this.object.morphology[i]['value'];
          this.addMorphoTraits(trait, value);
        }

        this.formCore.get('phonetics').setValue(this.object.phonetics, { emitEvent: false })
      }
    }, 10)

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
