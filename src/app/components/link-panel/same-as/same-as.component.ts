import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { DataService, Person } from '../../lexicon-panel/text-detail/edit-detail/core-tab/lexical-entry-core-form/data.service';

@Component({
  selector: 'app-same-as',
  templateUrl: './same-as.component.html',
  styleUrls: ['./same-as.component.scss']
})
export class SameAsComponent implements OnInit {

  @Input() sameAsData: any[] | any;

  private subject: Subject<any> = new Subject();
  private subject_input: Subject<any> = new Subject();
  subscription: Subscription;
  object: any;
  searchResults: [];
  filterLoading = false;

  memorySameAs = [];
  isSense;
  isForm;
  isLexEntry;

  sameAsForm = new FormGroup({
    sameAsArray: new FormArray([this.createSameAsEntry()])
  })

  sameAsArray: FormArray;

  constructor(private formBuilder: FormBuilder, private lexicalService : LexicalEntriesService) {
  }

  ngOnInit() {
    this.sameAsForm = this.formBuilder.group({
      sameAsArray: this.formBuilder.array([])
    })

    /* this.subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onSearchFilter(data)
      }
    ) */

    this.subject_input.pipe(debounceTime(1000)).subscribe(
      data => {        
        this.onChangeSameAsByInput(data['value'], data['i'])
      }
    )
  
    this.triggerTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if(changes.sameAsData.currentValue != undefined){
        this.object = changes.sameAsData.currentValue;
        this.sameAsArray = this.sameAsForm.get('sameAsArray') as FormArray;
        this.sameAsArray.clear();
        
        this.memorySameAs = [];
        console.log(this.object)
  
        this.object.array.forEach(element => {
          this.addSameAsEntry(element.label, element.inferred, element.lexicalEntityInstanceName)
          this.memorySameAs.push(element.lexicalEntityInstanceName);
        });

        if(this.object.lexicalEntryInstanceName != undefined){
          this.isLexEntry = true;
          this.isForm = false;
          this.isSense = false;
        }else if(this.object.formInstanceName != undefined){
          this.isLexEntry = false;
          this.isForm = true;
          this.isSense = false;
        }else if(this.object.senseInstanceName != undefined){
          this.isLexEntry = false;
          this.isForm = false;
          this.isSense = true;
        }
        
      }else {
        this.object = null;
      }
    }, 10);
  }

  onChangeSameAsByInput(value, index){
    var selectedValues = value;
    var lexicalElementId = '';
    if (this.object.lexicalEntryInstanceName != undefined) {
      lexicalElementId = this.object.lexicalEntryInstanceName;
    } else if (this.object.formInstanceName != undefined) {
      lexicalElementId = this.object.formInstanceName;
    } else if (this.object.senseInstanceName != undefined) {
      lexicalElementId = this.object.senseInstanceName;
    }

    console.log(this.memorySameAs[index])
    if (this.memorySameAs[index] == undefined) {
      let parameters = {
        type: "reference",
        relation: "sameAs",
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
      let oldValue = this.memorySameAs[index];
      let parameters = {
        type: "reference",
        relation: "sameAs",
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

  /* onChangeSameAs(sameAs, index){
    console.log(sameAs.selectedItems)
    if(sameAs.selectedItems.length != 0){
      var selectedValues = sameAs.selectedItems[0].value.lexicalEntry;
      if(this.object.lexicalEntryInstanceName != undefined){
        let lexId = this.object.lexicalEntryInstanceName;
    
        let parameters = {
          type : "reference",
          relation : "sameAs",
          value : selectedValues
        }
        console.log(parameters)
        this.lexicalService.updateGenericRelation(lexId, parameters).subscribe(
          data=>{
            console.log(data)
          }, error=>{
            console.log(error)
          }
        )
      }else if(this.object.formInstanceName != undefined){
        let formId = this.object.formInstanceName;
    
        let parameters = {
          type : "reference",
          relation : "sameAs",
          value : selectedValues
        }
        console.log(parameters)
        this.lexicalService.updateGenericRelation(formId, parameters).subscribe(
          data=>{
            console.log(data)
          }, error=>{
            console.log(error)
          }
        )
      }else if(this.object.senseInstanceName != undefined){
        let senseId = this.object.senseInstanceName;
    
        let parameters = {
          type : "reference",
          relation : "sameAs",
          value : selectedValues
        }
        console.log(parameters)
        this.lexicalService.updateGenericRelation(senseId, parameters).subscribe(
          data=>{
            console.log(data)
          }, error=>{
            console.log(error)
          }
        )
      }
      
      
    }
    
    
  } */

  deleteData(){
    this.searchResults = [];
  }



  /* onSearchFilter(data){
    this.filterLoading = true;
    this.searchResults = [];
    if(this.object.lexicalEntryInstanceName != undefined){
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
      if(data != "" && data.length >= 3){
        this.lexicalService.getLexicalEntriesList(parameters).subscribe(
          data=>{
            console.log(data)
            this.searchResults = data['list']
            console.log(this.searchResults)
            this.filterLoading = false;
          },error=>{
            console.log(error)
            this.filterLoading = false;
          }
        )
      }else{
        this.filterLoading = false;
      }
    }else if(this.object.formInstanceName != undefined){
      if(data != "" && data.length >= 3){
        let lexId = this.object.parentInstanceName;
        let parameters = {
          form: "pesca",
          formType: "lemma",
          lexicalEntry: lexId,
          senseUris: "",
          extendTo: "",
          extensionDegree: 3
        }
  
        console.log(parameters);
        this.lexicalService.getFormList(parameters).subscribe(
          data=>{
            console.log(data)
            this.searchResults = data['list']
            this.filterLoading = false;
          },error=>{
            console.log(error)
            this.filterLoading = false;
          }
        )
      }
      
    }else if(this.object.senseInstanceName != undefined){
      console.log("Ciao")
      if(data != "" && data.length >= 3){
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
          data=>{
            this.searchResults = data
            this.filterLoading = false;
          },error=>{
            console.log(error)
            this.filterLoading = false;
          }
        )
      }
      
    }else{
      this.filterLoading = false;
    }
    console.log(data)
  
  } */

  triggerSameAsInput(evt, i){
    if(evt.target != undefined){
      let value = evt.target.value;
      this.subject_input.next({value, i})
    }
  }

  /* triggerSameAs(evt){
    if(evt.target != undefined){
      this.subject.next(evt.target.value)
    }
    
  } */

  triggerTooltip() {
    setTimeout(() => {
      //@ts-ignore
      $('.same-as-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 500);
  }

  createSameAsEntry(e?, i?, le?) {
    if(e == undefined){
      return this.formBuilder.group({
        entity: null,
        inferred : false,
        lexical_entity : null
      })
    }else{
      return this.formBuilder.group({
        entity: e,
        inferred : i,
        lexical_entity : le
      })
    }
    
  }

  addSameAsEntry(e?, i?, le?) {
    this.sameAsArray = this.sameAsForm.get('sameAsArray') as FormArray;
    if(e == undefined){
      this.sameAsArray.push(this.createSameAsEntry());
    }else{
      this.sameAsArray.push(this.createSameAsEntry(e, i, le));
    }
    
    this.triggerTooltip();
  }

  removeElement(index) {
    this.sameAsArray = this.sameAsForm.get('sameAsArray') as FormArray;
    const lexical_entity = this.sameAsArray.at(index).get('lexical_entity').value;

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
    this.memorySameAs.splice(index, 1)
    this.sameAsArray.removeAt(index);
  }

}
