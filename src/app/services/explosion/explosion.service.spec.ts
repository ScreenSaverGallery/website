import { TestBed } from '@angular/core/testing';

import { ExplosionService } from './explosion.service';

describe('ExplosionService', () => {
  let service: ExplosionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplosionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
