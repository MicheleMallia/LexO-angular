import { Component, OnInit } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-language-manager',
  templateUrl: './language-manager.component.html',
  styleUrls: ['./language-manager.component.scss']
})
export class LanguageManagerComponent implements OnInit {

  languageList = [];
  constructor(private lexicalService : LexicalEntriesService) { }

  ngOnInit(): void {
    this.lexicalService.getLexiconLanguages().subscribe(
      data=>{
        console.log(data)
        this.languageList = data;
      },error=>{
        console.log(error)
      }
    )
  }

}
