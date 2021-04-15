import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService, Person } from '../../lexicon-panel/text-detail/edit-detail/core-tab/core-form/data.service';

@Component({
  selector: 'app-see-also',
  templateUrl: './see-also.component.html',
  styleUrls: ['./see-also.component.scss']
})
export class SeeAlsoComponent implements OnInit {

  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;

  constructor(private dataService: DataService) {
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
