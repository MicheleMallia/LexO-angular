import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataService, Person } from './data.service';
import { LexicalEntriesService } from '../../../../../../services/lexical-entries/lexical-entries.service';
import { Subscription } from 'rxjs';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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

    emptyLabelFlag = false;

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
                
                for(var i = 0; i < this.object.morphology.length; i++){
                    const trait = this.object.morphology[i]['trait'];
                    const value = this.object.morphology[i]['value'];
                    this.addMorphoTraits(trait, value);
                }
    
                this.coreForm.get('denotes').setValue('prova', {emitEvent: false})
            }
        }, 10)
        
    }

    onChanges(): void {
        /* this.coreForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
            console.log(searchParams)
        }) */

        this.coreForm.get("label").valueChanges.pipe(debounceTime(1000)).subscribe(
            updatedLabel => {
                if(updatedLabel.length > 2){
                    this.emptyLabelFlag = false;
                    this.lexicalService.spinnerAction('on');
                    let lexId = this.object.lexicalEntryInstanceName;
                    this.lexicalService.updateLexicalEntryLabel(lexId, updatedLabel).subscribe(
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
    }

    createMorphoTraits(t?, v?): FormGroup {
        if(t != undefined){
            return this.formBuilder.group({
                trait: t,
                value: v
            })
        }else {
            return this.formBuilder.group({
                trait: '',
                value: ''
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
