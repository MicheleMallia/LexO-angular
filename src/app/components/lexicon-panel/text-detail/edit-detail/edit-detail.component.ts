import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.component.html',
  styleUrls: ['./edit-detail.component.scss']
})
export class EditDetailComponent implements OnInit {

  showTrigger = false;
  @ViewChild('navtabs') navtabs: ElementRef; 
  @ViewChild('navcontent') navcontent: ElementRef; 

  constructor(private lexicalService: LexicalEntriesService) { }

  ngOnInit(): void {
    
    this.lexicalService.coreData$.subscribe(
      object => {
        if(object != null){
          if(object['lexicalEntryInstanceName'] != undefined ||
             object['formInstanceName'] != undefined){

            var navTabLinks = this.navtabs.nativeElement.querySelectorAll('a')
            console.log(navTabLinks)
            navTabLinks.forEach(element => {
              console.log(element)
              if(element.text == 'Core'){
                element.classList.add('active')
              }else{
                element.classList.remove('active')
              }
            });

            var navContent = this.navcontent.nativeElement.querySelectorAll('.tab-pane');
            console.log(navContent)
            navContent.forEach(element => {
              console.log(element)
              if(element.id == 'core'){
                element.classList.add('active')
                element.classList.add('show')
              }else{
                element.classList.remove('active')
                element.classList.remove('show')
              }
            });
            this.showTrigger = true;
          }else {
            this.showTrigger = false;
          }
        }
      }
    );
  }

}
