import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Row, Col } from "react-bootstrap";


function ReferenceTargets({detailData}) {

	const [totalCount, setTotalCount] = useState();

	useEffect( () => {
		setTotalCount( 
			detailData.filter( d => d.detailType === "reference")
				.reduce( (acc, d) => acc + d.count, 0)
		);
	}, [detailData]);

	if (!totalCount) return null;

	const makePct = v => {
		const pct = (v/totalCount)*100;
		return pct < 1 ? "< 1%" : Math.round(pct)+"%";
	}

	detailData = _.chain(detailData)
		.filter( d => d.detailType === "reference" )
		.sortBy("count")
		.value();

	return <Row className="mb-4"><Col>
		<div className="p-2 shadow-sm bg-white rounded">
			<div className="mb-2 text-center text-secondary text-uppercase">reference targets</div>					
			<table><tbody>
				{ detailData.map( r => <tr key={r.detailStratification}><td>{r.detailStratification}</td><td>{makePct(r.count)}</td></tr>)}
			</tbody></table>			
			</div>
	</Col></Row>

}

export default ReferenceTargets;