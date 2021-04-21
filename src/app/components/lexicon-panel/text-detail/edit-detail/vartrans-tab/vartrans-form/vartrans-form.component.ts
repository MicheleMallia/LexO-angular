import { Component, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { DataService, Person } from '../../core-tab/core-form/data.service';

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

  @ViewChild('translation_container', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
  @ViewChild('translation_template') template: TemplateRef<any>;


  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.loadPeople();
    this.lexicalService.coreData$.subscribe(
      object => {
        if (this.object != object) {
          this.viewContainer.clear();
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

  addTranslatableAs() {
    const template = this.template.createEmbeddedView(null);
    this.viewContainer.insert(template);
  }

  deleteTranslatableAs(evt) {
    const ancestor = evt.target.parentNode.parentNode.parentNode;    
    this.renderer.removeChild(this.viewContainer, ancestor)
  }

}
