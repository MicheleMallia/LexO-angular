import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-tab',
  templateUrl: './form-tab.component.html',
  styleUrls: ['./form-tab.component.scss']
})
export class FormTabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'click'
      });
    }, 1000);
  }

}
