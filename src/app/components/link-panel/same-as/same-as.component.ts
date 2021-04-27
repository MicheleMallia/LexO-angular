import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataService, Person } from '../../lexicon-panel/text-detail/edit-detail/core-tab/lexical-entry-core-form/data.service';

@Component({
  selector: 'app-same-as',
  templateUrl: './same-as.component.html',
  styleUrls: ['./same-as.component.scss']
})
export class SameAsComponent implements OnInit {

  @Input() sameAsData: any[] | any;

  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;

  sameAsForm = new FormGroup({
    sameAsArray: new FormArray([this.createSameAsEntry()])
  })

  sameAsArray: FormArray;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.sameAsForm = this.formBuilder.group({
      sameAsArray: this.formBuilder.array([])
    })
    this.addSameAsEntry()
    this.onChanges();
    console.log(this.sameAsForm)
    this.loadPeople();
    this.triggerTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.sameAsData);
  }

  onChanges(): void {
    this.sameAsForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
      console.log(searchParams)
    })
  }

  private loadPeople() {
    this.peopleLoading = true;
    this.dataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });
  }

  triggerTooltip() {
    setTimeout(() => {
      //@ts-ignore
      $('.same-as-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 500);
  }

  createSameAsEntry() {
    return this.formBuilder.group({
      entity: 'prova'
    })
  }

  addSameAsEntry() {
    this.sameAsArray = this.sameAsForm.get('sameAsArray') as FormArray;
    this.sameAsArray.push(this.createSameAsEntry());
    this.triggerTooltip();
  }

  removeElement(index) {
    this.sameAsArray = this.sameAsForm.get('sameAsArray') as FormArray;
    this.sameAsArray.removeAt(index);
  }

}
