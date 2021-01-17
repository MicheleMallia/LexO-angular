import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSearchFormComponent } from './data-search-form.component';

describe('DataSearchFormComponent', () => {
  let component: DataSearchFormComponent;
  let fixture: ComponentFixture<DataSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
