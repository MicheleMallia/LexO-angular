import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

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

  constructor() { }

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstname;
    console.log(this.message);
  }

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'assets/data/data.json',
      responsive: true,
      processing: true,
      columns: [
        {
          title: 'ID',
          data: 'id'
        },
        {
          title: 'Ruolo',
          data: 'role'
        },
        {
          title: 'Nome',
          data: 'firstname'
        }, 
        {
          title: 'Nome utente',
          data: 'username'
        },
        {
          title: 'E-mail',
          data: 'email'
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.someClickHandler(data);
        });
        return row;
      }
    };
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        const that = this;
        $('input', this.footer()).on('keyup change', function () {
          // @ts-ignore
          if (that.search() !== this['value']) {
            that
              // @ts-ignore
              .search(this['value'])
              .draw();
          }
        });
      });
    });
  }
}
