import { Component, ComponentFactoryResolver, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { DataService, Person } from '../../core-tab/core-form/data.service';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-vartrans-form',
  templateUrl: './vartrans-form.component.html',
  styleUrls: ['./vartrans-form.component.scss']
})
export class VartransFormComponent implements OnInit {

  switchInput = false;
  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;
  counter = 0;
  componentRef : any;



  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService) {
  }

  ngOnInit() {
    this.loadPeople();
    this.lexicalService.coreData$.subscribe(
      object => {
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

  
}
