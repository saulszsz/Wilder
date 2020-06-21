import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoscrudComponent } from './activoscrud.component';

describe('ActivoscrudComponent', () => {
  let component: ActivoscrudComponent;
  let fixture: ComponentFixture<ActivoscrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoscrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoscrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
