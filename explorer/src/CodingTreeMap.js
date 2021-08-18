import React from "react";
import { Form } from "react-bootstrap";
import { ResponsiveTreeMap } from "@nivo/treemap";
import _ from "lodash";

class CodingTreeMap extends React.Component {
	
	constructor(props) {
		super();
		this.updateTextFilter = _.debounce( () => {
			this.setState({appliedTextFilter: this.state.filterText});
		}, 1000).bind(this);
		this.state = this.resetData(props.detailData);	
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps && (this.props.detailData !== prevProps.detailData))
			this.setState( this.resetData(this.props.detailData) );

		if (prevState && (
			prevState.appliedTextFilter !== this.state.appliedTextFilter || prevState.subsetFilter !== this.state.subsetFilter)
		) {
			let data = this.state.data; 
			if (this.state.subsetFilter !== "all")
				data = this.filterByCount(data, 25, this.state.subsetFilter === "uncommon");
			if (this.state.appliedTextFilter)
				data = this.filterByText(data, this.state.appliedTextFilter);
			this.setState({displayData: data});
		}
	}

	resetData(detailData) {
		const data = detailData.filter( d => d.detailType === "coding");
		return { 
			data,
			displayData: data,
			appliedTextFilter: "",
			filterText: "",
			subsetFilter: "all", countType: "resource"
		};
	}

	buildTooltip(node) {
		const addCommas = num => {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		const title = node.id.split("|")[1] 
			? node.id.split("|")[1]
			: node.id;
		const text = (node.data.text||"") !== title
			? (node.data.text||"").split("\n").reduce( (result, item) => <>{result}<br/>{item}</>)
			: "";
		return <>
			{title}: <b>{addCommas(node.value)}</b>
			{text && <br/>}
			{text}
		</>
	}

	dataToTree(flatData) {
		const groupableData = _.map(flatData, d => {
			const id = d.detailStratification
			const [system, code] = id.split("|");
			return {system: system || "No System", id, code, text: d.text, value: d.count};
		});
		let finalTree = {id: "Codings", children: []};
		const systems = _.chain(groupableData).uniqBy("system").map("system").value();
		_.each(systems, system => {
			finalTree.children.push({
				id: system,
				children: groupableData.filter( d => d.system === system )
			})
		});
		return finalTree;
	}

	filterByCount(flatData, subsetSize, uncommon) {
		return _.chain(flatData)
			.orderBy("count", uncommon ? "desc" : "asc")
			.slice(0, subsetSize)
			.value();
	}

	filterByText(data, text) {
		if (!text) return data;
		return data.filter( item => {
			return item.detailStratification.toUpperCase().indexOf(text.toUpperCase()) > -1 ||
				(item.text||"").toUpperCase().indexOf(text.toUpperCase()) > -1;
		})
	}

	handleTextChange(e) {
		this.setState({filterText: e.target.value});
		this.updateTextFilter();
	}

	handleSubsetChange(value) {
		this.setState({subsetFilter: value});
	}
	
	render() {
		let data = this.state.displayData;
	
		return <div className="p-4 shadow-sm p-3 mb-5 bg-white rounded" style={{backgroundColor: "white"}}>

			<div className="mb-4">
				<span>Show: </span>
				<Form.Check inline
					checked={this.state.subsetFilter === "all"}
					onChange={this.handleSubsetChange.bind(this, "all")}
					label="all codes"
					type="radio"
					id="count-filter-all"
				/>
				<Form.Check inline
					checked={this.state.subsetFilter === "common"}
					onChange={this.handleSubsetChange.bind(this, "common")}
					label="most common codes (25)"
					type="radio"
					id="count-filter-common"
				/>
				<Form.Check inline
					checked={this.state.subsetFilter === "uncommon"}
					onChange={this.handleSubsetChange.bind(this, "uncommon")}
					label="least common codes (25)"
					type="radio"
					id="count-filter-uncommon"
				/>
			</div>

			<Form.Control className="mb-4" placeholder="search..." 
				value={this.state.filterText||""} onChange={this.handleTextChange.bind(this)}
			/>

			<div style={{height: "600px"}}>
				<ResponsiveTreeMap
					data={this.dataToTree(data)}
					valueFormat=" >,"
					orientLabel={false}
					margin={{ top: 10, right: 2, bottom: 2, left: 2 }}
					colors={{scheme: "greens"}}
					label={ (node => node.data.code) }
					theme={{
						labels: {text: {fontSize: "14px", fontWeight: "bold"}}
					}}
					labelTextColor="black"
					parentLabelTextColor="black"
					labelSkipSize={12}
					nodeOpacity={0.2}
					tooltip={( ({node}) => <div>{this.buildTooltip(node)}</div> )}
				/>
			</div>

		</div>
	}


}

export default CodingTreeMap;