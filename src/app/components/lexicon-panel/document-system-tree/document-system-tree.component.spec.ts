import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSystemTreeComponent } from './document-system-tree.component';

describe('DocumentSystemTreeComponent', () => {
  let component: DocumentSystemTreeComponent;
  let fixture: ComponentFixture<DocumentSystemTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentSystemTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSystemTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
