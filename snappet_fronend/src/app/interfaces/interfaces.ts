import { ChartDataset, ChartOptions } from "chart.js";

export interface PerformanceResponse {
  body: {
    StudentsPerformance: StudentPerformance[];
  };
}

export interface User {
  FirstName: string;
  LastName: string;
  UserId: number
}

export interface StudentPerformance {
  Performance: {
    [key: string]: number;
  };
  GroupId: number;
  SubmittedDate: string;
  UserId: number;
  UserName?: string;
}

export interface UserDetailsResponse {
  body: {
    Students: User[];
  };
}

export interface SummaryResponse {
  body: {
    Summary: EngagementSummary;
  };
}

export interface EngagementSummary {
  OverallReport: {
    [key: string]: number;
  };
  Subjects: {
    [key: string]: Array<{ Domain: string, Percentage: string }>;
  };
}

export interface DomainItem {
  Percentage: string;
  Domain: string;
}

export interface ChartData {
  options: ChartOptions<'pie'>
  dataSets: Array<ChartDataset<"pie", number[]>>
  legent: boolean,
  lables: Array<string>
}