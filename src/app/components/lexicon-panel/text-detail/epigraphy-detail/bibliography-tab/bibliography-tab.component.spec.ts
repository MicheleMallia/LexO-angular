import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliographyTabComponent } from './bibliography-tab.component';

describe('BibliographyTabComponent', () => {
  let component: BibliographyTabComponent;
  let fixture: ComponentFixture<BibliographyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibliographyTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliographyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
