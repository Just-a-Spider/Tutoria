import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { FullNotification } from '../classes/notifications.class';
import { User } from '../classes/user.class';
import { NotificationsService } from './notifications.service';
import { AuthService } from './user/auth.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    TestBed.configureTestingModule({
      providers: [
        NotificationsService,
        { provide: AuthService, useValue: authSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(NotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch unseen notifications', () => {
    const dummyNotifications: FullNotification[] = [
      {
        id: '1',
        title: 'Test Notification 1',
        body: 'Test Notification 1',
        created_at: '2021-07-01T00:00:00Z',
        updated_at: '2021-07-01T00:00:00Z',
        instance_id: '1',
        user: 1,
        seen: false,
      },
      {
        id: '2',
        title: 'Test Notification 2',
        body: 'Test Notification 2',
        created_at: '2021-07-01T00:00:00Z',
        updated_at: '2021-07-01T00:00:00Z',
        instance_id: '2',
        user: 1,
        seen: false,
      },
    ];

    service.getNotifications().subscribe((notifications) => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}notifications/unseen/`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotifications);
  });

  it('should fetch seen notifications', () => {
    const dummyNotifications: FullNotification[] = [
      {
        id: '1',
        title: 'Test Notification 1',
        body: 'Test Notification 1',
        created_at: '2021-07-01T00:00:00Z',
        updated_at: '2021-07-01T00:00:00Z',
        instance_id: '1',
        user: 1,
        seen: false,
      },
      {
        id: '2',
        title: 'Test Notification 2',
        body: 'Test Notification 2',
        created_at: '2021-07-01T00:00:00Z',
        updated_at: '2021-07-01T00:00:00Z',
        instance_id: '2',
        user: 1,
        seen: false,
      },
    ];

    service.getNotifications(true).subscribe((notifications) => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}notifications/seen/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotifications);
  });

  it('should mark notification as seen', () => {
    const notificationId = '1';

    service.markSeen(notificationId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}notifications/${notificationId}/`
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should clear seen notifications', () => {
    service.clearSeen().subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}notifications/clear/`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update licenseIdSubject when goToLicense is called', () => {
    const licenseId = '12345';
    service.goToPost(licenseId);
    service.licenseId$.subscribe((id) => {
      expect(id).toBe(licenseId);
    });
  });

  it('should connect to WebSocket on initialization', () => {
    const user = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      dni: '12345678',
      ruc: '123456789',
      email: 'johndoe@gmail.com',
      role: 'citizen',
    } as User;
    authServiceSpy.getUser.and.returnValue(of(user));

    service['connect']();

    expect(authServiceSpy.getUser).toHaveBeenCalled();
  });
});
