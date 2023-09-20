import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SummaryService } from './summary.service';
import { environment } from 'src/environments/environment';
import { EngagementSummary, SummaryResponse } from '../interfaces/interfaces';
import { of } from 'rxjs';

describe('SummaryService', () => {
  let service: SummaryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SummaryService],
    });

    service = TestBed.inject(SummaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve student engagement summary data from the API', () => {
    const mockEngagementSummary = {
      body: {
        Summary: {
          Subjects: {
            Rekenen: [
              { Domain: 'Getallen', Percentage: '91.59' },
              { Domain: 'Meten', Percentage: '8.25' },
            ],
            Spelling: [{ Domain: 'Taalverzorging', Percentage: '99.21' }],
            'Begrijpend Lezen': [{ Domain: '-', Percentage: '92.47' }],
          },
          OverallReport: {
            Rekenen: 99.18,
            Spelling: 42.52,
            'Begrijpend Lezen': 5.71,
          }
        }
      }
    };

    spyOn(service['http'], 'get').and.returnValue(
      of(mockEngagementSummary)
    );

    service.getStudentEngagementSummary().subscribe((data) => {
      expect(data).toEqual(mockEngagementSummary.body.Summary);
    });

  });
});
