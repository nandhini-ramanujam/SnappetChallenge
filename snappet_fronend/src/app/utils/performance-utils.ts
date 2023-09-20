import { PerformanceColorMap } from "../constants/performance-color-map";

export function getColorByPerformance(performance: number): string {

  if (isNaN(performance)) {
    return PerformanceColorMap.Empty;
  }

  switch (true) {
    case performance >= 90:
      return PerformanceColorMap.Green;
    case performance >= 70:
      return PerformanceColorMap.LightGreen;
    case performance >= 50:
      return PerformanceColorMap.Orange;
    case performance < 50:
      return PerformanceColorMap.Red;
    default:
      return PerformanceColorMap.Empty;
  }
}
