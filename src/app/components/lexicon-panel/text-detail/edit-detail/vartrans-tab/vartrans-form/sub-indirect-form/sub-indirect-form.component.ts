import { Component, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { VartransService } from 'src/app/services/vartrans.service';
import { DataService, Person } from '../../../core-tab/core-form/data.service';

@Component({
  selector: 'app-sub-indirect-form',
  templateUrl: './sub-indirect-form.component.html',
  styleUrls: ['./sub-indirect-form.component.scss']
})
export class SubIndirectFormComponent implements OnInit {
  
  @Input() counter: number;
  @Input() ancestor : number;
  @ViewChild('self', { read: ViewContainerRef }) self: ViewContainerRef;

  peopleLoading = false;
  people: Person[] = [];
  constructor(private dataService: DataService, private vartrans : VartransService, private renderer : Renderer2) { }

  ngOnInit(): void {
    this.peopleLoading = true;
    this.dataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });
  }

  destroySubRelation(evt){
    const ancestor = evt.target.parentNode.parentNode.parentNode;  
    this.renderer.removeChild(this.self, ancestor)
  }
}
