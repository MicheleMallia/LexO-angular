import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-tab',
  templateUrl: './core-tab.component.html',
  styleUrls: ['./core-tab.component.scss']
})
export class CoreTabComponent implements OnInit {

  lock = false;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
      });
    }, 10);
  }

}
