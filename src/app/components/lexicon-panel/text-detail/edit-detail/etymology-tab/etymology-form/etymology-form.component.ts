import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
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
    etylink: new FormArray([this.createEtyLink()]),
    cognates: new FormArray([this.createCognate()])
  })

  etyLinkArray: FormArray;
  cognatesArray: FormArray;

  private subject_cognates: Subject<any> = new Subject();
  private subject_cognates_input: Subject<any> = new Subject();
  searchResults: [];
  filterLoading = false;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.etyForm = this.formBuilder.group({
      label: '',
      author: '',
      uncertain : false,
      etylink: this.formBuilder.array([]),
      cognates : this.formBuilder.array([]),
    })
    this.onChanges();
    this.loadPeople();
    this.triggerTooltip();

    this.subject_cognates.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onSearchFilter(data)
      }
    )
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
        if (this.etyLinkArray != null || this.cognatesArray != null) {
          this.etyLinkArray.clear();
          this.cognatesArray.clear();
          
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

  addCognate() {
    this.cognatesArray = this.etyForm.get('cognates') as FormArray;
    this.cognatesArray.push(this.createCognate());
    
   }

  addEtyLink() { 
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    this.etyLinkArray.push(this.createEtyLink());
  }

  removeEtyLink(index){
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    this.etyLinkArray.removeAt(index);
  }

  removeCognate(index){
    this.etyLinkArray = this.etyForm.get('cognates') as FormArray;
    this.etyLinkArray.removeAt(index);
    
  }

  createRelation(){
    return this.formBuilder.group({
      trait: '',
      value: ''
    })
  }

  createEtyLink() {
    return this.formBuilder.group({
      lex_entity: new FormControl(null),
      label: new FormControl(null),
      etyLinkType: new FormControl(null),
      etySource : new FormControl(null),
      etyTarget : new FormControl(null)
    })
  }


  createCognate() {
    return this.formBuilder.group({
      cognate : new FormControl(null),
      label : new FormControl(null)
    })
  }

  triggerCognates(evt) {
    if (evt.target != undefined) {
      this.subject_cognates.next(evt.target.value)
    }
  }

  triggerCognatesInput(evt, i) {
    if (evt.target != undefined) {
      let value = evt.target.value;
      this.subject_cognates_input.next({ value, i })
    }
  }

  deleteData() {
    this.searchResults = [];
  }

  onSearchFilter(data) {
    this.filterLoading = true;
    this.searchResults = [];
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
    //console.log(data.length)
    if (data != "" && data.length >= 3) {
      this.lexicalService.getLexicalEntriesList(parameters).subscribe(
        data => {
          //console.log(data)
          this.searchResults = data['list']
          this.filterLoading = false;
        }, error => {
          //console.log(error)
          this.filterLoading = false;
        }
      )
    } else {
      this.filterLoading = false;
    }
    /* if (this.object.lexicalEntryInstanceName != undefined) {
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
      //console.log(data.length)
      if (data != "" && data.length >= 3) {
        this.lexicalService.getLexicalEntriesList(parameters).subscribe(
          data => {
            //console.log(data)
            this.searchResults = data['list']
            this.filterLoading = false;
          }, error => {
            //console.log(error)
            this.filterLoading = false;
          }
        )
      } else {
        this.filterLoading = false;
      }
    } else if (this.object.formInstanceName != undefined) {
      let lexId = this.object.parentInstanceName;
      let parameters = {
        text: data,
        formType: "lemma",
        lexicalEntry: lexId,
        senseUris: "",
        extendTo: "",
        extensionDegree: 3
      }
      
      this.lexicalService.getFormList(parameters).subscribe(
        data => {
          //console.log(data)
          this.searchResults = data['list']
          this.filterLoading = false;
        }, error => {
          //console.log(error)
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
          //console.log(data)
          this.searchResults = data
          this.filterLoading = false;
        }, error => {
          //console.log(error)
          this.filterLoading = false;
        }
      )
    } else {
      this.filterLoading = false;
    } */
    //console.log(data)

  }

}
