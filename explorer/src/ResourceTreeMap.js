import React from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import _ from "lodash";

function ResourceTreeMap({elementsList, currentResourceCategory, onCurrentResourceCategoryChange}) {

	const treeData = _.chain(elementsList)
		.filter( item => {
			return item.elementPath === item.resourceType;
		})
		.groupBy("resourceType")
		.value();
	let finalTree = {id: "Resources", children: []};
	_.forEach(treeData, (v, k) => {
		finalTree.children.push({
			id: k, 
			children: v.map( strat => {
				return {
					id: strat.stratification, 
					value: strat.count
				}
			}) 
		});
	});

	return <div style={{height: "600px"}}>
		<ResponsiveTreeMap
			data={finalTree}
			valueFormat=" >,"
			orientLabel={false}
			margin={{ top: 10, right: 2, bottom: 2, left: 2 }}
			colors={{scheme: "greens"}}
			label="id"
			theme={{
				labels: {text: {fontSize: "14px", fontWeight: "bold"}}
			}}
			labelTextColor="black"
			parentLabelTextColor="black"
			labelSkipSize={12}
			nodeOpacity={0.2}
		/>
	</div>


}

export default ResourceTreeMap;