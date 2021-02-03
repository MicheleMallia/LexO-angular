import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexicalEntryTreeComponent } from './lexical-entry-tree.component';

describe('LexicalEntryTreeComponent', () => {
  let component: LexicalEntryTreeComponent;
  let fixture: ComponentFixture<LexicalEntryTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexicalEntryTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicalEntryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
