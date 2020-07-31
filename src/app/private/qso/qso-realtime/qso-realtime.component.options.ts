import { IColorGamma } from "../../../common/models/color-gamma";
/**
 * -----------------------------------------------
 * -- QSO HighChart Settings Options Generator ---
 * -----------------------------------------------
 */
export class HighChartOptions {

  // Properties
  private pTitle: string;
  private pPath: any;
  private pXAxisTitle: string;
  private pYAxisTitle: string;
  private pUseUTC: boolean;

  private pColors: IColorGamma[];

  private pRangeSelectorButtons: any[];
  private pRangeSelectorInputEnable: boolean;
  private pRangeSelectorSelected: number;

  private pSeries: any[];



  // Constructor ()
  constructor() {

    // Default Properties

    this.pTitle = 'High Chart Settings Dahboard';

    this.pPath = {};

    this.pXAxisTitle = 'X Axis';
    this.pYAxisTitle = 'Y Axis';

    this.pUseUTC = true;

    this.pColors = [];

    this.pRangeSelectorInputEnable = false;
    this.pRangeSelectorSelected = 0;
    this.pRangeSelectorButtons = [{
      count: 1,
      type: 'minute',
      text: '1M',
      events: {
        click: () => { }
      }
    }, {
      count: 5,
      type: 'minute',
      text: '5M',
      events: {
        click: () => { }
      }
    }, {
      count: 10,
      type: 'minute',
      text: '10M',
      events: {
        click: () => { }
      }
    }, {
      type: 'all',
      text: 'All',
      events: {
        click: () => { }
      }
    }];

    this.pSeries = [{ name: '', data: [] }];

  }


  // Methods
  setTitle(title: string) { this.pTitle = title; }
  getTitle() { return this.pTitle; }

  getPath() { return this.pPath; }
  setPath(path) {
    this.pPath = path;
  }
  setXAxisTitle(title: string) { this.pXAxisTitle = title; }
  getXAxisTitle() { return this.pXAxisTitle; }

  setYAxisTitle(title: string) { this.pYAxisTitle = title; }
  getYAxisTitle() { return this.pYAxisTitle; }

  setColors(colors: IColorGamma[]) {
    this.pColors = colors;
  }
  getColots(): IColorGamma[] {
    return this.pColors;
  }

  setSeriesData(series: any[]) {
    this.pSeries = series;
  }
  getSeriesData() {
    return this.pSeries;
  }

  setSensors(sensors: any) {

    let pSeries, _pSeries;
    pSeries = [];

    for (let k = 0; k < sensors.length; k++) {
      for (let j = 0; j < 3; j++) {
        const _id = sensors[k].location.id + ':' + sensors[k].channels[j].id;
        _pSeries = {
          id: _id,
          stage: sensors[k].layout.containerIndex,
          channel: sensors[k].channels[j].id,
          location: {
            description: sensors[k].location.description,
            id: _id.split(':')[0]
          },
          name: sensors[k].location.description + ' Channel : ' + sensors[k].channels[j].id,
          data: []
        };
        pSeries.push(_pSeries);
      }
    }
    this.setSeriesData(pSeries);
  }


  getOptions() {
    return {
      title: {
        text: this.pTitle
      },
      chart: {
        height: '650px'
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
        usePreAllocated: true
      },
      zoomType: 'xy',
      xAxis: {
        title: {
          text: this.pXAxisTitle
        },
        ordinal: false
      },
      yAxis: {
        title: {
          text: this.pYAxisTitle
        }
      },
      time: {
        useUTC: this.pUseUTC
      },
      rangeSelector: {
        inputEnabled: this.pRangeSelectorInputEnable,
        selected: this.pRangeSelectorSelected,
        buttons: this.pRangeSelectorButtons
      },
      navigator: {
        enabled: true
      },
      scrollbar: {
        enabled: false
      },
      series: this.pSeries
    };
  }


  setInitData(initData) {

    if (initData['rtgraph']) {
      const rtgraph = initData.rtgraph;
      const locations = rtgraph.locationIds;
      const locations_ids = Object.keys(locations);
      const locations_values = Object.values(locations);
      const locations_data = [];

      locations_values.map((data, k) => {

        const timestamps = data['epochTimestmaps'];
        const values = Object.values(data['dataPoints']);

        let channel0 = [];
        let channel1 = [];
        let channel2 = [];

        timestamps.map((kTimestamp, k) => {
          channel0.push([
            1000 * kTimestamp,
            parseFloat(values[0][k])
          ]);
          channel1.push([
            1000 * kTimestamp,
            parseFloat(values[1][k])
          ]);
          channel2.push([
            1000 * kTimestamp,
            parseFloat(values[2][k])
          ]);
        });

        const channels = [
          channel0,
          channel1,
          channel2
        ];

        locations_data.push({
          id: locations_ids[k] + ':0',
          points: channel0
        });

        locations_data.push({
          id: locations_ids[k] + ':1',
          points: channel1
        });

        locations_data.push({
          id: locations_ids[k] + ':2',
          points: channel2
        });

      });

      this.pSeries.map(serie => {
        locations_data.map(initSerie => {
          if (initSerie.id === serie.id) {

            for (let kData = 0; kData < 120; kData++) {
              serie.data.push(initSerie.points[kData]);
            }

          }
        });
      });

      this.pSeries.map(serie => serie.data.sort(function (a, b) { return a[0] - b[0]; }));
    } else {

    }

  }




}
