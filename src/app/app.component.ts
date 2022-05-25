import { Component, OnInit, ViewChild } from '@angular/core';
import { FlexmonsterPivot } from 'ng-flexmonster';
import * as Highcharts from 'highcharts';
// Importing Flexmonster's connector for Highcharts
import 'flexmonster/lib/flexmonster.highcharts.js';
import * as Flexmonster from 'flexmonster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  @ViewChild('pivot') pivot!: FlexmonsterPivot;
  pivotReport: {
    dataSource: {
        type: 'api',
        url: 'http://localhost:9204/mongo',
        index: 'fm-product-sales',
        mapping: {
        Quantity: {
          type: 'number'
        },
        Price: {
          type: 'number'
        },
        'Retail Category': {
          type: 'string'
        },
        Sales: {
          type: 'number'
        },
        'Order Date': {
          type: 'year/quarter/month/day'
        },
        Date: {
          type: 'date'
        },
        Status: {
          type: 'string'
        },
        'Product Code': {
          type: 'string'
        },
        Phone: {
          type: 'string'
        },
        Country: {
          type: 'string',
          folder: 'Location'
        },
        City: {
          type: 'string',
          folder: 'Location'
        },
        CurrencyID: {
          type: 'property',
          hierarchy: 'Country'
        },
        'Contact Last Name': {
          type: 'string'
        },
        'Contact First Name': {
          type: 'string'
        },
        'Deal Size': {
          type: 'string'
        }
      }
    },
    slice: {
      rows: [
        {
          uniqueName: 'Country',
          filter: {
            members: [
              'country.[australia]',
              'country.[usa]',
              'country.[japan]'
            ]
          }
        },
        {
          uniqueName: 'Status'
        }
      ],
      columns: [
        {
          uniqueName: 'Order Date'
        },
        {
          uniqueName: '[Measures]'
        }
      ],
      measures: [
        {
          uniqueName: 'Price',
          aggregation: 'sum',
          format: '-13w0a1w1c23j00'
        }
      ],
      sorting: {
        column: {
          type: 'desc',
          tuple: [],
          measure: {
            uniqueName: 'Price',
            aggregation: 'sum'
          }
        }
      },
      expands: {
        rows: [
          {
            tuple: [
              'country.[japan]'
            ]
          }
        ]
      },
      drills: {
        columns: [
          {
            tuple: [
              'order date.[2019]'
            ]
          }
        ]
      },
      flatSort: [
        {
          uniqueName: 'Price',
          sort: 'desc'
        }
      ]
    },
    conditions: [
      {
        formula: '#value > 35000',
        isTotal: true,
        measure: 'Price',
        format: {
          backgroundColor: '#00A45A',
          color: '#FFFFFF',
          fontFamily: 'Arial',
          fontSize: '12px'
        }
      },
      {
        formula: '#value < 2000',
        isTotal: false,
        measure: 'Price',
        format: {
          backgroundColor: '#df3800',
          color: '#FFFFFF',
          fontFamily: 'Arial',
          fontSize: '12px'
        }
      }
    ],
    formats: [
      {
        name: '-13w0a1w1c23j00',
        thousandsSeparator: ' ',
        decimalSeparator: '.',
        decimalPlaces: 0,
        currencySymbol: '$',
        positiveCurrencyFormat: '$1',
        nullValue: '-',
        textAlign: 'right',
        isPercent: false
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

  drawChart() {
    this.pivot.flexmonster.highcharts?.getData(
      {
        type: 'area',
      },
      (data: Flexmonster.GetDataValueObject) => {
        Highcharts.chart('highcharts-container', data as Highcharts.Options);
      },
      (data: Flexmonster.GetDataValueObject) => {
        Highcharts.chart('highcharts-container', data as Highcharts.Options);
      }
    );
  }

  onReportComplete() {
    this.pivot.flexmonster.off('reportcomplete');
    this.drawChart();
  }

}
