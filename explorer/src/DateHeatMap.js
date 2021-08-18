import React, {useEffect, useState} from "react";
import _ from "lodash";
import { ResponsiveHeatMap } from "@nivo/heatmap"


function getYear(dateString) {
	const [year] = dateString.detailStratification.split("-");
	return parseInt(year);
}

function getYearBounds(data) {
	const years = data.map(getYear);
	return [_.minBy(years), _.max(years)];
}

function buildYearGroups(data, yearBounds, yearsPerGroup) {
	if (!yearsPerGroup) yearsPerGroup = 
		(yearBounds[1]-yearBounds[0]) >= 50 ? 10 : 5;

	const yearGroups = _.chunk(
		_.range(yearBounds[0], yearBounds[1]+1), yearsPerGroup
	);

	return yearGroups.map( yearGroup => {
		const range = _.first(yearGroup)+"-"+_.last(yearGroup);
		const count = yearGroup.reduce( (acc, targetYear) => {
			return acc + _.chain(data)
				.filter( d => getYear(d) === targetYear )
				.map( d => d.count ).sum().value() || 0;
		}, 0)
		return {range, count};
	})
}


function DateHeatMap({element, data, ...props}) {

	const monthNames = props.monthNames ||
		["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const [chartYearRange, setChartYearRange] = useState();
	const [summaryView, setSummaryView] = useState();

	useEffect( () => {
		const range = getYearBounds(data);
		setChartYearRange(range);
		setSummaryView(range[1]-range[0] > 10 ? "show" : "none")
	}, [data]);


	const showSummaryView = e => {
		setChartYearRange( getYearBounds(data) )
		setSummaryView("show");
		e.preventDefault();
	}

	const renderHeader = (legend, showLink) => {
		const link = <span> (<button className="btn btn-link p-0 " onClick={showSummaryView}>view all years</button>)</span>;
		return <div className="mb-2 text-center">
			<span className="text-secondary text-uppercase">Date Heatmap - {legend}</span>
			{showLink && link}
		</div>
	}		

	const renderSummaryView = (summaryData) => {
		return <div>
				{renderHeader("summary")}
				<div style={{height: summaryData.length*35}}>
				<ResponsiveHeatMap
					data={summaryData}
					keys={["count"]}
					indexBy="range"
					axisTop={null}
					axisLeft={{tickSize: 0, tickPadding: 10}}
					colors={["#edf8fb","#ccece6", "#99d8c9", "#66c2a4", "#2ca25f"]}
					theme={{
						labels: {text: {fontSize: "14px", fontWeight: "bold", fillOpacity : 1}},
						fontSize: "14px", fontWeight: "bold"
					}}
					margin={{ left: 100, right: 20, top: 10, bottom: 10 }}
					onClick={ cell => {
						if (cell.value === 0) return;
						const years = cell.yKey.split("-");
						setChartYearRange( [parseInt(years[0]), parseInt(years[1])] );
						setSummaryView("hide");
					}}
				/>
				</div>
			</div>
	};

	const renderDetailView = (detailData, hasSummaryView) => {
		const legend = `${chartYearRange[0]} - ${chartYearRange[1]}`;
		return <div>
			{ renderHeader(legend, hasSummaryView) }
			<div><div style={{height: detailData.length*50+50}}><ResponsiveHeatMap
				data={detailData}
				keys={monthNames}
				indexBy="year"
				colors={["#edf8fb","#ccece6", "#99d8c9", "#66c2a4", "#2ca25f"]}
				theme={{
					labels: {text: {fontSize: "14px", fontWeight: "bold", fillOpacity : 1}},
					fontSize: "14px", fontWeight: "bold"
				}}
				margin={{ top: 50, right: 60, bottom: 60, left: 60 }}
				axisLeft={{tickSize: 0, tickPadding: 10}}
				axisTop={{tickSize: 0, tickPadding: 10}}
				cellBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
				labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.8 ] ] }}
				hoverTarget="cell"
				animate={true}
			/></div></div>
		</div>
	}

	if (!chartYearRange) return null;
	
	if (summaryView === "show") {
		const summaryData = buildYearGroups(data, chartYearRange);
		return renderSummaryView(summaryData);
	} else {
		const detailData = _.chain(data).filter( d => {
			const year = getYear(d);
			return  year >= chartYearRange[0] && year <= chartYearRange[1]
		})
		.reduce( (acc, d) => {
			const [rawYear, rawMonth] = d.detailStratification.split("-");
			const month = monthNames[rawMonth-1];
			const year = parseInt(rawYear);
			acc[year] = acc[year] || {year};
			acc[year][month] = (acc[year][month]||0) + d.count
			return acc;
		}, {})
		.values().map( d => {
			return _.assign(...monthNames.map(n => ({[n]: 0})), d)
		})
		.value();
		return renderDetailView(detailData, summaryView === "hide")
	}

}

export default DateHeatMap;