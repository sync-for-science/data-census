import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Row, Col } from "react-bootstrap";


function DatePrecision({detailData}) {

	const [counts, setCounts] = useState();

	useEffect( () => {
		const precisions = ["Y", "m", "d", "H", "M", "S", "f", "z", "z", "z"];
		const newCounts = _.reduce( detailData, (acc, d) => {
			const precision = precisions.indexOf(d.detailStratification);
			if (precision === -1) return acc;
			return {
				year: (acc.year||0) + (precision >= 0 ? d.count : 0),
				month: (acc.month||0) + (precision >= 1 ? d.count : 0),
				day: (acc.day||0) + (precision >= 2 ? d.count : 0),
				time: (acc.time||0) + (precision >= 3 ? d.count : 0),
				timezone: (acc.timezone||0) + (precision >= 7 ? d.count : 0),
			}
		}, {})
		setCounts(newCounts);
	}, [detailData]);

	if (!counts) return null;
	
	const makePct = v => {
		const pct = (v/counts.year)*100;
		return pct < 1 ? "< 1%" : Math.round(pct)+"%";
	}

	return <Row className="mb-4"><Col>
		<div className="p-2 shadow-sm bg-white rounded">
			<div className="mb-2 text-center text-secondary text-uppercase">date precision</div>					
			<div className="d-flex justify-content-center">
				<div className="mr-4">
					<h4 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
						{makePct(counts.year)}
					</h4>
					<div>year</div>
				</div>
				<div className="mr-4">
					<h4 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
						{makePct(counts.month)}
					</h4>
					<div>month</div>
				</div>
				<div className="mr-4">
					<h4 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
						{makePct(counts.day)}
					</h4>
					<div>day</div>
				</div>
				<div className="mr-4">
					<h4 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
						{makePct(counts.time)}
					</h4>
					<div>time</div>
				</div>
				<div className="mr-4">
					<h4 className="mb-0" style={{color: "#059669", fontWeight: 700}}>
						{makePct(counts.timezone)}
					</h4>
					<div>timezone</div>
				</div>
			</div>
		</div>
	</Col></Row>

}

export default DatePrecision;