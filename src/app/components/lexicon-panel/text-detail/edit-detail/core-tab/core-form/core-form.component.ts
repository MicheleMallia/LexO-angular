import { Component, ElementRef, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DataService, Person } from './data.service';
import { LexicalEntriesService } from '../../../../../../services/lexical-entries.service';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-core-form',
    templateUrl: './core-form.component.html',
    styleUrls: ['./core-form.component.scss']
})
export class CoreFormComponent implements OnInit {

    switchInput = false;
    subscription: Subscription;
    object : any;
    people: Person[] = [];
    peopleLoading = false;
    counter = 0;
    childArray = [];

    @ViewChild('morpho_container') morphoContainer : ElementRef;


    constructor(private dataService: DataService, private lexicalService : LexicalEntriesService, private renderer : Renderer2) {
    }

    ngOnInit() {
        this.loadPeople();
        this.lexicalService.coreData$.subscribe(
            object => {
                if(this.object != object){
                    this.counter = 0;
                    for(var i = 0; i < this.childArray.length; i++){
                        this.renderer.removeChild(this.morphoContainer.nativeElement, this.childArray[i])
                    }
                }
                this.object = object
            }
        );
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }

    addMorphoTrait(){
        const morphoHtmlModel = '<div class="d-flex my-2"> <div class="col-md-4"> <select class="form-control selectTrait" style="font-size: 12px;"> <option>'+this.counter+'</option> </select> </div> <div class="input-group col-md-7"> <select class="form-control selectTrait" style="font-size:12px;"> <option>Valori tratti Morfologici</option> </select> <div class="input-group-append ml-2"> <button class="btn btn-danger morpho-remover_'+this.counter +'" type="button" (click)="deleteMorphoTrait($event)" style="font-size: 12px; border-radius: .25rem;"><i class="fa fa-trash-alt" style="pointer-events:none"></i></button> </div> </div> </div>';
        this.morphoContainer.nativeElement.insertAdjacentHTML('beforeend', morphoHtmlModel);
        const children = this.morphoContainer.nativeElement.children[this.morphoContainer.nativeElement.children.length-1]
        this.childArray.push(children);
        this.morphoContainer.nativeElement.querySelector('.morpho-remover_'+this.counter+'').addEventListener('click', this.deleteMorphoTrait.bind(this))
        this.counter++;
    }

    deleteMorphoTrait(evt){

        const ancestor = evt.target.parentNode.parentNode.parentNode;
        this.renderer.removeChild(this.morphoContainer.nativeElement, ancestor)

    }
}
