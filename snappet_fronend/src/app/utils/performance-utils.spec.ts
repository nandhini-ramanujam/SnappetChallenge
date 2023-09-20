import { PerformanceColorMap } from '../constants/performance-color-map';
import { getColorByPerformance } from './performance-utils';

describe('getColorByPerformance', () => {
  it('should return Green for performance >= 90', () => {
    const performance = 95;
    const result = getColorByPerformance(performance);
    expect(result).toBe(PerformanceColorMap.Green);
  });

  it('should return LightGreen for performance >= 70', () => {
    const performance = 75;
    const result = getColorByPerformance(performance);
    expect(result).toBe(PerformanceColorMap.LightGreen);
  });

  it('should return Orange for performance >= 50', () => {
    const performance = 55;
    const result = getColorByPerformance(performance);
    expect(result).toBe(PerformanceColorMap.Orange);
  });

  it('should return Red for performance < 50', () => {
    const performance = 45;
    const result = getColorByPerformance(performance);
    expect(result).toBe(PerformanceColorMap.Red);
  });

  it('should return Empty for invalid input', () => {
    expect(getColorByPerformance(NaN)).toBe(PerformanceColorMap.Empty);
    expect(getColorByPerformance('test' as any)).toBe(PerformanceColorMap.Empty);
  });
});
