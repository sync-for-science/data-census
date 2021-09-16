import React, {useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import _ from "lodash";

function ElementMetrics({element, detailData}) {

	const [instanceMetrics, setInstanceMetrics] = useState();

	useEffect( () => {
		const instanceCountToRange = instanceCounts => {
			const minValue = _.minBy(instanceCounts, "items");
			const maxValue = _.maxBy(instanceCounts, "items");
			const totalCount = _.sumBy(instanceCounts, "count");
			let medianValue;
			let medianCount = 0;
			instanceCounts.forEach( (c, i) => {
				if (medianValue !== undefined) return;
	
				if (medianCount+c.count > totalCount/2) {
					medianValue = c.items;
				} else if (medianCount+c.count === totalCount/2) {
					medianValue = (c.items + instanceCounts[i+1].items)/2
				} else {
					medianCount = medianCount + c.count;
				}
			})
			return {
				max: maxValue ? maxValue.items : 0,
				min: minValue ? minValue.items : 0,
				median: medianValue, 
				count: totalCount
			};
		}
	
		const instanceCounts = _.chain(detailData)
			.filter( d => d.detailType === "instanceCount" )
			.map( d => {
				const items = parseInt(d.detailStratification.split("-")[0]);
				return {items, count: d.count}
			})
			.sortBy("items")
			.value()

		if (instanceCounts.length) {
			const metrics = instanceCountToRange(instanceCounts);
			setInstanceMetrics(metrics)
		} else {
			setInstanceMetrics();
		}

	}, [detailData, element]);

	const addCommas = num => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const pct = Math.round((element.count/element.parentCount)*100);
	const hasRange = instanceMetrics && instanceMetrics.min !== instanceMetrics.max;

	return <div>

		<Row className="mb-4">
			<Col>
				<div className="p-2 shadow-sm bg-white rounded">
					<div className="mb-2 text-center text-secondary text-uppercase">populated</div>					
					<div className="d-flex justify-content-center">
						<div className="mr-5">
							<h2 className="mb-0" style={{color: "#059669", fontWeight: 700}}>{pct === 0 ? "< 1" : pct}%</h2>
							<div>of parents</div>
						</div>
						<div>
							<h2 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
								{ addCommas(element.count) }
							</h2>
							<div>elements</div>
						</div>
					</div>
				</div>
			</Col>
			
			{instanceMetrics && <Col>
				<div className="p-2 shadow-sm bg-white rounded" style={{backgroundColor: "white"}}>
				<div className="mb-2 text-center text-secondary text-uppercase">instances</div>					
					<div className="d-flex justify-content-center">
						<div className="mr-5">
							<h2 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
								{ addCommas(element.instanceCount || 0) }
							</h2>
							<div>count</div>
						</div>
						<div>
							<h2 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
								<span>{ addCommas(instanceMetrics.median) }</span>
								{hasRange && 
									<span style={{fontSize: "50%"}}> (range of {instanceMetrics.min}-{instanceMetrics.max})</span>
								}
							</h2>
							<div>{hasRange ? "median " : ""}per parent</div>
						</div>
					</div>
				</div>
			</Col>}
		</Row>

	</div>
	
}

export default ElementMetrics;