import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profiles-table',
  templateUrl: './profiles-table.component.html',
  styleUrls: ['./profiles-table.component.scss']
})
export class ProfilesTableComponent implements OnInit, AfterViewInit {

  message = '';

  @ViewChild(DataTableDirective, {static: false})

  datatableElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  users: [];
  dtTrigger: Subject<any> = new Subject<any>();


  constructor(private httpClient: HttpClient) { }

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstname;
    console.log(this.message);
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.httpClient.get<any[]>('http://lari2.ilc.cnr.it:81/belexo/api/getUsers?requestUUID=12')
      .subscribe(data => {
        this.users = (data as any).users;
        console.log(this.users)
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns().every(function () {
          const that = this;
          $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this['value']) {
              that
                .search(this['value'])
                .draw();
            }
          });
        });
      });
    }, 200);
    
  }
}
