import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-search-form',
  templateUrl: './data-search-form.component.html',
  styleUrls: ['./data-search-form.component.scss']
})
export class DataSearchFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Process checkout data here
    
    console.warn('Your order has been submitted');
    
  }
}
