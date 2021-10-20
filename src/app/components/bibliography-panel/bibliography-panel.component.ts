import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bibliography-panel',
  templateUrl: './bibliography-panel.component.html',
  styleUrls: ['./bibliography-panel.component.scss']
})
export class BibliographyPanelComponent implements OnInit {

  bibliographyForm = new FormGroup({
    bibliography: new FormArray([this.createBibliography()]),
  })
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.bibliographyForm = this.formBuilder.group({
      bibliography: this.formBuilder.array([this.createBibliography()])
    })
  }

  createBibliography(){
  
    return this.formBuilder.group({
      label: new FormControl(null)
    })
  }

}
