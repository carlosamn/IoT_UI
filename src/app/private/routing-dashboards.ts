interface Dashboard {
	page: string;
	url: string;
	isActive?: boolean;
}

export const dashboards: Dashboard[] = [
	{
		page: 'Data',
		url: 'etd_dashboard'
	},
	{
		page: 'Map',
		url: 'devices/map'
	},
	{
		page: 'Custom',
		url: 'custom'
	},
	{
		page: 'Video',
		url: 'video/video'
	},
	{
		page: 'Pictures',
		url: 'pictures'
	},
	{
		page: 'Ohd',
		url: 'ohd'
	},
	{
		page: 'Sensor1',
		url: 'sensor1'
	},
	{
		page: 'Graph',
		url: 'graph'
	},
	{
		page: 'Sensors',
		url: 'etd_dashboard'
	},
	{
		page: 'Fl3 graph',
		url: 'fl3/graphs'
	}, 
	{
		page: 'Fl3 settings',
		url: 'fl3/settings'
	},
	{
		page: 'Fl3 reports',
		url: 'fl3/reports'
	},
	{
		page: 'Custom',
		url: 'custom'
	},
	{
		page: 'Pictures',
		url: 'pictures'
	},
	{
		page: 'QSO Main',
		url: 'qso/maindashboard'
	}, 
	{
		page: 'QSO Settings',
		url: 'qso/settings'
	},
	{
		page: 'QSO Fracview',
		url: 'qso/fracview'
	}
	, 
	{
		page: 'QSO Overview',
		url: 'qso/joboverview'
	},
	{
		page: 'QSO Realtime',
		url: 'qso/realtime'
	},
	{
		page: 'PIT Main',
		url: 'pit/mainPit'
	},
	{
		page: 'PIT Settings',
		url: 'pit/settingsPit'
	},
	{
		page: 'PIT Status',
		url: 'pit/statusPit'
	},
	{
		page: 'PIT Notes',
		url: 'pit/notesPit'
	},
	{
		page: 'PIT EFM',
		url: 'pit/pit'
	},

	{
		page: 'PIT2 Main',
		url: 'pit2/mainPit2'
	},
	{
		page: 'PIT2 Settings',
		url: 'pit2/settingsPit2'
	},
	{
		page: 'PIT2 Status',
		url: 'pit2/statusPit2'
	},
	{
		page: 'PIT2 Notes',
		url: 'pit2/notesPit2'
	},
	{
		page: 'PIT2 EFM',
		url: 'pit2/pit2'
	}
	
]