/**
 * LOGEST function.
 * https://www.statisticshowto.com/probability-and-statistics/regression-analysis/find-a-linear-regression-equation
 * http://www.exceluser.com/formulas/how-to-calculate-both-types-of-compound-growth-rates.html
 * https://www.excelfunctions.net/excel-logest-function.html
 * @param data 
 */
export default function logest(ys: number[]): number {
  const n = ys.length;
  const xValues = Array.from({ length: n }, (_, i) => i + 1);

  // calculate the logarithm of the y values
  const logYs = ys.map((y) => Math.log(y));

  // calculate the sums of the x, y, and x*y values
  const sumX = xValues.reduce((acc, x) => acc + x, 0);
  const sumY = logYs.reduce((acc, y) => acc + y, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * logYs[i], 0);

  // calculate the sums of the squared x values
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

  // calculate the slope and intercept of the linear regression line
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // calculate the growth rate from the slope
  const growthRate = Math.exp(slope);

  return growthRate;
}
