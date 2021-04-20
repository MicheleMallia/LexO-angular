import { Component, OnInit } from '@angular/core';
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

    constructor(private dataService: DataService, private lexicalService : LexicalEntriesService) {
    }

    ngOnInit() {
        this.loadPeople();
        this.lexicalService.coreData$.subscribe(
            object => this.object = object
        );
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }

}
