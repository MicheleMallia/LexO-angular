import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataService, Person } from './data.service';
import { LexicalEntriesService } from '../../../../../../services/lexical-entries/lexical-entries.service';
import { Subject, Subscription } from 'rxjs';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators, Form } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';


@Component({
    selector: 'app-lexical-entry-core-form',
    templateUrl: './lexical-entry-core-form.component.html',
    styleUrls: ['./lexical-entry-core-form.component.scss']
})
export class LexicalEntryCoreFormComponent implements OnInit {

    @Input() lexData: any;

    switchInput = false;
    subscription: Subscription;
    object: any;
    people: Person[] = [];
    peopleLoading = false;
    counter = 0;
    lexEntryTypesData = [];
    morphologyData = [];
    valueTraits = [];
    memoryTraits = [];
    memoryValues = [];
    languages = [];

    memoryDenotes = [];
    memoryEvokes = [];

    valuePos = [];
    memoryPos = '';

    private denotes_subject: Subject<any> = new Subject();
    private evokes_subject: Subject<any> = new Subject();

    /* public urlRegex = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi */ 
    public urlRegex = /(^|\s)((https?:\/\/.+))/;

    emptyLabelFlag = false;
    emptyFlag = false;

    coreForm = new FormGroup({
        label: new FormControl('', [Validators.required, Validators.minLength(3)]),
        type: new FormControl(''),
        language: new FormControl('', [Validators.required, Validators.minLength(0)]),
        pos: new FormControl('', [Validators.required, Validators.minLength(3)]),
        morphoTraits: new FormArray([this.createMorphoTraits()]),
        evokes: new FormArray([this.createEvokes()]),
        denotes: new FormArray([this.createDenotes()])
    })

    morphoTraits: FormArray;
    evokesArray: FormArray;
    denotesArray: FormArray;

    constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private formBuilder: FormBuilder) {

    }

    ngOnInit() {
        setTimeout(() => {
            //@ts-ignore
            $('.denotes-tooltip').tooltip({
                trigger: 'hover'
            });
        }, 1000);

        this.denotes_subject.pipe(debounceTime(1000)).subscribe(
            data => {
                this.onChangeDenotes(data)
            }
        )

        this.evokes_subject.pipe(debounceTime(1000)).subscribe(
            data => {
                this.onChangeEvokes(data)
            }
        )

        this.lexicalService.getLexiconLanguages().subscribe(
            data => {

                for (var i = 0; i < data.length; i++) {
                    this.languages.push(data[i])
                }
            }
        );

        this.loadMorphologyData();
        this.loadLexEntryTypeData();
        this.loadPeople();

        this.coreForm = this.formBuilder.group({
            label: '',
            type: '',
            language: '',
            pos: '',
            morphoTraits: this.formBuilder.array([]),
            evokes: this.formBuilder.array([this.createEvokes()]),
            denotes: this.formBuilder.array([this.createDenotes()])
        })

        this.onChanges();

    }


    loadLexEntryTypeData() {
        this.lexicalService.getLexEntryTypes().subscribe(
            data => {
                this.lexEntryTypesData = data;
            }
        )
    }

    loadMorphologyData() {
        this.lexicalService.getMorphologyData().subscribe(
            data => {
                this.morphologyData = data;
                /* console.log(this.morphologyData) */
                this.valuePos = this.morphologyData.filter( x => {
                    if(x.propertyId == 'partOfSpeech'){
                        return true;
                    }else{
                        return false;
                    }
                })

                this.valuePos = this.valuePos[0]['propertyValues'];
                /* console.log(this.valuePos) */
            }
        )
    }


    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            if (this.object != changes.lexData.currentValue) {
                this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
                this.morphoTraits.clear();

                this.denotesArray = this.coreForm.get('denotes') as FormArray;
                this.denotesArray.clear();

                this.evokesArray = this.coreForm.get('evokes') as FormArray;
                this.evokesArray.clear();

                this.memoryPos = '';
            }
            this.object = changes.lexData.currentValue;


            if (this.object != null) {
                const lexId = this.object.lexicalEntryInstanceName;
                this.coreForm.get('label').setValue(this.object.label, { emitEvent: false });
                this.coreForm.get('type').setValue(this.object.type, { emitEvent: false });
                this.coreForm.get('language').setValue(this.object.language, { emitEvent: false });
                this.coreForm.get('pos').setValue(this.object.pos, {emitEvent : false});

                this.memoryPos = this.object.pos;

                this.valueTraits = [];
                this.memoryTraits = [];
                this.memoryDenotes = [];
                this.memoryValues = [];

                for (var i = 0; i < this.object.morphology.length; i++) {
                    const trait = this.object.morphology[i]['trait'];
                    const value = this.object.morphology[i]['value'];
                    this.memoryValues[i] = value;
                    this.addMorphoTraits(trait, value);
                    this.onChangeTrait(trait, i);
                }

                this.lexicalService.getLexEntryLinguisticRelation(lexId, 'denotes').subscribe(
                    data => {
                        for (var i = 0; i < data.length; i++) {
                            let entity = data[i]['lexicalEntity'];
                            this.addDenotes(entity);
                            this.memoryDenotes.push(data[i])
                        }
                    }, error => {
                        console.log(error)
                    }
                )

                this.lexicalService.getLexEntryLinguisticRelation(lexId, 'evokes').subscribe(
                    data => {
                        for (var i = 0; i < data.length; i++) {
                            let entity = data[i]['lexicalEntity'];
                            this.addEvokes(entity);
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            }
        }, 10)

    }

    onChangeLanguage(evt) {
        
        this.lexicalService.spinnerAction('on');
        let langLabel = evt.target.value;
        let langValue;
        this.languages.forEach(element => {
            if(element['label'] == langLabel){
                langValue = element['label'];
                return;
            }
        });
        if(langValue != undefined){
            let lexId = this.object.lexicalEntryInstanceName;
            let parameters = {
                relation: 'language',
                value: langValue
            }
            console.log(parameters)
            this.lexicalService.updateLexicalEntry(lexId, parameters).subscribe(
                data => {
                    console.log(data)
                    this.lexicalService.spinnerAction('off');
                    this.lexicalService.refreshAfterEdit(data);
                }, error => {
                    console.log(error)
                    this.lexicalService.refreshAfterEdit({label: this.object.label});
                    this.lexicalService.spinnerAction('off');
                }
            )
        }else{
            this.lexicalService.spinnerAction('off');
        }
        
    }

    onChangePos(evt){
        this.lexicalService.spinnerAction('on');
        let posValue = evt.target.value;
        let lexId = this.object.lexicalEntryInstanceName;
        if(posValue != ''){
            let parameters;
            if(this.memoryPos == ''){
            
                parameters = {
                    type: "morphology",
                    relation: 'partOfSpeech',
                    value: posValue
                }
            
            }else{
                parameters = {
                    type: "morphology",
                    relation: 'partOfSpeech',
                    value: posValue,
                    currentValue : this.memoryPos
                }
            }

            this.lexicalService.updateLinguisticRelation(lexId, parameters).pipe(debounceTime(1000)).subscribe(
                data => {
                    console.log(data)
                    this.lexicalService.spinnerAction('off');
                    this.lexicalService.refreshAfterEdit(data);
                },
                error => {
                    console.log(error)
                    this.lexicalService.spinnerAction('off');
                    this.lexicalService.refreshAfterEdit({label: this.object.label});
                }
            )
        }
        
    }

    onChangeValue(i) {
        this.lexicalService.spinnerAction('on');
        this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
        const trait = this.morphoTraits.at(i).get('trait').value;
        const value = this.morphoTraits.at(i).get('value').value;
        if (trait != '' && value != '') {
            console.log("qua chiamo il servizio");
            let parameters;
            if(this.memoryValues[i] == ""){
                parameters = {
                    type: "morphology",
                    relation: trait,
                    value: value
                }
            }else{
                parameters = {
                    type: "morphology",
                    relation: trait,
                    value: value,
                    currentValue : this.memoryValues[i]
                }
            }
            
            let lexId = this.object.lexicalEntryInstanceName;

            this.lexicalService.updateLinguisticRelation(lexId, parameters).pipe(debounceTime(1000)).subscribe(
                data => {
                    console.log(data)
                    this.lexicalService.refreshAfterEdit(data);
                    this.lexicalService.spinnerAction('off');
                },
                error => {
                    console.log(error)
                    this.lexicalService.refreshAfterEdit({label: this.object.label});
                    this.lexicalService.spinnerAction('off');
                }
            )
        } else {
            this.lexicalService.spinnerAction('off');
        }
    }

    onChangeTrait(evt, i) {

        if (evt.target != undefined) {
            setTimeout(() => {
                this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
                this.morphoTraits.at(i).patchValue({ trait: evt.target.value, value: "" });
                if (evt.target.value != '') {
                    var arrayValues = this.morphologyData.filter(x => {
                        return x['propertyId'] == evt.target.value;
                    })['0']['propertyValues'];
                    this.valueTraits[i] = arrayValues;
                    this.memoryTraits[i] = evt.target.value;
                    this.memoryValues[i] = "";
                } else {
                    this.memoryValues.splice(i, 1);
                    var arrayValues = [];
                    this.valueTraits[i] = arrayValues
                    this.memoryTraits.splice(i, 1)
                }
            }, 250);
        } else {

            setTimeout(() => {

                var arrayValues = this.morphologyData.filter(x => {
                    return x['propertyId'] == evt;
                })['0']['propertyValues'];
                this.valueTraits[i] = arrayValues;
                this.memoryTraits.push(evt);
            }, 350);
        }
    }


    onChanges(): void {

        this.coreForm.get("label").valueChanges.pipe(debounceTime(1000)).subscribe(
            updatedLabel => {
                if (updatedLabel.length > 2) {
                    this.emptyLabelFlag = false;
                    this.lexicalService.spinnerAction('on');
                    let lexId = this.object.lexicalEntryInstanceName;
                    let parameters = {
                        relation: 'label',
                        value: updatedLabel
                    }
                    this.lexicalService.updateLexicalEntry(lexId, parameters).subscribe(
                        data => {
                            console.log(data);
                            this.lexicalService.refreshAfterEdit(data);
                            this.lexicalService.spinnerAction('off');
                        },
                        error => {
                            console.log(error);
                            this.lexicalService.refreshAfterEdit({label: updatedLabel});
                            this.lexicalService.spinnerAction('off');
                        }
                    )
                } else if (updatedLabel.length < 3) {
                    console.log(this.coreForm.controls)
                    this.emptyLabelFlag = true;
                }
            }
        )

        this.coreForm.get("type").valueChanges.pipe(debounceTime(200)).subscribe(
            data => {
                this.lexicalService.spinnerAction('on');
                let lexId = this.object.lexicalEntryInstanceName;
                let parameters = {
                    relation: 'type',
                    value: data
                }
                this.lexicalService.updateLexicalEntry(lexId, parameters).subscribe(
                    data => {
                        console.log(data);
                        this.lexicalService.spinnerAction('off');
                        this.lexicalService.refreshAfterEdit(data);
                    },
                    error => {
                        console.log(error);
                        this.lexicalService.refreshAfterEdit({label: this.object.label});
                        this.lexicalService.spinnerAction('off');
                    }
                )
            }
        )
    }

    createMorphoTraits(t?, v?): FormGroup {
        if (t != undefined) {
            return this.formBuilder.group({
                trait: new FormControl(t, [Validators.required, Validators.minLength(0)]),
                value: new FormControl(v, [Validators.required, Validators.minLength(0)])
            })
        } else {
            return this.formBuilder.group({
                trait: new FormControl('', [Validators.required, Validators.minLength(0)]),
                value: new FormControl('', [Validators.required, Validators.minLength(0)])
            })
        }
    }

    createEvokes(e?): FormGroup {

        if (e != undefined) {
            return this.formBuilder.group({
                entity: new FormControl(e, [Validators.required, Validators.pattern(this.urlRegex)])
            })
        } else {
            return this.formBuilder.group({
                entity: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)])
            })
        }
    }

    createDenotes(e?): FormGroup {
        if (e != undefined) {
            return this.formBuilder.group({
                entity: new FormControl(e, [Validators.required, Validators.pattern(this.urlRegex)])
            })
        } else {
            return this.formBuilder.group({
                entity: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)])
            })
        }

    }

    handleDenotes(evt, i) {

        if (evt instanceof NgSelectComponent) {
            if (evt.selectedItems.length > 0) {
                let label = evt.selectedItems[0].label
                this.onChangeDenotes({ name: label, i: i })
            }
        } else {
            let label = evt.target.value;
            this.denotes_subject.next({ name: label, i: i })
        }
    }

    getEvokesValid(i) {
        this.evokesArray = this.coreForm.get("evokes") as FormArray;
        let value = this.evokesArray.at(i).get('entity').value;
        if (value != '') {
            return (value.match(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi).length > 0);
        } else {
            return false;
        }
    }

    getDenotesValid(i) {
        this.denotesArray = this.coreForm.get("denotes") as FormArray;
        let value = this.denotesArray.at(i).get('entity').value;
        if (value != '') {
            return (value.match(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi).length > 0);
        } else {
            return false;
        }
    }

    onChangeDenotes(data) {
        var index = data['i'];
        this.denotesArray = this.coreForm.get("denotes") as FormArray;
        let isValid = this.denotesArray.at(index).get('entity').valid
        if (isValid) {
            if (this.memoryDenotes[index] == undefined) {
                //TODO il denotes è nuovo di zecca
                const newValue = data['name']
                const parameters = {
                    type: "conceptRef",
                    relation: "denotes",
                    value: newValue
                }
                let lexId = this.object.lexicalEntryInstanceName;
                this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
                    data => {
                        console.log(data);
                        this.lexicalService.spinnerAction('off');
                        this.lexicalService.refreshAfterEdit(data);
                    }, error => {
                        console.log(error)
                        this.lexicalService.refreshAfterEdit({label: this.object.label});
                        this.lexicalService.spinnerAction('off');
                    }
                )
                this.memoryDenotes[index] = data;


            } else {
                //TODO c'era già qualche altro valore
                const oldValue = this.memoryDenotes[index]['lexicalEntity']
                const newValue = data['name']
                const parameters = {
                    type: "conceptRef",
                    relation: "denotes",
                    value: newValue,
                    currentValue: oldValue
                }
                console.log(parameters)
                let lexId = this.object.lexicalEntryInstanceName;
                this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
                    data => {
                        console.log(data);
                        this.lexicalService.spinnerAction('off');
                        this.lexicalService.refreshAfterEdit(data);
                    }, error => {
                        console.log(error)
                        this.lexicalService.refreshAfterEdit({label: this.object.label});
                        this.lexicalService.spinnerAction('off');
                    }
                )
                this.memoryDenotes[index] = data;
            }
        }

    }

    handleEvokes(evt, i) {

        if (evt instanceof NgSelectComponent) {
            if (evt.selectedItems.length > 0) {
                let label = evt.selectedItems[0].label
                this.onChangeDenotes({ name: label, i: i })
            }
        } else {
            let label = evt.target.value;
            this.evokes_subject.next({ name: label, i: i })
        }

    }

    onChangeEvokes(data) {
        var index = data['i']
        this.evokesArray = this.coreForm.get("evokes") as FormArray;
        let isValid = this.evokesArray.at(index).get('entity').valid
        if (isValid) {
            console.log(data)
            if (this.memoryEvokes[index] == undefined) {
                //TODO il denotes è nuovo di zecca
                const newValue = data['name']
                const parameters = {
                    type: "conceptRef",
                    relation: "evokes",
                    value: newValue
                }
                let lexId = this.object.lexicalEntryInstanceName;
                console.log(parameters)
                this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
                    data => {
                        console.log(data);
                        this.lexicalService.spinnerAction('off');
                        this.lexicalService.refreshAfterEdit(data);
                    }, error => {
                        console.log(error)
                        this.lexicalService.refreshAfterEdit({label: this.object.label});
                        this.lexicalService.spinnerAction('off');
                    }
                )
                this.memoryEvokes[index] = data;


            } else {
                //TODO c'era già qualche altro valore
                console.log("c'era qualcos'altro")
                const oldValue = this.memoryEvokes[index]['lexicalEntity']
                const newValue = data['name']
                const parameters = {
                    type: "conceptRef",
                    relation: "evokes",
                    value: newValue,
                    currentValue: oldValue
                }
                let lexId = this.object.lexicalEntryInstanceName;
                this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
                    data => {
                        console.log(data);
                        this.lexicalService.spinnerAction('off');
                        this.lexicalService.refreshAfterEdit(data);
                    }, error => {
                        console.log(error)
                        this.lexicalService.refreshAfterEdit({label: this.object.label});
                        this.lexicalService.spinnerAction('off');
                    }
                )
                this.memoryEvokes[index] = data;
            }
        }

    }

    addDenotes(e?) {
        this.denotesArray = this.coreForm.get("denotes") as FormArray;
        if (e != undefined) {
            this.denotesArray.push(this.createDenotes(e));
        } else {
            this.denotesArray.push(this.createDenotes());
        }

    }

    removeEvokes(index) {
        this.evokesArray = this.coreForm.get('evokes') as FormArray;
        this.evokesArray.removeAt(index);
    }

    addEvokes(e?) {
        this.evokesArray = this.coreForm.get("evokes") as FormArray;
        if (e != undefined) {
            this.evokesArray.push(this.createEvokes(e));
        } else {
            this.evokesArray.push(this.createEvokes());
        }
    }

    addMorphoTraits(t?, v?) {
        this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
        if (t != undefined) {
            this.morphoTraits.push(this.createMorphoTraits(t, v));
        } else {
            this.morphoTraits.push(this.createMorphoTraits());
        }
    }

    removeElement(index) {
        this.memoryTraits.splice(index, 1);
        this.valueTraits.splice(index, 1)
        this.morphoTraits = this.coreForm.get('morphoTraits') as FormArray;
        
        const trait = this.morphoTraits.at(index).get('trait').value;
        const value = this.morphoTraits.at(index).get('value').value;

        console.log(trait + value)

        if(trait != ''){

            let lexId = this.object.lexicalEntryInstanceName;

            let parameters = {
                type: 'morphology',
                relation : trait,
                value : value
            }

            this.lexicalService.deleteLinguisticRelation(lexId, parameters).subscribe(
                data => {
                    console.log(data)
                    //TODO: inserire updater per card last update
                    this.lexicalService.updateLexCard(this.object)
                },error=>{
                    console.log(error)
                }
            )
        }
        

        this.morphoTraits.removeAt(index);
    }

    removeDenotes(index) {
        this.denotesArray = this.coreForm.get('denotes') as FormArray;
        this.denotesArray.removeAt(index);

        this.memoryDenotes.splice(index, 1)
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }
}
