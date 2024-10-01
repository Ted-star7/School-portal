import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpirationNotificationComponent } from './session-expiration-notification.component';

describe('SessionExpirationNotificationComponent', () => {
  let component: SessionExpirationNotificationComponent;
  let fixture: ComponentFixture<SessionExpirationNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpirationNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionExpirationNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
