import { Component, OnInit } from '@angular/core';
import { DataService, Person } from './data.service';


@Component({
  selector: 'app-core-form',
  templateUrl: './core-form.component.html',
  styleUrls: ['./core-form.component.scss']
})
export class CoreFormComponent implements OnInit {

  switchInput = false;

  people: Person[] = [];
    peopleLoading = false;

    constructor(
        private dataService: DataService) {
    }

    ngOnInit() {
        this.loadPeople();
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }

}
