import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { VartransService } from 'src/app/services/vartrans.service';
import { DataService, Person } from '../../../core-tab/core-form/data.service';

import { SubIndirectFormComponent } from '../sub-indirect-form/sub-indirect-form.component'

@Component({
  selector: 'app-indirect-form',
  templateUrl: './indirect-form.component.html',
  styleUrls: ['./indirect-form.component.scss']
})
export class IndirectFormComponent implements OnInit {

  @ViewChild('sub_indirect_relation_container', { read: ViewContainerRef }) sub_indirect_relation_container: ViewContainerRef;

  @Input() counter: number;
  @Output() messageEvent = new EventEmitter<string>();

  peopleLoading = false;
  people: Person[] = [];
  counter_due = 0;

  subArray = [];

  constructor(private dataService: DataService, private resolver: ComponentFactoryResolver, private vartrans : VartransService) { }

  ngOnInit(): void {
    this.peopleLoading = true;
    this.dataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.addSubIndirectRelation();
    }, 300)
  }

  addSubIndirectRelation(){
    const factory = this.resolver.resolveComponentFactory(SubIndirectFormComponent);
    const componentRef = this.sub_indirect_relation_container.createComponent(factory);
    componentRef.instance.counter = this.counter_due;
    componentRef.instance.ancestor = this.counter;
    this.subArray.push(componentRef)
    this.counter_due++;
  }

  destroyRelation(){
    
    for(var i = 0; i < this.subArray.length; i++){
      this.subArray[i].destroy();
    }
    this.vartrans.destroyRelation(this.counter);
  }

  destroySubRelation(index){
    if(this.subArray.length != 0){
      this.subArray[index].destroy();
      this.subArray[index] = null;
    }
  }

}
