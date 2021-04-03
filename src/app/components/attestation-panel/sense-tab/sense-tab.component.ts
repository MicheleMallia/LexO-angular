import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sense-tab',
  templateUrl: './sense-tab.component.html',
  styleUrls: ['./sense-tab.component.scss']
})
export class SenseTabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover',
        delay: {"hide" : 1000}
      });
    }, 1000);
  }

}
