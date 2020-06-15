import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosprewComponent } from './activosprew.component';

describe('ActivosprewComponent', () => {
  let component: ActivosprewComponent;
  let fixture: ComponentFixture<ActivosprewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivosprewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivosprewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
