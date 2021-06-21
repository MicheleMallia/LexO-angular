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

  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;

  searchResults: [];
  filterLoading = false;

  seeAlsoForm = new FormGroup({
    seeAlsoArray: new FormArray([this.createSeeAlsoEntry()])
  })

  seeAlsoArray: FormArray;

  constructor(private formBuilder: FormBuilder, private lexicalService : LexicalEntriesService) {
  }

  ngOnInit() {
    this.seeAlsoForm = this.formBuilder.group({
      seeAlsoArray: this.formBuilder.array([])
    })
   
    this.onChanges();
    /* console.log(this.seeAlsoForm) */
    this.subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onSearchFilter(data)
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
    /* console.log(this.sameAsData); */
    if(changes.seeAlsoData.currentValue != null){
      this.object = changes.seeAlsoData.currentValue;
      this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;
      this.seeAlsoArray.clear();
    }else {
      this.object = null;
    }
  }

  onChangeSeeAlso(seeAlso, index){
    console.log(seeAlso.selectedItems)
    if(seeAlso.selectedItems.length != 0){
      var selectedValues = seeAlso.selectedItems[0].value.lexicalEntry;
      let lexId = this.object.lexicalEntryInstanceName;
    
      let parameters = {
        type : "conceptRef",
        relation : "seeAlso",
        value : selectedValues
      }
      console.log(parameters)
      this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
        data=>{
          console.log(data)
        }, error=>{
          console.log(error)
        }
      )
    }
    
    
  }

  deleteData(){
    this.searchResults = [];
  }



  onSearchFilter(data){
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
        data=>{
          console.log(data)
          this.searchResults = data['list']
          this.filterLoading = false;
        },error=>{
          console.log(error)
          this.filterLoading = false;
        }
      )
    }else{
      this.filterLoading = false;
    }
    console.log(data)
  
  }

  triggerSeeAlso(evt){
    if(evt.target != undefined){
      this.subject.next(evt.target.value)
    }
    
  }
  onChanges(): void {
    this.seeAlsoForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
        console.log(searchParams)
    })
}

  createSeeAlsoEntry() {
    return this.formBuilder.group({
      entity: null
    })
  }

  addSeeAlsoEntry() {
    this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;
    this.seeAlsoArray.push(this.createSeeAlsoEntry());
    this.triggerTooltip();
  }

  removeElement(index) {
    this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;
    this.seeAlsoArray.removeAt(index);
  }

}
