import { Component, OnInit } from '@angular/core';
import { ExpanderService } from 'src/app/services/expander.service';

@Component({
  selector: 'app-epigraphy-detail',
  templateUrl: './epigraphy-detail.component.html',
  styleUrls: ['./epigraphy-detail.component.scss']
})
export class EpigraphyDetailComponent implements OnInit {

  constructor(private exp : ExpanderService) { }

  ngOnInit(): void {
  }

  triggerExpansion(){
    this.exp.expandCollapse();
  }
}
