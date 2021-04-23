import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataService, Person } from './data.service';
import { LexicalEntriesService } from '../../../../../../services/lexical-entries.service';
import { Subscription } from 'rxjs';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


@Component({
    selector: 'app-core-form',
    templateUrl: './core-form.component.html',
    styleUrls: ['./core-form.component.scss']
})
export class CoreFormComponent implements OnInit {

    switchInput = false;
    subscription: Subscription;
    object: any;
    people: Person[] = [];
    peopleLoading = false;
    counter = 0;

    coreForm = new FormGroup({
        label: new FormControl(''),
        type: new FormControl(''),
        language: new FormControl(''),
        morphoTraits: new FormArray([this.createMorphoTraits()]),
        denotes : new FormControl('')
    })

    morphoTraits: FormArray;

    constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private renderer: Renderer2, private formBuilder: FormBuilder) {

    }

    ngOnInit() {
        this.loadPeople();

        this.coreForm = this.formBuilder.group({
            label: '',
            type: '',
            language: '',
            pos: '',
            morphoTraits: this.formBuilder.array([]),
            denotes : ''
        })

        this.onChanges();

        this.lexicalService.coreData$.subscribe(
            object => {
                if(this.object != object){
                    this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
                    this.morphoTraits.clear();
                }
                this.object = object;
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
            }
        );
    }

    onChanges(): void {
        this.coreForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
            console.log(searchParams)
        })
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

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }
}
