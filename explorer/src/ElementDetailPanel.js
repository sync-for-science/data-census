import React, { useEffect, useState } from "react";
import ElementMetrics from "./ElementMetrics";
import CodingTreeMap from "./CodingTreeMap";
import DateHeatMap from "./DateHeatMap";
import DatePrecision from "./DatePrecision";
import ReferenceTargets from "./ReferenceTargets";

function ElementDetailPanel({detailData, currentElement}) {

	const [elementDetailData, setElementDetailData] = useState();
	
	useEffect( () => {		
		setElementDetailData( detailData.filter( d => {
			return d.elementPath === currentElement.elementPath && 
				d.stratification === currentElement.stratification
		}))
	}, [detailData, currentElement])

	const hasCodingDetail = elementDetailData &&
		elementDetailData.find( d => d.detailType === "coding");

	const hasDateDetail = elementDetailData &&
		elementDetailData.find( d => d.detailType === "date");

	const hasReferenceDetail = elementDetailData &&
		elementDetailData.find( d => d.detailType === "reference");

	if (!elementDetailData || !currentElement) return <div></div>
	
	return <div>
		<ElementMetrics 
			element={currentElement}
			detailData={elementDetailData}
		/>
		{currentElement && hasCodingDetail && 
			<CodingTreeMap detailData={elementDetailData} />
		}
		{currentElement && hasDateDetail && <div>
			<DatePrecision detailData={elementDetailData} />
			<DateHeatMap data={elementDetailData} />
		</div>}
		{currentElement && hasReferenceDetail && <div>
			<ReferenceTargets detailData={elementDetailData} />
		</div>}

	</div>


}

export default ElementDetailPanel;