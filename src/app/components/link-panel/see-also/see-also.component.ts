import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataService, Person } from '../../lexicon-panel/text-detail/edit-detail/core-tab/lexical-entry-core-form/data.service';

@Component({
  selector: 'app-see-also',
  templateUrl: './see-also.component.html',
  styleUrls: ['./see-also.component.scss']
})
export class SeeAlsoComponent implements OnInit {

  @Input() seeAlsoData: any[] | any;

  subscription: Subscription;
  object: any;
  people: Person[] = [];
  peopleLoading = false;

  seeAlsoForm = new FormGroup({
    seeAlsoArray: new FormArray([this.createSeeAlsoEntry()])
  })

  seeAlsoArray: FormArray;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.seeAlsoForm = this.formBuilder.group({
      seeAlsoArray: this.formBuilder.array([])
    })
    this.addSeeAlsoEntry()
    this.onChanges();
    console.log(this.seeAlsoForm)
    this.loadPeople();
    this.triggerTooltip();
  }

  triggerTooltip() {
    setTimeout(() => {
      //@ts-ignore
      $('.see-also-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.seeAlsoData);
  }

  onChanges(): void {
    this.seeAlsoForm.valueChanges.pipe(debounceTime(200)).subscribe(searchParams => {
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

  createSeeAlsoEntry() {
    return this.formBuilder.group({
      entity: 'prova'
    })
  }

  addSeeAlsoEntry() {
    this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;
    this.seeAlsoArray.push(this.createSeeAlsoEntry());
    this.triggerTooltip();
  }

  removeElement(index) {
    this.seeAlsoArray = this.seeAlsoForm.get('seeAlsoArray') as FormArray;
    this.seeAlsoArray.removeAt(index);
  }

}
