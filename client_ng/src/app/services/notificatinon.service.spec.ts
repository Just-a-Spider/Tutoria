import { TestBed } from '@angular/core/testing';

import { NotificatinonService } from './notificatinon.service';

describe('NotificatinonService', () => {
  let service: NotificatinonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificatinonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
