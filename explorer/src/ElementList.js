import React from "react";
import _ from "lodash";

function ElementList({data, ...props}) {

	const handleClick = e => {
		if (props.onSelect) props.onSelect(e.currentTarget.id)
		e.preventDefault();
	}

	const renderElement = (el, i) => {
		if (el.level === -1) return;

		const prevLevel = (data[i-1] && data[i-1].level);
		const nextLevel = (data[i+1] && data[i+1].level);
		
		const pct = (el.count/el.parentCount||0)*100;
		const parentTitle = (el.level === 0) ? "resource" : "parent";
		return <tr key={el.elementPath} id={el.elementPath} 
			className={el.elementPath === props.selectedElement ? "element element-selected" : "element"}
			onClick={handleClick}
		>
			<td><div title={`${Math.round(pct)}% of ${parentTitle}`} className="element-pct">
				<div style={{width: Math.round(100-pct)+"%"}} className="element-pct-bar"></div>
			</div></td>
			<td className="d-flex">
				{(_.range(1, el.level+1)).map( level => {
					let classes = ["element-level"];
					if (level > prevLevel) classes.push("element-level-first");
					if (level > nextLevel) classes.push("element-level-last");
					return <div key={level} 
						className={classes.join(" ")}></div>
				})}
				<div className="element-name-outer">
					<button className="element-name btn btn-link p-0" title={el.elementPath}>{el.display}</button>
				</div>
			</td>
			<td className="element-type">{el.fhirType}{el.instanceCount !== undefined ? "[ ]" : ""}</td>
		</tr>
	}

	return <table className="my-2">
		<thead className="font-weight-bold"><tr style={{borderBottom: "1px solid grey"}}>
			<td className="text-center py-2">%</td><td>name</td><td>type</td>
		</tr></thead>
		<tbody>
		{data.map(renderElement)}
	</tbody></table>


}

export default ElementList;