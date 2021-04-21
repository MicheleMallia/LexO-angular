import { Component, ElementRef, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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

    @ViewChild('viewContainer', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
    @ViewChild('morpho_template') template: TemplateRef<any>;

    constructor(private dataService: DataService, private lexicalService : LexicalEntriesService, private renderer : Renderer2) {
    }

    ngOnInit() {
        this.loadPeople();
        this.lexicalService.coreData$.subscribe(
            object => {
                if (this.object != object) {
                    if(this.viewContainer != undefined){
                        this.viewContainer.clear();
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
        const template = this.template.createEmbeddedView(null);
        this.viewContainer.insert(template);
    }

    deleteMorphoTrait(evt){
        const ancestor = evt.target.parentNode.parentNode.parentNode;    
        this.renderer.removeChild(this.viewContainer, ancestor)
    }
}
