import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificatemenuComponent } from './modificatemenu.component';

describe('ModificatemenuComponent', () => {
  let component: ModificatemenuComponent;
  let fixture: ComponentFixture<ModificatemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificatemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificatemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
