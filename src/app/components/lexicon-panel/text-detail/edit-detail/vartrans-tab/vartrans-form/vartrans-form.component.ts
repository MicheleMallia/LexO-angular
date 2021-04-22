import { Component, ComponentFactoryResolver, HostListener, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { VartransService } from 'src/app/services/vartrans.service';
import { DataService, Person } from '../../core-tab/core-form/data.service';

import { IndirectFormComponent } from './indirect-form/indirect-form.component'
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

  arrayContainer = [];

  @ViewChild('translation_container', { read: ViewContainerRef }) translation_container: ViewContainerRef;
  @ViewChild('translation_template') translation_template: TemplateRef<any>;

  @ViewChild('direct_relations_container', { read: ViewContainerRef }) direct_relations_container: ViewContainerRef;
  @ViewChild('direct_relations_template') direct_relations_template: TemplateRef<any>;

  @ViewChild('indirect_relation_container', { read: ViewContainerRef }) indirect_relation_container: ViewContainerRef;

  constructor(private dataService: DataService, private lexicalService: LexicalEntriesService, private renderer: Renderer2, private resolver: ComponentFactoryResolver, private vartrans : VartransService) {
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

    this.vartrans.destroy_relation$.subscribe(
      index => {
        if(index != null){
          this.destroyIndirectRelation(index);
        }
      }
    )
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.addIndirectRelation();
    }, 300)
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

  addIndirectRelation(){
    
    const factory = this.resolver.resolveComponentFactory(IndirectFormComponent);
    const componentRef = this.indirect_relation_container.createComponent(factory);
    componentRef.instance.counter = this.counter;
    this.counter++;
    this.arrayContainer.push(componentRef);
  }


  destroyIndirectRelation(index){
    console.log(this.arrayContainer);
    console.log(index)
    if(this.arrayContainer.length != 0){
      this.arrayContainer[index].destroy();
      this.arrayContainer[index] = null;
    }
  }
}
