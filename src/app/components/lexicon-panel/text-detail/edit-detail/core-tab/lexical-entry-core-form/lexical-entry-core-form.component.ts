import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataService, Person } from './data.service';
import { LexicalEntriesService } from '../../../../../../services/lexical-entries/lexical-entries.service';
import { Subscription } from 'rxjs';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators, Form } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


@Component({
    selector: 'app-lexical-entry-core-form',
    templateUrl: './lexical-entry-core-form.component.html',
    styleUrls: ['./lexical-entry-core-form.component.scss']
})
export class LexicalEntryCoreFormComponent implements OnInit {

    @Input() lexData : any;

    switchInput = false;
    subscription: Subscription;
    object: any;
    people: Person[] = [];
    peopleLoading = false;
    counter = 0;
    morphologyData = [];
    valueTraits = [];
    memoryTraits = [];

    emptyLabelFlag = false;
    emptyFlag = false;

    coreForm = new FormGroup({
        label: new FormControl('', [Validators.required, Validators.minLength(3)]),
        type: new FormControl(''),
        language: new FormControl(''),
        morphoTraits: new FormArray([this.createMorphoTraits()]),
        evokes : new FormArray([this.createEvokes()]),
        denotes : new FormControl('')
    })

    morphoTraits: FormArray;
    evokesArray : FormArray;

    constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) {

    }

    ngOnInit() {
        setTimeout(() => {
            //@ts-ignore
            $('.denotes-tooltip').tooltip({
              trigger : 'hover'
            });
        }, 1000);
        
        this.loadMorphologyData();
        this.loadPeople();

        this.coreForm = this.formBuilder.group({
            label: '',
            type: '',
            language: '',
            pos: '',
            morphoTraits: this.formBuilder.array([]),
            evokes : this.formBuilder.array([]),
            denotes : ''
        })

        this.onChanges();

    }

    loadMorphologyData(){
        this.lexicalService.getMorphologyData().subscribe(
            data => {
                this.morphologyData = data;
                console.log(this.morphologyData)
            }
        )
    }


    ngOnChanges(changes: SimpleChanges) {
        setTimeout(()=> {
            if(this.object != changes.lexData.currentValue){
                this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
                this.morphoTraits.clear();
                if(this.coreForm.get('denotes') == null){
                    this.coreForm.addControl('denotes', new FormControl(''))
                }
            }
            this.object = changes.lexData.currentValue;
            
            if(this.object != null){
                this.coreForm.get('label').setValue(this.object.label, {emitEvent:false});
                this.coreForm.get('type').setValue(this.object.type, {emitEvent:false});
                this.coreForm.get('language').setValue(this.object.language, {emitEvent:false});
                this.coreForm.get('pos').setValue(this.object.pos);
                
                this.valueTraits = [];
                this.memoryTraits = [];
                
                for(var i = 0; i < this.object.morphology.length; i++){
                    const trait = this.object.morphology[i]['trait'];
                    const value = this.object.morphology[i]['value'];
                    this.addMorphoTraits(trait, value);
                    this.onChangeTrait(trait, i);                    
                }

                this.coreForm.get('denotes').setValue('prova', {emitEvent: false})
            }
        }, 10)
        
    }

    onChangeValue(evt, i){
        this.lexicalService.spinnerAction('on');
        this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
        const trait = this.morphoTraits.at(i).get('trait').value;
        const value = this.morphoTraits.at(i).get('value').value;
        if(trait != '' && value != ''){
            console.log("qua chiamo il servizio");
            let parameters = {
                type : "morphology",
                relation : trait,
                value : value
            }
            let lexId = this.object.lexicalEntryInstanceName;
            this.lexicalService.updateLinguisticRelation(lexId, parameters).pipe(debounceTime(1000)).subscribe(
                data => {
                    console.log(data)
                    this.lexicalService.spinnerAction('off');
                    this.lexicalService.refreshLexEntryTree();
                    this.lexicalService.updateLexCard(this.object)
                },
                error => {
                    console.log(error)
                    this.lexicalService.refreshLexEntryTree();
                    this.lexicalService.updateLexCard({lastUpdate : error.error.text})
                    this.lexicalService.spinnerAction('off');
                }
            )
        }else {
            this.lexicalService.spinnerAction('off');
        }
    }

    onChangeTrait(evt, i){
        
        if(evt.target != undefined){
            setTimeout(() => {
                this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
                this.morphoTraits.at(i).patchValue({trait : evt.target.value, value: ""});
                console.log(evt.target.value)
                if(evt.target.value  != ''){
                    var arrayValues = this.morphologyData.filter(x => {
                        return x['propertyId'] == evt.target.value;
                    })['0']['propertyValues'];
                    this.valueTraits[i] = arrayValues;
                    this.memoryTraits[i] = evt.target.value;
                }else {
                    var arrayValues = [];
                    this.valueTraits[i] = arrayValues
                    this.memoryTraits.splice(i, 1)
                }
                
                
                
            }, 250);
        }else{
            
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
    

    onChanges(): void {
       
        this.coreForm.get("label").valueChanges.pipe(debounceTime(1000)).subscribe(
            updatedLabel => {
                if(updatedLabel.length > 2){
                    this.emptyLabelFlag = false;
                    this.lexicalService.spinnerAction('on');
                    let lexId = this.object.lexicalEntryInstanceName;
                    let parameters = {
                        relation : 'label',
                        value : updatedLabel
                    }
                    this.lexicalService.updateLexicalEntry(lexId, parameters).subscribe(
                        data => {
                            console.log(data);
                            this.lexicalService.refreshLexEntryTree();
                            this.lexicalService.updateLexCard(this.object)
                            this.lexicalService.spinnerAction('off');
                        },
                        error => {
                            console.log(error);
                            this.lexicalService.refreshLexEntryTree();
                            this.lexicalService.updateLexCard({lastUpdate : error.error.text})
                            this.lexicalService.spinnerAction('off');
                        }
                    )
                }else if(updatedLabel.length < 3){
                    console.log(this.coreForm.controls)
                    this.emptyLabelFlag = true;
                }
            }
        )

        this.coreForm.get("morphoTraits").valueChanges.pipe(debounceTime(1000)).subscribe(
            data => {
                console.log(data)
            }
        )
    }

    createMorphoTraits(t?, v?): FormGroup {
        if(t != undefined){
            return this.formBuilder.group({
                trait: new FormControl(t, [Validators.required, Validators.minLength(0)]),
                value: new FormControl(v, [Validators.required, Validators.minLength(0)])
            })
        }else {
            return this.formBuilder.group({
                trait: new FormControl('', [Validators.required, Validators.minLength(0)]),
                value: new FormControl('', [Validators.required, Validators.minLength(0)])
            })
        }
    }

    createEvokes(): FormGroup {
        return this.formBuilder.group({
            entity: ''
        })
    }

    removeEvokes(index){
        this.evokesArray = this.coreForm.get('evokes') as FormArray;
        this.evokesArray.removeAt(index);
    }

    addEvokes(){
        this.evokesArray = this.coreForm.get('evokes') as FormArray;
        this.evokesArray.push(this.createEvokes());
    }

    addMorphoTraits(t?, v?) {
        this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
        if(t != undefined){
            this.morphoTraits.push(this.createMorphoTraits(t, v));
        }else {
            this.morphoTraits.push(this.createMorphoTraits());
        }
    }

    

    removeElement(index){
        this.memoryTraits.splice(index, 1);
        this.valueTraits.splice(index, 1)
        this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
        this.morphoTraits.removeAt(index);
    }

    removeDenotes(){
        console.log(this.coreForm.value)
        this.coreForm.removeControl('denotes');
        console.log(this.coreForm.value)
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }
}
