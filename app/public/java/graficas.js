$(function () {

	/* Dashboard content */
	$('#compositeline').sparkline('html', {
		lineColor: 'rgba(255, 255, 255, 0.6)',
		lineWidth: 2,
		spotColor: false,
		minSpotColor: false,
		maxSpotColor: false,
		highlightSpotColor: null,
		highlightLineColor: null,
		fillColor: 'rgba(255, 255, 255, 0.2)',
		chartRangeMin: 0,
		chartRangeMax: 20,
		width: '100%',
		height: 30,
		disableTooltips: true
	});
	$('#compositeline2').sparkline('html', {
		lineColor: 'rgba(255, 255, 255, 0.6)',
		lineWidth: 2,
		spotColor: false,
		minSpotColor: false,
		maxSpotColor: false,
		highlightSpotColor: null,
		highlightLineColor: null,
		fillColor: 'rgba(255, 255, 255, 0.2)',
		chartRangeMin: 0,
		chartRangeMax: 20,
		width: '100%',
		height: 30,
		disableTooltips: true
	});
	$('#compositeline3').sparkline('html', {
		lineColor: 'rgba(255, 255, 255, 0.6)',
		lineWidth: 2,
		spotColor: false,
		minSpotColor: false,
		maxSpotColor: false,
		highlightSpotColor: null,
		highlightLineColor: null,
		fillColor: 'rgba(255, 255, 255, 0.2)',
		chartRangeMin: 0,
		chartRangeMax: 30,
		width: '100%',
		height: 30,
		disableTooltips: true
	});
	$('#compositeline4').sparkline('html', {
		lineColor: 'rgba(255, 255, 255, 0.6)',
		lineWidth: 2,
		spotColor: false,
		minSpotColor: false,
		maxSpotColor: false,
		highlightSpotColor: null,
		highlightLineColor: null,
		fillColor: 'rgba(255, 255, 255, 0.2)',
		chartRangeMin: 0,
		chartRangeMax: 20,
		width: '100%',
		height: 30,
		disableTooltips: true
	});
	/* Dashboard content closed*/

	/*--- Apex (#spark1) ---*/
	var spark1 = {
		chart: {
			id: 'spark1',
			group: 'sparks',
			type: 'line',
			height: 38,
			responsive: 'true',
			sparkline: {
				enabled: true
			},
			dropShadow: {
				enabled: true,
				top: 1,
				left: 1,
				blur: 1,
				opacity: 0.1,
			}
		},
		series: [{
			data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21]
		}],
		stroke: {
			curve: 'smooth'
		},
		markers: {
			size: 0
		},
		grid: {
			padding: {
				top: 10,
				bottom: 10,
				left: 50
			}
		},
		colors: ['#0a9ae1'],
		stroke: {
			width: 2
		},
		tooltip: {
			x: {
				show: false,
				width: 1,
			},
			y: {
				title: {
					formatter: function formatter(val) {
						return '';
					}
				}
			}
		}
	}
	/*--- Apex (#spark1) closed ---*/

	/*--- Apex (#spark2) ---*/
	var spark2 = {
		chart: {
			id: 'spark2',
			group: 'sparks',
			type: 'line',
			height: 38,
			responsive: 'true',
			sparkline: {
				enabled: true
			},
			dropShadow: {
				enabled: true,
				top: 1,
				left: 1,
				blur: 1,
				opacity: 0.1,
			}
		},
		series: [{
			data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69]
		}],
		stroke: {
			curve: 'smooth'
		},
		grid: {
			padding: {
				top: 10,
				bottom: 10,
				left: 50
			}
		},
		markers: {
			size: 0
		},
		colors: ['#ff516e'],
		stroke: {
			width: 2
		},
		tooltip: {
			x: {
				show: false
			},
			y: {
				title: {
					formatter: function formatter(val) {
						return '';
					}
				}
			}
		}
	}
	/*--- Apex (#spark2) closed ---*/

	/*--- Apex (#spark3) ---*/
	var spark3 = {
		chart: {
			id: 'spark3',
			group: 'sparks',
			type: 'line',
			height: 38,
			responsive: 'true',
			sparkline: {
				enabled: true
			},
			dropShadow: {
				enabled: true,
				top: 1,
				left: 1,
				blur: 1,
				opacity: 0.1,
			}
		},
		series: [{
			data: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19]
		}],
		stroke: {
			curve: 'smooth'
		},
		markers: {
			size: 0
		},
		grid: {
			padding: {
				top: 10,
				bottom: 10,
				left: 50
			}
		},
		colors: ['#28b98a'],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		stroke: {
			width: 2
		},
		tooltip: {
			x: {
				show: false
			},
			y: {
				title: {
					formatter: function formatter(val) {
						return '';
					}
				}
			}
		}
	}
	/*--- Apex (#spark3) closed ---*/

	/*--- Apex (#spark4) ---*/

	var spark4 = {
		chart: {
			id: 'spark4',
			group: 'sparks',
			type: 'line',
			height: 38,
			responsive: 'true',
			sparkline: {
				enabled: true
			},
			dropShadow: {
				enabled: true,
				top: 1,
				left: 1,
				blur: 1,
				opacity: 0.1,
			}
		},
		series: [{
			data: [15, 75, 47, 65, 14, 32, 19, 54, 44, 61]
		}],
		stroke: {
			curve: 'smooth'
		},
		markers: {
			size: 0
		},
		grid: {
			padding: {
				top: 10,
				bottom: 10,
				left: 50
			}
		},
		colors: ['#f48846'],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		stroke: {
			width: 2
		},
		tooltip: {
			x: {
				show: false
			},
			y: {
				title: {
					formatter: function formatter(val) {
						return '';
					}
				}
			}
		}
	}
	/*--- Apex (#spark4) closed ---*/

	/*--- Apex (#spark5) ---*/
	var spark5 = {
		chart: {
			id: 'spark5',
			group: 'sparks',
			type: 'line',
			height: 38,
			responsive: 'true',
			sparkline: {
				enabled: true
			},
			dropShadow: {
				enabled: true,
				top: 1,
				left: 1,
				blur: 1,
				opacity: 0.1,
			}
		},
		series: [{
			data: [12, 25, 76, 35, 17, 43, 10, 26, 69, 31]
		}],
		stroke: {
			curve: 'smooth'
		},
		markers: {
			size: 0
		},
		grid: {
			padding: {
				top: 10,
				bottom: 10,
				left: 50
			}
		},
		colors: ['#673ab7'],
		xaxis: {
			crosshairs: {
				width: 1
			},
		},
		stroke: {
			width: 2
		},
		tooltip: {
			x: {
				show: false
			},
			y: {
				title: {
					formatter: function formatter(val) {
						return '';
					}
				}
			}
		}
	}


	/*new ApexCharts(document.querySelector("#spark1"), spark1).render();
	new ApexCharts(document.querySelector("#spark2"), spark2).render();
	new ApexCharts(document.querySelector("#spark3"), spark3).render();
	new ApexCharts(document.querySelector("#spark4"), spark4).render();
	new ApexCharts(document.querySelector("#spark5"), spark5).render();*/

	/*--- Apex (#spark5) closed ---*/

});


/*--- Map ---*/
function vectormap() {

	document.querySelector('#vmap12').innerHTML = ""
	$('#vmap12').vectorMap({
		map: 'usa_en',
		showTooltip: true,
		backgroundColor: '#fff',
		color: myVarVal,
		colors: {
			mo: 'rgba(247,165,86,1)',
			fl: hexToRgba(myVarVal,0.6),
			or: 'rgba(249,58,90,1)',
			ca: hexToRgba(myVarVal,0.5),
			tx: 'rgba(247,165,86,1)',
			wy: hexToRgba(myVarVal,0.4),
			ny: 'rgba(249,58,90,1)',
		},
		hoverColor: '#222',
		enableZoom: false,
		borderWidth: 1,
		borderColor: '#fff',
		hoverOpacity: .85
	});
}
