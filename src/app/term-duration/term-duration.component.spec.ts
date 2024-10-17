import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDurationComponent } from './term-duration.component';

describe('TermDurationComponent', () => {
  let component: TermDurationComponent;
  let fixture: ComponentFixture<TermDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
