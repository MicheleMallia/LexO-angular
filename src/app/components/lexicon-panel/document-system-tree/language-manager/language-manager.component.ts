import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-language-manager',
  templateUrl: './language-manager.component.html',
  styleUrls: ['./language-manager.component.scss']
})
export class LanguageManagerComponent implements OnInit {

  languageList = [];
  editLangArray = [];
  isValid = false;
  loadingService = false;
  removeMessage;

  private subject: Subject<any> = new Subject();
  /* public urlRegex = /(^|\s)((https?:\/\/.+))/ */

  editLangForm = new FormGroup({
    catalog: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    languageInstanceName: new FormControl('', [Validators.required, Validators.minLength(0), Validators.maxLength(10)])
  })
  constructor(private lexicalService: LexicalEntriesService) { }


  ngOnInit(): void {

    this.loadLangData();

    /*  this.onChanges(); */
    this.lexicalService.refreshLangTable$.subscribe(
      data => {
        /* console.log("refresh"); */
        this.loadLangData();
      }, error => {
        console.log("no refresh")
      }
    )

    this.subject.pipe(debounceTime(1000)).subscribe(
      data => {
        this.onEditLanguage(data)
      }
    )
  }


  loadLangData() {
    this.lexicalService.getLexiconLanguages().subscribe(
      data => {
        /* console.log(data) */
        this.languageList = data;
      }, error => {
        console.log(error)
      }
    )
  }

  onSubmit(inputValue: string) {
    console.log(inputValue.match(/^[A-Za-z]{2,3}$/))
    if (inputValue.match(/^[A-Za-z]{2,3}$/)) {
      this.isValid = true;
      this.loadingService = true;
      this.lexicalService.createNewLanguage(inputValue).subscribe(
        data => {
          this.loadingService = false;
          this.lexicalService.refreshLangTable();
        }, error => {
          console.log(error)
        }
      )
    } else {
      this.isValid = false;
    }
  }

  triggerEdit(i, v) {
    this.subject.next({ i, v })
  }

  onEditLanguage(data) {
    if (data['i'] == "description") {
      let langId = this.editLangArray['languageInstanceName'];
      let parameters = {
        relation: 'description',
        value: data['v']
      }

      this.lexicalService.updateLanguage(langId, parameters).subscribe(
        data => {
          console.log(data)
          this.lexicalService.refreshLangTable();
        }, error => {
          console.log(error)
          this.lexicalService.refreshLangTable();
        }
      )
    } else if (data['i'] == "catalog") {
      let langId = this.editLangArray['languageInstanceName'];
      let parameters = {
        relation: 'linguisticCatalog',
        value: data['v']
      }

      this.lexicalService.updateLanguage(langId, parameters).subscribe(
        data => {
          console.log(data)
          this.lexicalService.refreshLangTable();
        }, error => {
          console.log(error)
          this.lexicalService.refreshLangTable();
        }
      )
    }else if (data['i'] == "languageInstanceName") {
      let langId = this.editLangArray['languageInstanceName'];
      let parameters = {
        relation: 'language',
        value: data['v']
      }

      this.lexicalService.updateLanguage(langId, parameters).subscribe(
        data => {
          console.log(data)
          this.lexicalService.refreshLangTable();
        }, error => {
          console.log(error)
          this.lexicalService.refreshLangTable();
        }
      )
    }
  }

  editLang(index) {
    this.editLangArray = this.languageList[index]
    this.editLangForm.get('description').setValue(this.editLangArray['description'], { eventEmit: false })
    this.editLangForm.get('catalog').setValue(this.editLangArray['catalog'], { eventEmit: false })
    this.editLangForm.get('languageInstanceName').setValue(this.editLangArray['languageInstanceName'], { eventEmit: false })
  }

  checkEditValid(index) {
    return this.editLangForm.get(index).valid;
  }

  removeLang(index) {
    this.removeMessage = this.languageList[index]['languageInstanceName']
  }

  deleteLangRequest(){
    let langId = this.removeMessage;
    this.lexicalService.deleteLanguage(langId).subscribe(
      data=>{
        console.log(data);
        this.lexicalService.refreshLangTable();
      },error=>{
        console.log(error);
        this.lexicalService.refreshLangTable();
      }
    )
  }


}
