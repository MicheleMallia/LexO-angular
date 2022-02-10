import { AfterViewInit, Component, ContentChild, ElementRef, HostListener, Input, OnInit, QueryList, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DocumentSystemService } from 'src/app/services/document-system/document-system.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
declare var $: JQueryStatic;



@Component({
  selector: 'app-epigraphy-form',
  templateUrl: './epigraphy-form.component.html',
  styleUrls: ['./epigraphy-form.component.scss']
})
export class EpigraphyFormComponent implements OnInit{

  @Input() epiData: any;
  object : any;
  tokenArray: FormArray;
  private search_subject: Subject<any> = new Subject();
  private form_subject: Subject<any> = new Subject();

  private bind_subject: Subject<any> = new Subject();
  searchResults = [];
  memoryForms = [] ;

  selectedPopover = {
    htmlNodeName : '',
    tokenId : ''
  };

  data : object;
  sel_t : object;
  message : string;
  isOpen = false;
  @ViewChildren('span_modal') spanPopovers:QueryList<any>;
  //@ViewChild('span_modal') spanPopover: ElementRef;
  epigraphyForm = new FormGroup({
    tokens: new FormArray([this.createToken()]),
  })

  multiWordMode = false;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {

    setTimeout(() => {

      //PREVENIRE CHE I POPOVER SI CHIUDANO SE CLICCATI FUORI DAL COMPONENTE
      let index  = this.selectedPopover.tokenId
      
      //SE IL CLICK AVVIENE FUORI QUESTO COMPONENTE, L'EVENTUALE POPOVER DEVE RESTARE APERTO, 
      //SE SI CLICCA QUESTO COMPONENTE IL POPOVER VA CHIUSO E RIATTIVATO L'AUTOCLOSE
      if(index != ''){
        console.log(this.config)
        let popover = this.spanPopovers.toArray()[index];
        if(popover.isOpen()){
          console.log(popover.isOpen())
          console.log(popover)
          /* popover.autoClose = false; */
        }
      }
      

      
    }, 17);

    setTimeout(() => {
      /* console.log(event.path) */
      let evtPath = Array.from(event.path)
      let htmlNode = document.getElementById(this.selectedPopover.htmlNodeName)
      let tokenId = this.selectedPopover.tokenId;
      if(evtPath.includes(htmlNode)){

      }else{
        this.data['tokens'].forEach(element => {
          if(element.id != tokenId){
            
            element.editing = false;

            this.selectedPopover.htmlNodeName = '';
            this.selectedPopover.tokenId = ''
          }
        });

        let parentMarkElement = document.getElementsByClassName('token-'+tokenId)[0];
        console.log(document.getElementsByClassName('token-'+tokenId))
        if(parentMarkElement != null){
          let i = 0;
          Array.from(parentMarkElement.childNodes).forEach(
            element => {
              console.log(element)
              let textMarkElement = element.textContent;
              let prev, next;
              if(element['classList'] != undefined){

                if(element['classList'].contains('mark') || element['classList'].contains('mark_test')){
                  
                  prev = Array.from(parentMarkElement.childNodes)[i-1];
                  next = Array.from(parentMarkElement.childNodes)[i];

                  if(next == element){
                    next = Array.from(parentMarkElement.childNodes)[i+1];
                  }

                  if(prev != undefined){
                    if(prev.nodeName == '#text'){
                      textMarkElement = prev.textContent += textMarkElement;
                      prev.remove();
                    }
                  }

                  if(next !=undefined){
                    if(next.nodeName == '#text'){
                      textMarkElement += next.textContent;
                      next.remove()
                    }
                  }

                  const text = this.renderer.createText(textMarkElement)
                  
                  this.renderer.insertBefore(parentMarkElement, text, element)
                  //this.renderer.removeChild(parentMarkElement, element);

                  element.remove();

                  
                }
              }
              
              i++;
            }
          );
          
        }
       
      }
      //console.log(this.selectedPopover)
      /* event.path.forEach(element => {
          console.log(element == document.getElementById(this.selectedPopover))
      }); */
      
      //console.log(document.getElementById(this.selectedPopover.htmlNodeName))
    }, 17);

    if(!this.multiWordMode){
      //console.log(document.querySelectorAll('.token'))
      document.querySelectorAll('.multiword').forEach(element => {
        this.renderer.removeClass(element, 'multiword')
        this.renderer.removeClass(element, 'border-right-0');
      });
    }
    
  
  }



  @HostListener('window:keydown', ['$event'])
  enableMultiword(event: KeyboardEvent) {
    console.log(event)
    if(event.altKey && event.ctrlKey){
      this.multiWordMode = true;
      this.data['tokens'].forEach(element => {
        element.editing = false;
        this.selectedPopover.htmlNodeName = '';
        this.selectedPopover.tokenId = ''        
      });
    }else if(event.code == 'Escape'){
      
      let htmlNode = document.getElementById(this.selectedPopover.htmlNodeName)
      let tokenId = this.selectedPopover.tokenId;
      
      this.data['tokens'].forEach(element => {
        if(element.id != tokenId){
          
          element.editing = false;

          this.selectedPopover.htmlNodeName = '';
          this.selectedPopover.tokenId = ''
        }
      });

      let parentMarkElement = document.getElementsByClassName('token-'+tokenId)[0];
      if(parentMarkElement != null){
        let i = 0;
        Array.from(parentMarkElement.children).forEach(
          element => {
            console.log(element)
            if(element.classList.contains('mark')){

              //TODO: eliminazione mirata degli elementi di marcatura
              let textMarkElement = element.textContent;
              const text = this.renderer.createText(textMarkElement)
              //parentMarkElement.textContent = parentMarkElement.textContent.trim();
              //let innerText = parentMarkElement.textContent;
              this.renderer.insertBefore(parentMarkElement, text, element)
              this.renderer.removeChild(parentMarkElement, element);
              //parentMarkElement.insertBefore(text, parentMarkElement.childNodes[i+1]);
              //let children = parentMarkElement.children;
              //parentMarkElement.textContent = innerText
              i++;
              return;
            }
            i++;
          }
        );
        
      }
       
      
      
    }
  }

  @HostListener('window:keyup', ['$event'])
  disableMultiword(event: KeyboardEvent) {
    if(!event.altKey && !event.ctrlKey){
      this.multiWordMode = false;
    }
  }

  constructor(private renderer : Renderer2, private documentService : DocumentSystemService, private formBuilder: FormBuilder, private toastr: ToastrService, private lexicalService : LexicalEntriesService, private config: NgbPopoverConfig) { }

  ngOnInit(): void {

    /* this.config.autoClose = false */
    

    this.epigraphyForm = this.formBuilder.group({
      tokens: this.formBuilder.array([this.createToken()])
    })

    this.search_subject.pipe(debounceTime(1000)).subscribe(
      data => {
          this.onSearchFilter(data)
      }
    )

    this.form_subject.pipe(debounceTime(1000)).subscribe(
      data => {
          this.onChangeForm(data)
      }
    )

    this.bind_subject.pipe(debounceTime(100)).subscribe(
      data=> {
        /* console.log(data) */
        this.bindSelection(data.popover, data.evt, data.i );
      }
    )
    
  }


  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
        if (this.object != changes.epiData.currentValue) {
            this.tokenArray = this.epigraphyForm.get('tokens') as FormArray;
            this.tokenArray.clear();
            /* 

            this.denotesArray = this.coreForm.get('denotes') as FormArray;
            this.denotesArray.clear();

            this.cognatesArray = this.coreForm.get('cognate') as FormArray;
            this.cognatesArray.clear();

            this.evokesArray = this.coreForm.get('evokes') as FormArray;
            this.evokesArray.clear();

            this.memoryPos = '';

            this.staticMorpho = [] */
        }
        this.data = {
          tokens : [
            {
              "id": 1,
              "value": "odio",
              "start": 91,
              "end": 12,
              "selected": false,
              "editing": false
            }, {
              "id": 2,
              "value": "non",
              "start": 52,
              "end": 58,
              "selected": false,
              "editing": false
            }, {
              "id": 3,
              "value": "tellus",
              "start": 95,
              "end": 79,
              "selected": false,
              "editing": false
            }, {
              "id": 4,
              "value": "venenatis",
              "start": 97,
              "end": 7,
              "selected": false,
              "editing": false
            }, {
              "id": 5,
              "value": "eget",
              "start": 96,
              "end": 85,
              "selected": false,
              "editing": false
            }, {
              "id": 6,
              "value": "ante",
              "start": 22,
              "end": 24,
              "selected": false,
              "editing": false
            }, {
              "id": 7,
              "value": "tincidunt",
              "start": 17,
              "end": 80,
              "selected": false,
              "editing": false
            }, {
              "id": 8,
              "value": "aliquam",
              "start": 78,
              "end": 10,
              "selected": false,
              "editing": false
            }, {
              "id": 9,
              "value": "blandit",
              "start": 100,
              "end": 64,
              "selected": false,
              "editing": false
            }, {
              "id": 10,
              "value": "rhoncus",
              "start": 2,
              "end": 71,
              "selected": false,
              "editing": false
            }, {
              "id": 11,
              "value": "sit",
              "start": 15,
              "end": 58,
              "selected": false,
              "editing": false
            }, {
              "id": 12,
              "value": "non",
              "start": 39,
              "end": 26,
              "selected": false,
              "editing": false
            }, {
              "id": 13,
              "value": "vehicula",
              "start": 64,
              "end": 96,
              "selected": false,
              "editing": false
            }, {
              "id": 14,
              "value": "sit",
              "start": 29,
              "end": 32,
              "selected": false,
              "editing": false
            }
          ]         
        }

        this.object = changes.epiData.currentValue;

        console.log(this.object)
        if (this.object != null) {
            
            //TODO: popolare array form con tokens
            
           
        }


    }, 10)

  }

  onChangeForm(data) {
    /* var index = data['i']; */
    let parameters;
    //this.cognatesArray = this.coreForm.get("cognate") as FormArray;
    const newValue = data['name']
    parameters = {
        type: "lexicalRel",
        relation: "cognate",
        value: newValue
    }
    /* if (this.memoryForms == undefined) {
        const newValue = data['name']
        parameters = {
            type: "lexicalRel",
            relation: "cognate",
            value: newValue
        }
        


    } else {
        const oldValue = this.memoryForms[0]['lexicalEntity']
        const newValue = data['name']
        parameters = {
            type: "lexicalRel",
            relation: "cognate",
            value: newValue,
            currentValue: oldValue
        }
        this.memoryForms[0] = data;
    } */

    console.log(parameters)

    this.lexicalService.triggerAttestationPanel(true);
    this.lexicalService.sendToAttestationPanel(data);

    //TODO INSERIRE MODO PER CREARE SPAN ANNOTATION SE C'È UN ELEMENTO MARK
    let markElement = Array.from(document.getElementsByClassName('mark'))[0];
    if(markElement != null){
      this.renderer.removeClass(markElement, 'mark');
      this.renderer.addClass(markElement, 'annotation');
      this.renderer.addClass(markElement, 'unselectable')
    }else{
      //QUI SE NON C'È ALCUN MARK SPAN E VIENE SELEZIONATA LA PAROLA INTERA
    }

    let parentMarkElement = document.getElementsByClassName('token-'+this.selectedPopover.tokenId)[0];
    console.log("parent mark element", parentMarkElement.children)
    if(parentMarkElement != null){
      Array.from(parentMarkElement.children).forEach(
        element => {
          console.log(element.classList)
          if(element.classList.contains('mark_test')){

            this.renderer.removeClass(element, 'mark_test');
            this.renderer.addClass(element, 'annotation_ultra');
            this.renderer.addClass(element, 'unselectable')
            return;
          }
        }
      );
      
    }
    

    //let lexId = this.object.lexicalEntryInstanceName;
    /* this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
        data => {
            console.log(data);
            this.lexicalService.spinnerAction('off');
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            this.lexicalService.updateLexCard(data)
        }, error => {
            console.log(error)

            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
            this.lexicalService.spinnerAction('off');
            if(error.status == 200){
                this.toastr.success('Cognates changed correctly for ' + lexId, '', {
                    timeOut: 5000,
                });
            }else{
                this.toastr.error(error.error, 'Error', {
                    timeOut: 5000,
                  });
                
            }
        }
    ) */

    this.memoryForms[0] = data;
  }

  clearAll(){
    this.searchResults = null;
  }

  handleForm(evt) {

    if (evt instanceof NgSelectComponent) {
        if (evt.selectedItems.length > 0) {
            console.log(evt.selectedItems[0])
            let label;
            if(evt.selectedItems[0]['value']['formInstanceName'] != undefined){
              label = evt.selectedItems[0]['value']['formInstanceName'];
            }else{
              label = evt.selectedItems[0].label;
            }
            this.onChangeForm({ name: label})
        }
    } else {
        let label = evt.target.value;
        this.form_subject.next({ name: label})
    }
  }
  
  deleteData() {
    this.searchResults = [];
  }

  triggerSearch(evt) {
    if (evt.target != undefined) {
        
        this.search_subject.next(evt.target.value)
    }
  }

  onSearchFilter(data) {
    this.searchResults = [];
    console.log(data)
    let parameters = {
        text: data,
        searchMode: "startsWith",
        representationType: "writtenRep",
        author: "",
        offset: 0,
        limit: 500
    }
    console.log(parameters)
    if (data != "") { /* && data.length >= 3 */
      this.lexicalService.getFormList(parameters).subscribe(
          data => {
              console.log(data)
              this.searchResults = data['list']
          }, error => {
              //console.log(error)
          }
      )
    } 
    
  }

  /* createNewForm(name){
    console.log(name)
    return new Promise((resolve) => {
      // Simulate backend call.
      setTimeout(() => {
          resolve({ id: 5, name: name, new_etymon: true });
      }, 1000);
    })
  } */

  /* selectedToken(t){
    console.log(t);
    this.sel_t = t;
  } */

  createToken(token?){
    if (token != undefined) {
      return this.formBuilder.group({
          entity: new FormControl(token)
      })
    } else {
      return this.formBuilder.group({
          entity: new FormControl('')
      })
    }
  }
  enterCell(evt, i){
    //console.log("enter cell " + i);
    this.data['tokens'][i]['selected'] = true;
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    }
  }

  leavingCell(evt, i ){
    //console.log("leaving cell " + i);
    this.data['tokens'][i]['selected'] = false;
    
  }

  deleteSelection(popover, evt, i){
    setTimeout(() => {
      
    }, 10);
    let popoverHtml = popover._elementRef.nativeElement;
    console.log(popoverHtml.querySelectorAll('.annotation'))
    if(popoverHtml.querySelectorAll('.annotation').length > 0){

    }else{
      popoverHtml.textContent = popoverHtml.textContent.trim();
    }
    /* if(popoverHtml.querySelectorAll('.mark').length > 0){
      let innerText = popoverHtml.innerText;
      const childElements = popoverHtml.children;
      for (let child of childElements) {
        console.log(child)
        this.renderer.removeChild(popoverHtml, child);
      }
      console.log(innerText)
      popoverHtml.innerText = innerText
    }else if(popoverHtml.querySelectorAll('.mark').length == 0){
      
    } */
    
  }

  triggerBind(popover, evt, i){
    if(!this.multiWordMode){
      this.bind_subject.next({popover, evt, i})
    }else{
      //console.log("multiword mode", i)
      console.log(popover);
      this.multiWordCreator(popover, evt, i);
    }
  }

  multiWordCreator(popover, evt, i){
    let span = popover._elementRef.nativeElement.parentNode.parentNode.childNodes[i]; 
    let prevSibling, nextSibling;
    prevSibling = popover._elementRef.nativeElement.parentNode.previousSibling;
    nextSibling = popover._elementRef.nativeElement.parentNode.nextSibling;
    
    if(span.classList.contains('multiword')){
      this.renderer.removeClass(span, 'multiword')
      if(prevSibling != null){
        if(prevSibling.classList.contains('multiword')){
          this.renderer.removeClass(prevSibling, 'border-right-0')
        }
        if(nextSibling != null){
          if(nextSibling.classList.contains('multiword')){
            this.renderer.removeClass(span, 'border-right-0')
          }
        }
      } 
      
      
    }else{
      this.renderer.addClass(span, 'multiword');
      if(prevSibling != null){
        if(prevSibling.classList.contains('multiword')){
          this.renderer.addClass(prevSibling, 'border-right-0')
        }
      }
      if(nextSibling != null){
        if(nextSibling.classList.contains('multiword')){
          this.renderer.addClass(span, 'border-right-0')
        }
      }
      
      
    }
    
    console.log(span)

    
    
    
  }

  bindSelection(popover, evt, i) {

    
    
    //console.log(evt)
    setTimeout(() => {
      this.message = '';
      this.data['tokens'][i]['editing'] = true;
      this.message = window.getSelection().toString();
      
      if(this.selectedPopover.htmlNodeName == ''){
        this.selectedPopover.htmlNodeName = popover._ngbPopoverWindowId;
        this.selectedPopover.tokenId = i;
      }
      else if(popover._ngbPopoverWindowId != this.selectedPopover){
        this.selectedPopover.htmlNodeName = popover._ngbPopoverWindowId
        this.selectedPopover.tokenId = i
        this.data['tokens'].forEach(element => {
          if(element.id != i+1){
            //console.log(element)
            element.editing = false;
          }else{
            //console.log(element)
            element.editing = true;
          }
        });
      }
      
      if(popover.isOpen()){
        
      }else if(!popover.isOpen()){
        popover.open()
      }
        
      let popoverHtml = popover._elementRef.nativeElement;
      let innerText = popoverHtml.innerText;
      let selection = document.getSelection();
      let anchorNode = selection.anchorNode;
      let focusNode = selection.focusNode;
      let isThereMark, areThereAnnotations; 
      isThereMark = popoverHtml.querySelectorAll('.mark').length > 0;
      areThereAnnotations = popoverHtml.querySelectorAll('.annotation').length > 0;

      if(anchorNode != null && focusNode != null){
        let anchorNodeParent = selection.anchorNode.parentNode;
        let focusNodeParent = selection.focusNode.parentNode;

        if(anchorNodeParent == focusNodeParent && this.message != '' && !areThereAnnotations){  
           //SITUAZIONE IN CUI STO EFFETTUANDO LA PRIMA ANNOTAZIONE
          if(selection.anchorNode.textContent.trim().length == innerText.length && !isThereMark 
                                                                                && this.message != innerText){
            //c'è solo uno span, ancora non è stata effettuata alcuna annotazione e non c'è alcuna annotazione pregressa

            let anchorOffset = selection.anchorOffset;
            let focusOffset = selection.focusOffset;

            
            if(anchorOffset > focusOffset){
              let tmp = anchorOffset;
              anchorOffset = focusOffset;
              focusOffset = tmp;
            }

            console.log(innerText.substring(anchorOffset, focusOffset))
            console.log(anchorOffset)
            console.log(focusOffset);

            popoverHtml.innerText = "";

            const span = this.renderer.createElement('span'); 
            const l_text = this.renderer.createText(innerText.substring(0, anchorOffset))
            const text = this.renderer.createText(this.message);
            const r_text = this.renderer.createText(innerText.substring(focusOffset, innerText.length))


            console.log("l_text:" , l_text)
            console.log("text:" , text)
            console.log("r_text:" , r_text)


            this.renderer.appendChild(span, text)
            this.renderer.appendChild(popoverHtml, span);
            this.renderer.addClass(span, 'mark'),
            this.renderer.setAttribute(span, 'startoffset', anchorOffset.toString());
            this.renderer.setAttribute(span, 'endoffset', focusOffset.toString())
            
            if(l_text.textContent != ""){
              this.renderer.insertBefore(popoverHtml, l_text, span);
            }
            
            if(r_text.textContent != ""){
              this.renderer.appendChild(popoverHtml, r_text);
            } 
            console.log(popoverHtml.childNodes)
          } 
        }else if(this.message != '' && areThereAnnotations){
          let anchorOffset = selection.anchorOffset;
          let focusOffset = selection.focusOffset;
          let range = selection.getRangeAt(0)
          
          var sel = getSelection(),
          position = sel.anchorNode.compareDocumentPosition(sel.focusNode),
          backward = false;
          // position == 0 if nodes are the same
          if (!position && sel.anchorOffset > sel.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING){
              backward = true; 
          }
            
          console.log(backward)

          let startContainer = range.startContainer;
          let endContainer = range.endContainer;
          let textStartContainer = range.startContainer.textContent;
          let textEndContainer = range.endContainer.textContent;
          let annotations = popoverHtml.querySelectorAll('.annotation')
          
          //console.log(range.startContainer == range.endContainer)
          if(range.startContainer == range.endContainer){            
            if(anchorOffset > focusOffset){
              let tmp = anchorOffset;
              anchorOffset = focusOffset;
              focusOffset = tmp;
            }
            this.message = textStartContainer.substring(range.startOffset, range.endOffset);
            const span = this.renderer.createElement('span'); 

            const l_text = this.renderer.createText(textStartContainer.substring(0, range.startOffset))
            const text = this.renderer.createText(this.message);
            const r_text = this.renderer.createText(textStartContainer.substring(range.endOffset, textStartContainer.length))

            console.log(anchorOffset, focusOffset)
            /* console.log("l_text:" , l_text)
            console.log("text:" , text)
            console.log("r_text:" , r_text) */

            //range.startContainer.textContent = '';
            
            
            this.renderer.appendChild(span, text)
            this.renderer.addClass(span, 'mark');

            //TODO: perfezionare posizione inserimento
            console.log(popoverHtml.childNodes)
            let i = 0;
            const getStartEnd = (str, sub) => [str.indexOf(sub), str.indexOf(sub) + sub.length - 1];
            let generalStartEndOffset = getStartEnd(popoverHtml.textContent, this.message);
            let children = Array.from(popoverHtml.childNodes).forEach(
              x => {
                if(range.startContainer == x){
                  range.startContainer.textContent = '';
                  
                  if(l_text.textContent != ""){
                    this.renderer.insertBefore(popoverHtml, l_text, x)
                  }
                  


                  this.renderer.setAttribute(span, 'startoffset', anchorOffset.toString());
                  this.renderer.setAttribute(span, 'endoffset', focusOffset.toString())

                  popoverHtml.insertBefore(span, popoverHtml.childNodes[i+1]);
                  
                  if(r_text.textContent != ""){
                    popoverHtml.insertBefore(r_text, popoverHtml.childNodes[i+2]);
                  }
                  //@ts-ignore
                  x.remove()
                }

                i++;
              }
            )
          }else if(range.startContainer != range.endContainer){
            console.log(range)
            console.log(startContainer);
            console.log(endContainer)

            if(backward){
              let tmp = anchorOffset;
              anchorOffset = focusOffset;
              focusOffset = tmp;
            }

            console.log(anchorOffset, focusOffset)
            
            this.message = '';
            let walker = function foo(element, that){

              let textElement = element.textContent
              let nextSibling = element.nextSibling;
              if(element == endContainer){
                console.log("end container", endContainer)
                that.message += textElement.substring(0, focusOffset)

                const span = that.renderer.createElement('span'); 
                const text = that.renderer.createText(textElement.substring(0, focusOffset));
                const r_text = that.renderer.createText(textElement.substring(focusOffset, textElement.length))


                that.renderer.appendChild(span, text)
                that.renderer.addClass(span, 'mark_test');

                let i = 0;
                const getStartEnd = (str, sub) => [str.indexOf(sub), str.indexOf(sub) + sub.length - 1];
                let generalStartEndOffset = getStartEnd(popoverHtml.textContent, that.message);
                let children = Array.from(popoverHtml.childNodes).forEach(
                  x => {
                    console.log(i, x)
                    if(element == x){
                      element.textContent = '';

                      /* that.renderer.setAttribute(span, 'startoffset', generalStartEndOffset[0]);
                      that.renderer.setAttribute(span, 'endoffset', generalStartEndOffset[1]) */

                      popoverHtml.insertBefore(span, popoverHtml.childNodes[i+1]);
                      
                      if(r_text.textContent != ""){
                        popoverHtml.insertBefore(r_text, popoverHtml.childNodes[i+2]);
                      }

                      //@ts-ignore
                      x.remove();

                    }

                    i++;
                  }
                )
                return;
              }else{
                console.log("current element", element);

               
                if(element == startContainer){
                  that.message = textElement.substring(anchorOffset, textElement.length);
                  const span = that.renderer.createElement('span'); 
                  const l_text = that.renderer.createText(textStartContainer.substring(0, anchorOffset))
                  const text = that.renderer.createText(that.message);

                  that.renderer.appendChild(span, text)
                  that.renderer.addClass(span, 'mark_test');

                  let i = 0;
                  const getStartEnd = (str, sub) => [str.indexOf(sub), str.indexOf(sub) + sub.length - 1];
                  let generalStartEndOffset = getStartEnd(popoverHtml.textContent, that.message);
                  let children = Array.from(popoverHtml.childNodes).forEach(
                    x => {
                      if(element == x){
                        element.textContent = '';
                        
                        if(l_text.textContent != ""){
                          that.renderer.insertBefore(popoverHtml, l_text, x)
                        }
                        
                        //that.renderer.setAttribute(span, 'startoffset', generalStartEndOffset[0]);
                        popoverHtml.insertBefore(span, popoverHtml.childNodes[i+1]);
                        //@ts-ignore
                        x.remove();
                      }

                      i++;
                    }
                  )
                }

                if(element.classList == undefined && element != startContainer){
                  that.message += element.textContent;
                  const span = that.renderer.createElement('span'); 
                  const text = that.renderer.createText(element.textContent);

                  that.renderer.appendChild(span, text)
                  that.renderer.addClass(span, 'mark_test');

                  let i = 0;
                  const getStartEnd = (str, sub) => [str.indexOf(sub), str.indexOf(sub) + sub.length - 1];
                  let generalStartEndOffset = getStartEnd(popoverHtml.textContent, that.message);
                  let children = Array.from(popoverHtml.childNodes).forEach(
                    x => {
                      if(element == x){
                        element.textContent = '';
                        /* that.renderer.setAttribute(span, 'startoffset', generalStartEndOffset[0]);
                        that.renderer.setAttribute(span, 'endoffset', generalStartEndOffset[1]) */
                        popoverHtml.insertBefore(span, popoverHtml.childNodes[i+1]);
                        //@ts-ignore
                        x.remove();
                      }

                      i++;
                    }
                  )

                }

               /*  if(element.classList != undefined){
                  if(element.classList.contains('annotation')){
                    
                  }
                } */

                if(nextSibling != null){
                  foo(nextSibling, that)
                }
              }
            }

            walker(startContainer, this)
          }

          
        }
      }
          
    }, 10);
    
  }

}

