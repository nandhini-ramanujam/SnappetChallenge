import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { SummaryService } from '../../services/summary.service';
import { of, throwError } from 'rxjs';
import { ChartData, DomainItem, EngagementSummary } from '../../interfaces/interfaces';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let summaryService: SummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [SummaryService],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    summaryService = TestBed.inject(SummaryService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSummary on ngOnInit', () => {
    spyOn(component, 'getSummary');
    component.ngOnInit();
    expect(component.isLoading).toBeTrue();
    expect(component.getSummary).toHaveBeenCalled();
  });

  it('should stop loading and set summary', () => {
    spyOn(summaryService, 'getStudentEngagementSummary').and.returnValue(of(mockSummaryResponse));
    component.getSummary();
    expect(component.isLoading).toBeFalse();
    expect(component.summary).toEqual(mockSummaryResponse);
    expect(component.loadError).toBeFalse();
  });

  it('should stop loading on error response', () => {
    spyOn(summaryService, 'getStudentEngagementSummary').and.returnValue(throwError('error'));
    component.getSummary();
    expect(component.isLoading).toBeFalse();
    expect(component.loadError).toBeTrue();
  });

  it('should configure subjectChart correctly', () => {
    component.summary = mockSummaryResponse;
    component.configSubjectSummaryChart();
    expect(component.subjects).toEqual(['Rekenen', 'Spelling', 'Begrijpend Lezen']);
    expect(component.subjectChart).toEqual({
      options: component.getPieChartOptions('Overall participation'),
      dataSets: [{ data: [91.59, 99.21, 92.47] }],
      legent: true,
      lables: ['Rekenen', 'Spelling', 'Begrijpend Lezen'],
    });
  });

  // #TODO move to fixtured
  const mockSummaryResponse: EngagementSummary = {
    Subjects: {
      Rekenen: [
        {
          Domain: 'Getallen',
          Percentage: '91.59',
        },
        {
          Domain: 'Meten',
          Percentage: '8.25',
        },
      ],
      Spelling: [
        {
          Domain: 'Taalverzorging',
          Percentage: '99.21',
        },
      ],
      'Begrijpend Lezen': [
        {
          Domain: '-',
          Percentage: '92.47',
        },
      ],
    },
    OverallReport: {
      Rekenen: 91.59,
      Spelling: 99.21,
      'Begrijpend Lezen': 92.47,
    },
  };

});
