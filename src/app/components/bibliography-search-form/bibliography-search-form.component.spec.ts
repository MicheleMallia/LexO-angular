import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliographySearchFormComponent } from './bibliography-search-form.component';

describe('BibliographySearchFormComponent', () => {
  let component: BibliographySearchFormComponent;
  let fixture: ComponentFixture<BibliographySearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibliographySearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliographySearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
