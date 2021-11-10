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
  private subject_etylink: Subject<any> = new Subject();
  private subject_etylink_input: Subject<any> = new Subject();
  private etylink_note_subject : Subject<any> = new Subject();
  private etylink_label_subject : Subject<any> = new Subject();
  searchResults: [];
  filterLoading = false;

  memoryLinks = [];

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.etyForm = this.formBuilder.group({
      label: '',
      author: '',
      confidence : false,
      etylink: this.formBuilder.array([]),
      cognates : this.formBuilder.array([]),
    })
    this.onChanges();
    this.triggerTooltip();

    this.subject_cognates.pipe(debounceTime(1000)).subscribe(
      data => {
        if(data != null){
          this.onSearchFilter(data)

        }
      }
    )

    this.subject_etylink.pipe(debounceTime(1000)).subscribe(
      data => {
        if(data != null){
          this.onSearchFilter(data)

        }
      }
    )

    this.subject_etylink_input.pipe(debounceTime(1000)).subscribe(
      data => {
        console.log(data)
        if(data != null){
          let value= data['value'];
          let index = data['i'];
          this.onChangeEtylink(value, index)
        }
        
      }
    )

    this.subject_cognates_input.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onSearchFilter(data)
      }
    )

    this.etylink_note_subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onChangeEtylinkNote(data)
      }
    )

    this.etylink_label_subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onChangeEtylinkLabel(data)
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
    
      if (this.object != changes.etymData.currentValue) {
        if (this.etyLinkArray != undefined || this.cognatesArray != undefined) {
          this.etyLinkArray.clear();
          //this.cognatesArray.clear();
          
          this.memoryLinks = [];
        }
      }
      this.object = changes.etymData.currentValue;
      if (this.object != null) {
        this.etyForm.get('label').setValue(this.object.etymology.label, { emitEvent: false });
        this.etyForm.get('author').setValue(this.object.etymology.hypothesisOf, { emitEvent: false });
        if(this.object.etymology.confidence == 0){
          this.etyForm.get('confidence').setValue(true, { emitEvent: false });
        }else{
          this.etyForm.get('confidence').setValue(false, { emitEvent: false });
        }
        
        if(this.object.etyLinks != undefined){
          if(this.object.etyLinks.length != 0){
            this.object.etyLinks.forEach(element => {
              let lex_entity = element.etySourceLabel == '' ? element.etySource : element.etySourceLabel;
              let label = element.label == '' ? element.etySourceLabel : element.label;
              let ety_type = element.etyLinkType;
              let ety_source = element.etySource;
              let ety_target = element.etyTarget;
              let note = element.note;
              let external_iri = element.externalIRI;
              this.addEtyLink(lex_entity, label, ety_type, ety_source, ety_target, note, external_iri);
              this.memoryLinks.push(element);
              /* console.log(element) */
            });
          }
        }
      }
      this.triggerTooltip();
    
  }


  onChanges(): void {
    /* this.etyForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    }) */
    this.etyForm.get('confidence').valueChanges.pipe(debounceTime(100)).subscribe(newConfidence => {
      let confidence_value = null;
      console.log(newConfidence)
      if(newConfidence == false){
        confidence_value = 1
        this.etyForm.get('confidence').setValue(false, { emitEvent: false });
      }else{
        confidence_value = 0
        this.etyForm.get('confidence').setValue(true, { emitEvent: false });
      }

      this.lexicalService.spinnerAction('on');
      let etyId = this.object.etymology.etymologyInstanceName;
      let parameters = {
          relation: 'confidence',
          value: confidence_value
      }
      console.log(parameters)
      this.lexicalService.updateEtymology(etyId, parameters).subscribe(
          data => {
              console.log(data);
              /* data['request'] = 0;
              data['new_label'] = confidence_value
              this.lexicalService.refreshAfterEdit(data); */
              this.lexicalService.updateLexCard(data)
              this.lexicalService.spinnerAction('off');
          },
          error => {
              console.log(error);
              /*  const data = this.object.etymology;
              data['request'] = 0;
              data['new_label'] = confidence_value;
              this.lexicalService.refreshAfterEdit(data); */
              this.lexicalService.spinnerAction('off');
              this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          }
      )

    });

    //TODO: inserire servizio per modifica type link external/internal

    this.etyForm.get("label").valueChanges.pipe(debounceTime(1000)).subscribe(
      updatedLabel => {
        if (updatedLabel.length > 2 && updatedLabel.trim() != '') {
          this.lexicalService.spinnerAction('on');
          let etyId = this.object.etymology.etymologyInstanceName;
          let parameters = {
              relation: 'label',
              value: updatedLabel
          }
          this.lexicalService.updateEtymology(etyId, parameters).subscribe(
            data => {
                //console.log(data);
                data['request'] = 0;
                data['new_label'] = updatedLabel
                this.lexicalService.refreshAfterEdit(data);
                this.lexicalService.spinnerAction('off');
                this.lexicalService.updateLexCard(data)
            },
            error => {
                //console.log(error);
                const data = this.object.etymology;
                data['request'] = 0;
                data['new_label'] = updatedLabel;
                this.lexicalService.refreshAfterEdit(data);
                this.lexicalService.spinnerAction('off');
                this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
            }
          )
        }
      }
    )

    this.etyForm.get("author").valueChanges.pipe(debounceTime(1000)).subscribe(
      updateAuthor => {
        
        this.lexicalService.spinnerAction('on');
        let etyId = this.object.etymology.etymologyInstanceName;
        let parameters = {
            relation: 'hypothesisOf',
            value: updateAuthor
        }
        this.lexicalService.updateEtymology(etyId, parameters).subscribe(
          data => {
              //console.log(data);
              /* data['request'] = 0;
              data['new_label'] = updateAuthor
              this.lexicalService.refreshAfterEdit(data); */
              this.lexicalService.spinnerAction('off');
              this.lexicalService.updateLexCard(data)
          },
          error => {
              //console.log(error);
              /* const data = this.object;
              data['request'] = 0;
              data['new_label'] = updateAuthor;
              this.lexicalService.refreshAfterEdit(data); */
              this.lexicalService.spinnerAction('off');
              this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          }
        )
        
      }
    )
  }

  onChangeEtylinkNote(data){
    console.log(data)
    if(data != undefined){
      
      let newValue = data.evt.target.value;
      let currentValue;
      let index = data?.index;
      
      let oldValue = this.memoryLinks[index].note;

      let instanceName = this.object.etyLinks[index].etymologicalLinkInstanceName;
      

      let parameters = {
        relation: 'note',
        value : newValue,
        currentValue : oldValue
      };

      console.log(parameters)

      this.lexicalService.updateEtylink(instanceName, parameters).subscribe(
        data=> {
          console.log(data);
          this.lexicalService.spinnerAction('off');
          this.lexicalService.updateLexCard(this.object)
          this.memoryLinks[index].note = newValue
        },error=> {
          console.log(error);
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
          this.memoryLinks[index].note = newValue
        }
      )
    
    }
  }

  onChangeEtylinkLabel(data){
    console.log(data)
    if(data != undefined){
      
      let newValue = data.evt.target.value;
      let currentValue;
      let index = data?.index;
      
      let oldValue = this.memoryLinks[index].note;

      let instanceName = this.object.etyLinks[index].etymologicalLinkInstanceName;
      

      let parameters = {
        relation: 'label',
        value : newValue,
        currentValue : oldValue
      };

      console.log(parameters)

      this.lexicalService.updateEtylink(instanceName, parameters).subscribe(
        data=> {
          console.log(data);
          this.lexicalService.spinnerAction('off');
          this.lexicalService.updateLexCard(this.object)
          this.memoryLinks[index].note = newValue
        },error=> {
          console.log(error);
          this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          this.lexicalService.spinnerAction('off');
          this.memoryLinks[index].note = newValue
        }
      )
    
    }
  }

  onChangeEtylinkType(index, evt){
    console.log(index, evt.target.value)
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    let selectedValues, etymId;
    selectedValues = evt.target.value;
    
    if (this.object.etymology.etymologyInstanceName != undefined) {
      etymId = this.object.etyLinks[index].etymologicalLinkInstanceName;
    }

    if(selectedValues != null){
      
      //let oldValue = this.memoryLinks[index].etySource;
      let parameters = {
        relation: "etyLinkType",
        value: selectedValues,
      }
      console.log(parameters)
      this.lexicalService.updateEtylink(etymId, parameters).subscribe(
        data => {
          console.log(data)
        }, error => {
          console.log(error)
          if(error.statusText == 'OK'){
            //TODO: inserire update lexical entry
            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          }
        }
        )
      
    }
  }

  onChangeEtylink(etyLink, index) {
    console.log(etyLink.selectedItems)
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    let selectedValues, etymId, etySourceLabel, instanceName;
    if(etyLink.selectedItems != undefined){
      if (etyLink.selectedItems.length != 0) {
        selectedValues = etyLink.selectedItems[0].value.lexicalEntryInstanceName;
        etySourceLabel = etyLink.selectedItems[0].value.label;
        instanceName = etyLink.selectedItems[0].value.lexicalEntry;
      }
    }else if(etyLink != ""){
      selectedValues = etyLink;
      etySourceLabel = '';
      instanceName = etyLink;
    }
    
    console.log(index);
    console.log(this.object.etyLinks[index])
    if (this.object.etymology.etymologyInstanceName != undefined) {
      etymId = this.object.etyLinks[index].etymologicalLinkInstanceName;
    }

    if(selectedValues != null){
      
      let oldValue = this.memoryLinks[index].etySource;
      let parameters = {
        type: "etyLink",
        relation: "etySource",
        value: selectedValues,
        currentValue: oldValue
      }

      console.log(parameters)
      this.lexicalService.updateLinguisticRelation(etymId, parameters).subscribe(
        data => {
          console.log(data)
        }, error => {
          console.log(error)
          if(error.statusText == 'OK'){
            /* this.memoryLinks[index]['etySourceLabel'] = ; */
            this.etyLinkArray.at(index).patchValue({ label: etySourceLabel});
            this.etyLinkArray.at(index).patchValue({ etySource: instanceName});
            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
          }
        }
      )
      
    }
    

  }

  addCognate() {
    this.cognatesArray = this.etyForm.get('cognates') as FormArray;
    this.cognatesArray.push(this.createCognate());
    
  }

  debounceEtylinkLabel(evt, index){
    this.lexicalService.spinnerAction('on');
    this.etylink_label_subject.next({ evt, index})
  }

  debounceEtylinkNote(evt, index) {
    this.lexicalService.spinnerAction('on');
    this.etylink_note_subject.next({ evt, index})
  }

  addEtyLink(le?, l?, elt?, es?, et?, n?, el?){
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    this.etyLinkArray.push(this.createEtyLink(le, l, elt, es, et, n, el));
  }

  addNewEtyLink() { 
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    this.etyLinkArray.push(this.createEtyLink());
    let index = this.etyLinkArray.length -1;

    let etyId = this.object.etymology.etymologyInstanceName;
    let lexId = this.object.parentNodeInstanceName;

    console.log(etyId, lexId)

    this.lexicalService.createNewEtylink(lexId, etyId).subscribe(
      data=>{
        console.log(data);
        if(data!=null){
          let etyTarget = data['etyTarget']
          let etyType = data['etyLinkType']
          this.etyLinkArray.at(index).patchValue({ etyTarget: etyTarget});
          this.etyLinkArray.at(index).patchValue({ etyLinkType: etyType});
          this.object.etyLinks[index] = data;
          this.memoryLinks[index] = data;
        }
      },error=>{
        console.log(error)
      }
    )
  }

  removeEtyLink(index){
    this.etyLinkArray = this.etyForm.get('etylink') as FormArray;
    let etyLinkId = this.memoryLinks[index]['etymologicalLinkInstanceName']
    this.lexicalService.deleteEtylink(etyLinkId).subscribe(
      data =>{
        console.log(data)
        //this.lexicalService.updateLexCard(this.object)
      },
      error =>{
        console.log(error)
        //this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
      }
    )
    this.etyLinkArray.removeAt(index);
    this.memoryLinks.splice(index, 1)
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

  createEtyLink(le?, l?, elt?, es?, et?, n?, el?) {
    if(le!= undefined){
      return this.formBuilder.group({
        lex_entity: new FormControl(le),
        label: new FormControl(l),
        etyLinkType: new FormControl(elt),
        etySource : new FormControl(es),
        etyTarget : new FormControl(et),
        note: new FormControl(n),
        external_iri : new FormControl(el)
      })
    }else{
      return this.formBuilder.group({
        lex_entity: new FormControl(null),
        label: new FormControl(null),
        etyLinkType: new FormControl(null),
        etySource : new FormControl(null),
        etyTarget : new FormControl(null),
        note : new FormControl(null),
        external_iri : new FormControl(null)
      })
    }
    
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

  triggerEtylink(evt) {
    if (evt.target != undefined) {
      this.subject_cognates.next(evt.target.value)
    }
  }

  triggerEtylinkInput(evt, i) {
    if (evt.target != undefined) {
      let value = evt.target.value;
      this.subject_etylink_input.next({ value, i })
    }
  }

  deleteData() {
    this.searchResults = [];
  }

  onSearchFilter(data) {
    console.log(data)
    this.filterLoading = true;
    this.searchResults = [];
    let parameters = {
      text: data,
      searchMode: "startsWith",
      type: "etymon",
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
    

  }

}
