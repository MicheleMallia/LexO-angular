import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frame-tab',
  templateUrl: './frame-tab.component.html',
  styleUrls: ['./frame-tab.component.scss']
})
export class FrameTabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover click',
        delay: {"hide" : 1000}
      });
    }, 1000);
  }

}
