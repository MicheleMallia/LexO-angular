import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DocumentSystemService } from 'src/app/services/document-system/document-system.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
declare var $: JQueryStatic;



@Component({
  selector: 'app-epigraphy-form',
  templateUrl: './epigraphy-form.component.html',
  styleUrls: ['./epigraphy-form.component.scss']
})
export class EpigraphyFormComponent implements OnInit{

  @Input() epiData: any;
  object : any;
  tokenArray: FormArray;
  private search_subject: Subject<any> = new Subject();
  private form_subject: Subject<any> = new Subject();
  searchResults = [];
  memoryForms = [] ;


  data : object;
  sel_t : object;

  epigraphyForm = new FormGroup({
    tokens: new FormArray([this.createToken()]),
  })

  constructor(private documentService : DocumentSystemService, private formBuilder: FormBuilder, private toastr: ToastrService, private lexicalService : LexicalEntriesService) { }

  ngOnInit(): void {

    this.epigraphyForm = this.formBuilder.group({
      tokens: this.formBuilder.array([this.createToken()])
    })

    this.search_subject.pipe(debounceTime(1000)).subscribe(
      data => {
          this.onSearchFilter(data)
      }
    )

    this.form_subject.pipe(debounceTime(1000)).subscribe(
      data => {
          this.onChangeForm(data)
      }
    )

    
  }


  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
        if (this.object != changes.epiData.currentValue) {
            this.tokenArray = this.epigraphyForm.get('tokens') as FormArray;
            this.tokenArray.clear();
            /* 

            this.denotesArray = this.coreForm.get('denotes') as FormArray;
            this.denotesArray.clear();

            this.cognatesArray = this.coreForm.get('cognate') as FormArray;
            this.cognatesArray.clear();

            this.evokesArray = this.coreForm.get('evokes') as FormArray;
            this.evokesArray.clear();

            this.memoryPos = '';

            this.staticMorpho = [] */
        }
        this.data = {
          tokens : [
            {
              "id": 1,
              "value": "ligula",
              "start": 84,
              "end": 57
            }, {
              "id": 1,
              "value": "fusce",
              "start": 38,
              "end": 48
            }, {
              "id": 1,
              "value": "quis",
              "start": 94,
              "end": 5
            }, {
              "id": 18,
              "value": "cras",
              "start": 29,
              "end": 77
            }, {
              "id": 16,
              "value": "pede",
              "start": 17,
              "end": 73
            }, {
              "id": 13,
              "value": "aliquet",
              "start": 24,
              "end": 90
            }, {
              "id": 5,
              "value": "mi",
              "start": 34,
              "end": 65
            }, {
              "id": 18,
              "value": "lectus",
              "start": 64,
              "end": 28
            }, {
              "id": 4,
              "value": "nec",
              "start": 55,
              "end": 20
            }, {
              "id": 7,
              "value": "dui",
              "start": 52,
              "end": 12
            }, {
              "id": 14,
              "value": "lectus",
              "start": 61,
              "end": 20
            }, {
              "id": 13,
              "value": "eleifend",
              "start": 30,
              "end": 51
            }, {
              "id": 9,
              "value": "eleifend",
              "start": 53,
              "end": 53
            }, {
              "id": 16,
              "value": "justo",
              "start": 6,
              "end": 92
            }, {
              "id": 1,
              "value": "vestibulum",
              "start": 81,
              "end": 7
            }, {
              "id": 12,
              "value": "convallis",
              "start": 8,
              "end": 91
            }, {
              "id": 20,
              "value": "non",
              "start": 25,
              "end": 5
            }, {
              "id": 9,
              "value": "ullamcorper",
              "start": 11,
              "end": 17
            }, {
              "id": 8,
              "value": "in",
              "start": 4,
              "end": 8
            }, {
              "id": 5,
              "value": "ultrices",
              "start": 27,
              "end": 27
            }
          ]         
        }

        this.object = changes.epiData.currentValue;

        console.log(this.object)
        if (this.object != null) {
            
            //TODO: popolare array form con tokens
            
           
        }


    }, 10)

  }

  onChangeForm(data) {
    /* var index = data['i']; */
    let parameters;
    //this.cognatesArray = this.coreForm.get("cognate") as FormArray;
    const newValue = data['name']
    parameters = {
        type: "lexicalRel",
        relation: "cognate",
        value: newValue
    }
    /* if (this.memoryForms == undefined) {
        const newValue = data['name']
        parameters = {
            type: "lexicalRel",
            relation: "cognate",
            value: newValue
        }
        


    } else {
        const oldValue = this.memoryForms[0]['lexicalEntity']
        const newValue = data['name']
        parameters = {
            type: "lexicalRel",
            relation: "cognate",
            value: newValue,
            currentValue: oldValue
        }
        this.memoryForms[0] = data;
    } */

    console.log(parameters)

    this.lexicalService.triggerAttestationPanel(true);
    this.lexicalService.sendToAttestationPanel(data);
    //let lexId = this.object.lexicalEntryInstanceName;
    /* this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
        data => {
            console.log(data);
            this.lexicalService.spinnerAction('off');
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            this.lexicalService.updateLexCard(data)
        }, error => {
            console.log(error)

            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
            this.lexicalService.spinnerAction('off');
            if(error.status == 200){
                this.toastr.success('Cognates changed correctly for ' + lexId, '', {
                    timeOut: 5000,
                });
            }else{
                this.toastr.error(error.error, 'Error', {
                    timeOut: 5000,
                  });
                
            }
        }
    ) */

    this.memoryForms[0] = data;
  }

  clearAll(){
    this.searchResults = null;
  }

  handleForm(evt) {

    if (evt instanceof NgSelectComponent) {
        if (evt.selectedItems.length > 0) {
            console.log(evt.selectedItems[0])
            let label;
            if(evt.selectedItems[0]['value']['formInstanceName'] != undefined){
              label = evt.selectedItems[0]['value']['formInstanceName'];
            }else{
              label = evt.selectedItems[0].label;
            }
            this.onChangeForm({ name: label})
        }
    } else {
        let label = evt.target.value;
        this.form_subject.next({ name: label})
    }
  }
  
  deleteData() {
    this.searchResults = [];
  }

  triggerSearch(evt) {
    if (evt.target != undefined) {
        
        this.search_subject.next(evt.target.value)
    }
  }

  onSearchFilter(data) {
    this.searchResults = [];
    console.log(data)
    let parameters = {
        text: data,
        searchMode: "startsWith",
        representationType: "writtenRep",
        author: "",
        offset: 0,
        limit: 500
    }
    console.log(parameters)
    if (data != "") { /* && data.length >= 3 */
      this.lexicalService.getFormList(parameters).subscribe(
          data => {
              console.log(data)
              this.searchResults = data['list']
          }, error => {
              //console.log(error)
          }
      )
    } 
    
  }

  /* createNewForm(name){
    console.log(name)
    return new Promise((resolve) => {
      // Simulate backend call.
      setTimeout(() => {
          resolve({ id: 5, name: name, new_etymon: true });
      }, 1000);
    })
  } */

  selectedToken(t){
    console.log(t);
    this.sel_t = t;
  }

  createToken(token?){
    if (token != undefined) {
      return this.formBuilder.group({
          entity: new FormControl(token)
      })
  } else {
      return this.formBuilder.group({
          entity: new FormControl('')
      })
  }
  }

}

