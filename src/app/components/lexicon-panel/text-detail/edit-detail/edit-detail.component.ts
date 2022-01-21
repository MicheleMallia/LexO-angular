import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExpanderService } from 'src/app/services/expander/expander.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.component.html',
  styleUrls: ['./edit-detail.component.scss']
})
export class EditDetailComponent implements OnInit {

  object : any;
  showTrigger = false;
  @ViewChild('navtabs') navtabs: ElementRef; 
  @ViewChild('navcontent') navcontent: ElementRef; 

  constructor(private lexicalService: LexicalEntriesService, private exp : ExpanderService) { }

  ngOnInit(): void {
    
    this.object = null;
    this.lexicalService.coreData$.subscribe(
      object => {
        if(object != null){
          if(object['lexicalEntryInstanceName'] != undefined ||
             object['formInstanceName'] != undefined ||
             object['senseInstanceName'] != undefined){
            var navTabLinks = this.navtabs.nativeElement.querySelectorAll('a')
            this.object = object;
            navTabLinks.forEach(element => {
              /* //console.log(element) */
              if(element.text == 'Core'){
                element.classList.add('active')
              }else{
                element.classList.remove('active')
                //console.log(element.id)
              }
            });

            var navContent = this.navcontent.nativeElement.querySelectorAll('.tab-pane');
            
            navContent.forEach(element => {
              
              if(element.id == 'core'){
                element.classList.add('active')
                element.classList.add('show')
              }else{
                
                element.classList.remove('active')
                element.classList.remove('show')
                //console.log(element)
              }
            });
          }else {
            this.object = null;
          }
        }
      }
    );

    this.lexicalService.etymologyData$.subscribe(
      object => {
        if(object != null){
          if(object['etymology']['etymologyInstanceName'] != undefined){
            this.object = object;
            var navTabLinks = this.navtabs.nativeElement.querySelectorAll('a')
            
            navTabLinks.forEach(element => {
              //console.log(element.text)
              if(element.text == 'Etymology'){
                /* console.log("aggiungo active a:") */
                element.classList.add('active')

              }else{
                element.classList.remove('active')
                /* console.log("tolgo active a:") */
              }
            });
            var navContent = this.navcontent.nativeElement.querySelectorAll('.tab-pane');
            
            navContent.forEach(element => {
              //console.log(element.id)
              if(element.id == 'etymology'){
                element.classList.add('active')
                element.classList.add('show')
              }else{
                element.classList.remove('active')
                element.classList.remove('show')
                //console.log(element.id)
              }
            });
            
          }else {
            this.object = null;
          }
        }
      }
    );
  }

  triggerExpansionEdit(){
    
    this.exp.expandCollapseEdit();

    let isEditExpanded = this.exp.isEditTabExpanded();
    let isEpigraphyExpanded = this.exp.isEpigraphyTabExpanded();

    setTimeout(() => {
      if(isEpigraphyExpanded){
        this.exp.expandCollapseEpigraphy(true);
      }
    }, 200);
  }

}
