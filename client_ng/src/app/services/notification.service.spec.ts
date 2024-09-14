import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('NotificatinonService', () => {
  let service: NotificationService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getUserId']);

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: AuthService, useValue: spy }],
    });

    service = TestBed.inject(NotificationService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect to WebSocket with correct URL', () => {
    const userId = 123;
    authServiceSpy.getUserId.and.returnValue(userId);
    service['connect']();

    expect(service['socket']).toBeTruthy();
    expect(service['socket']?.url).toBe(
      `ws://127.0.0.1:8000/ws/notifications/${userId}/`
    );
  });

  it('should handle WebSocket messages', (done) => {
    const testMessage = { data: 'test' };
    service.getNotifications().subscribe((message) => {
      expect(message).toEqual(testMessage.data);
      done();
    });

    service['notificationSubject'].next(testMessage);
  });

  it('should log WebSocket connection opened', () => {
    spyOn(console, 'log');
    service['connect']();
    service['socket']?.onopen?.(new Event('open'));

    expect(console.log).toHaveBeenCalledWith('WebSocket connection opened');
  });

  it('should log WebSocket connection closed', () => {
    spyOn(console, 'log');
    service['connect']();
    service['socket']?.onclose?.(new CloseEvent('close'));

    expect(console.log).toHaveBeenCalledWith('WebSocket connection closed');
  });

  it('should log WebSocket errors', () => {
    spyOn(console, 'error');
    service['connect']();
    const errorEvent = new Event('error');
    service['socket']?.onerror?.(errorEvent);

    expect(console.error).toHaveBeenCalledWith('WebSocket error:', errorEvent);
  });
});
