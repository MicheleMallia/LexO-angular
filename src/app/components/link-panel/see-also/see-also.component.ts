import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { DataService, Person } from '../../lexicon-panel/text-detail/edit-detail/core-tab/lexical-entry-core-form/data.service';

@Component({
  selector: 'app-see-also',
  templateUrl: './see-also.component.html',
  styleUrls: ['./see-also.component.scss']
})
export class SeeAlsoComponent implements OnInit {

  @Input() seeAlsoData: any[] | any;

  private subject: Subject<any> = new Subject();
  private subject_input: Subject<any> = new Subject();

  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;

  isSense;
  isForm;
  isLexEntry;

  searchResults: [];
  memorySeeAlso = [];
  filterLoading = false;

  seeAlsoForm = new FormGroup({
    seeAlsoArray: new FormArray([this.createSeeAlsoEntry()])
  })

  seeAlsoArray: FormArray;

  constructor(private formBuilder: FormBuilder, private lexicalService: LexicalEntriesService) {
  }

  ngOnInit() {
    this.seeAlsoForm = this.formBuilder.group({
      seeAlsoArray: this.formBuilder.array([this.createSeeAlsoEntry('ciao')])
    })

    this.onChanges();
    /* console.log(this.seeAlsoForm) */
    this.subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onSearchFilter(data)
      }
    )

    this.subject_input.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onChangeSeeAlsoByInput(data['value'], data['i'])
      }
    )
    this.triggerTooltip();
  }


  triggerTooltip() {
    setTimeout(() => {
      //@ts-ignore
      $('.see-also-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (changes.seeAlsoData.currentValue != null) {
        this.object = changes.seeAlsoData.currentValue;
        this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;
        this.seeAlsoArray.clear();
        this.memorySeeAlso = [];

        console.log(this.object)

        this.object.array.forEach(element => {
          this.addSeeAlsoEntry(element.label, element.inferred, element.lexicalEntityInstanceName)
          this.memorySeeAlso.push(element.lexicalEntityInstanceName)
        });

        if (this.object.lexicalEntryInstanceName != undefined) {
          this.isLexEntry = true;
          this.isForm = false;
          this.isSense = false;
        } else if (this.object.formInstanceName != undefined) {
          this.isLexEntry = false;
          this.isForm = true;
          this.isSense = false;
        } else if (this.object.senseInstanceName != undefined) {
          this.isLexEntry = false;
          this.isForm = false;
          this.isSense = true;
        }

      } else {
        this.object = null;
      }
    }, 10);

  }

  onChangeSeeAlsoByInput(value, index) {
    var selectedValues = value;
    var lexicalElementId = '';
    if (this.object.lexicalEntryInstanceName != undefined) {
      lexicalElementId = this.object.lexicalEntryInstanceName;
    } else if (this.object.formInstanceName != undefined) {
      lexicalElementId = this.object.formInstanceName;
    } else if (this.object.senseInstanceName != undefined) {
      lexicalElementId = this.object.senseInstanceName;
    }

    if (this.memorySeeAlso[index] == "") {
      let parameters = {
        type: "reference",
        relation: "seeAlso",
        value: selectedValues
      }
      console.log(parameters)
      this.lexicalService.updateGenericRelation(lexicalElementId, parameters).subscribe(
        data => {
          console.log(data)
        }, error => {
          console.log(error)
        }
      )
    } else {
      let oldValue = this.memorySeeAlso[index];
      let parameters = {
        type: "reference",
        relation: "seeAlso",
        value: selectedValues,
        currentValue: oldValue
      }
      console.log(parameters)
      this.lexicalService.updateGenericRelation(lexicalElementId, parameters).subscribe(
        data => {
          console.log(data)
        }, error => {
          console.log(error)
        }
      )
    }

  }

  onChangeSeeAlso(seeAlso, index) {
    console.log(seeAlso.selectedItems)
    if (seeAlso.selectedItems.length != 0) {
      var selectedValues = seeAlso.selectedItems[0].value.lexicalEntryInstanceName;
      var lexicalElementId = '';
      if (this.object.lexicalEntryInstanceName != undefined) {
        lexicalElementId = this.object.lexicalEntryInstanceName;
      } else if (this.object.formInstanceName != undefined) {
        lexicalElementId = this.object.formInstanceName;
      } else if (this.object.senseInstanceName != undefined) {
        lexicalElementId = this.object.senseInstanceName;
      }

      if (this.memorySeeAlso[index] == undefined) {
        let parameters = {
          type: "reference",
          relation: "seeAlso",
          value: selectedValues
        }
        console.log(parameters)
        this.lexicalService.updateGenericRelation(lexicalElementId, parameters).subscribe(
          data => {
            console.log(data)
          }, error => {
            console.log(error)
          }
        )
      } else {
        let oldValue = this.memorySeeAlso[index];
        let parameters = {
          type: "reference",
          relation: "seeAlso",
          value: selectedValues,
          currentValue: oldValue
        }
        console.log(parameters)
        this.lexicalService.updateGenericRelation(lexicalElementId, parameters).subscribe(
          data => {
            console.log(data)
          }, error => {
            console.log(error)
          }
        )
      }

    }


  }

  deleteData() {
    this.searchResults = [];
  }



  onSearchFilter(data) {
    this.filterLoading = true;
    this.searchResults = [];
    if (this.object.lexicalEntryInstanceName != undefined) {
      let parameters = {
        text: data,
        searchMode: "startsWith",
        type: "",
        pos: "",
        formType: "entry",
        author: "",
        lang: "",
        status: "",
        offset: 0,
        limit: 500
      }
      console.log(data.length)
      if (data != "" && data.length >= 3) {
        this.lexicalService.getLexicalEntriesList(parameters).subscribe(
          data => {
            console.log(data)
            this.searchResults = data['list']
            this.filterLoading = false;
          }, error => {
            console.log(error)
            this.filterLoading = false;
          }
        )
      } else {
        this.filterLoading = false;
      }
    } else if (this.object.formInstanceName != undefined) {
      let lexId = this.object.parentInstanceName;
      let parameters = {
        form: "pesca",
        formType: "lemma",
        lexicalEntry: lexId,
        senseUris: "",
        extendTo: "",
        extensionDegree: 3
      }

      this.lexicalService.getFormList(parameters).subscribe(
        data => {
          console.log(data)
          this.searchResults = data['list']
          this.filterLoading = false;
        }, error => {
          console.log(error)
          this.filterLoading = false;
        }
      )
    } else if (this.object.senseInstanceName != undefined) {

      let parameters = {
        text: data,
        searchMode: "startsWith",
        type: "",
        pos: "",
        formType: "entry",
        author: "",
        lang: "",
        status: "",
        offset: 0,
        limit: 500
      }

      this.lexicalService.getLexicalSensesList(parameters).subscribe(
        data => {
          console.log(data)
          this.searchResults = data
          this.filterLoading = false;
        }, error => {
          console.log(error)
          this.filterLoading = false;
        }
      )
    } else {
      this.filterLoading = false;
    }
    console.log(data)

  }

  triggerSeeAlsoInput(evt, i) {
    if (evt.target != undefined) {
      let value = evt.target.value;
      this.subject_input.next({ value, i })
    }
  }

  triggerSeeAlso(evt) {
    if (evt.target != undefined) {
      this.subject.next(evt.target.value)
    }

  }
  onChanges(): void {
    this.seeAlsoForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    })
  }

  createSeeAlsoEntry(e?, i?, le?) {
    if (e == undefined) {
      return this.formBuilder.group({
        entity: null,
        inferred: false,
        lexical_entity: null
      })
    } else {
      return this.formBuilder.group({
        entity: e,
        inferred: i,
        lexical_entity: le
      })
    }

  }

  addSeeAlsoEntry(e?, i?, le?) {
    this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;

    if (e == undefined) {
      this.seeAlsoArray.push(this.createSeeAlsoEntry());
    } else {
      this.seeAlsoArray.push(this.createSeeAlsoEntry(e, i, le));
    }

    this.triggerTooltip();
  }

  removeElement(index) {
    this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;

    const lexical_entity = this.seeAlsoArray.at(index).get('lexical_entity').value;

    if (this.object.lexicalEntryInstanceName != undefined) {

      let lexId = this.object.lexicalEntryInstanceName;

      let parameters = {
        relation: 'seeAlso',
        value: lexical_entity
      }

      console.log(parameters)

      this.lexicalService.deleteLinguisticRelation(lexId, parameters).subscribe(
        data => {
          console.log(data)
          //TODO: inserire updater per card last update
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          console.log(error)
        }
      )
    } else if (this.object.formInstanceName != undefined) {
      let formId = this.object.formInstanceName;

      let parameters = {
        relation: 'seeAlso',
        value: lexical_entity
      }

      console.log(parameters)

      this.lexicalService.deleteLinguisticRelation(formId, parameters).subscribe(
        data => {
          console.log(data)
          //TODO: inserire updater per card last update
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          console.log(error)
        }
      )

    } else if (this.object.senseInstanceName != undefined) {
      let senseId = this.object.senseInstanceName;

      let parameters = {
        type: 'morphology',
        relation: 'seeAlso',
        value: lexical_entity
      }

      console.log(parameters)

      this.lexicalService.deleteLinguisticRelation(senseId, parameters).subscribe(
        data => {
          console.log(data)
          //TODO: inserire updater per card last update
          this.lexicalService.updateLexCard(this.object)
        }, error => {
          console.log(error)
        }
      )
    }
    this.memorySeeAlso.splice(index, 1)
    this.seeAlsoArray.removeAt(index);
  }

}
