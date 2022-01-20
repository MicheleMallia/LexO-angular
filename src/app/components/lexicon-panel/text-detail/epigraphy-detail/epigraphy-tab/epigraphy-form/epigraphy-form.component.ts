import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentSystemService } from 'src/app/services/document-system/document-system.service';
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

  data : object;

  epigraphyForm = new FormGroup({
    tokens: new FormArray([this.createToken()]),
  })

  constructor(private documentService : DocumentSystemService, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.epigraphyForm = this.formBuilder.group({
      tokens: this.formBuilder.array([this.createToken()])
    })

    
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
