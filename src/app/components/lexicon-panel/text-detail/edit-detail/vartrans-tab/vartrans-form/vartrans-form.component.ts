import { Component, HostListener, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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

  @ViewChild('translation_container', { read: ViewContainerRef }) translation_container: ViewContainerRef;
  @ViewChild('translation_template') translation_template: TemplateRef<any>;

  @ViewChild('direct_relations_container', { read: ViewContainerRef }) direct_relations_container: ViewContainerRef;
  @ViewChild('direct_relations_template') direct_relations_template: TemplateRef<any>;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.loadPeople();
    this.lexicalService.coreData$.subscribe(
      object => {
        if (this.object != object) {
          this.translation_container.clear();
          this.direct_relations_container.clear();
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
    const template = this.translation_template.createEmbeddedView(null);
    this.translation_container.insert(template);
  }

  deleteTranslatableAs(evt) {
    const ancestor = evt.target.parentNode.parentNode.parentNode;    
    this.renderer.removeChild(this.translation_container, ancestor)
  }

  addDirectLexicalRelation(){
    const template = this.direct_relations_template.createEmbeddedView(null);
    this.direct_relations_container.insert(template);
  }

  deleteDirectLexicalRelation(evt){
    const ancestor = evt.target.parentNode.parentNode.parentNode;    
    this.renderer.removeChild(this.direct_relations_container, ancestor)
  }

}
