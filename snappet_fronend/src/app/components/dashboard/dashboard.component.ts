import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { SummaryService } from '../../services/summary.service';
import { ChartData, DomainItem, EngagementSummary, SummaryResponse } from '../../interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public subjects: string[] = [];
  public subjectChart?: ChartData;
  public domainCharts?: ChartData[];
  public summary: EngagementSummary | undefined;
  public loadError = false;
  public isLoading = true;

  constructor(private summaryService: SummaryService) { }

  ngOnInit(): void {
    this.getSummary();
  }

  getSummary(): void {
    this.summaryService.getStudentEngagementSummary().subscribe(
      (response: EngagementSummary) => {
        this.stopSpinner();
        this.summary = response;
        this.configSubjectSummaryChart();
        this.configDomainSummaryChart();
      },
      (error) => {
        this.stopSpinner();
        this.loadError = true;
      }
    );
  }

  stopSpinner() {
    this.isLoading = false;
  }

  configSubjectSummaryChart(): void {
    const data = this.summary;
    const overallData = data?.OverallReport || {};
    this.subjects = Object.keys(overallData);
    let weightedPercentages: Array<number> = Object.values(overallData);
    this.subjectChart = {
      options: this.getPieChartOptions("Overall participation"),
      dataSets: [{ data: weightedPercentages.map((p) => p) }],
      legent: true,
      lables: this.subjects
    };
  }

  configDomainSummaryChart(): void {
    this.domainCharts = this.subjects.map((subject) => {
      const domainData = this.summary?.Subjects[subject];
      const chartData: ChartData = {
        options: this.getPieChartOptions(subject),
        dataSets: this.getPieChartDatasets(domainData),
        legent: true,
        lables: this.getPieChartLabels(subject)
      }
      return chartData;
    });
  }

  getPieChartOptions(title: string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
        }
      }
    };
  }

  getPieChartDatasets(data: Array<DomainItem> | undefined) {
    let percentage = data ? data.map((s: DomainItem) => parseFloat(s.Percentage)) : [];
    return [{
      data: percentage
    }];
  }

  getPieChartLabels(subject: string): Array<string> {
    let data = this.summary?.Subjects[subject];
    let domain = data ? data.map((s: DomainItem) => s.Domain) : []
    return domain;
  }
}