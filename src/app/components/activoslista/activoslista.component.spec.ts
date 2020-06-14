import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoslistaComponent } from './activoslista.component';

describe('ActivoslistaComponent', () => {
  let component: ActivoslistaComponent;
  let fixture: ComponentFixture<ActivoslistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoslistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoslistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
