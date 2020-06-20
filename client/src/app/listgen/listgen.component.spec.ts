import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListgenComponent } from './listgen.component';

describe('ListgenComponent', () => {
  let component: ListgenComponent;
  let fixture: ComponentFixture<ListgenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListgenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
