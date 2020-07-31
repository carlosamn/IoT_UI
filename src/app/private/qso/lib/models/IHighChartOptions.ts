export interface IHighChartOptions {
  title: {
    text: string
  };
  xAxis: {
    title: {
      text: string
    }
  };
  yAxis: {
    title: {
      text: string
    }
  };
  time: {
    useUTC: boolean
  };
  rangeSelector: {
    inputEnabled: boolean,
    selected: number,
    buttons: any[]
  };
  series: any[];
}
