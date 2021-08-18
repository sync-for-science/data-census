import React, {useEffect, useState} from "react";
import { Dropdown, Badge } from "react-bootstrap";
import _ from "lodash";

function ResourceSelector({data, currentResourceCategory, onSelect}) {

	const [categories, setCategories] = useState([]);

	useEffect( () => {
		const resourceData = _.chain(data)
			.filter( item => {
				return item.elementPath === item.resourceType;
			})
			.sortBy(["resourceType", "stratification"])
			.value();
		setCategories(resourceData);
	}, [data])

	const addCommas = num => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const buildResourceTitle = (resourceType, stratification) => {
		return resourceType + (stratification !== "unstratified" ? " (" + stratification + ")" : ""); 
	}

	const handleResourceSelect = e => {
		e.preventDefault();
		if (onSelect)
			onSelect(categories[e.currentTarget.id]);
	}

	const renderDropDownCategory = (item, i) => {
		const title = buildResourceTitle(item.resourceType, item.stratification);
		return <Dropdown.Item 
			active={currentResourceCategory && 
				item.resourceType === currentResourceCategory.resourceType && 
				item.stratification === currentResourceCategory.stratification
			}
			href="#" key={title} 
			className="d-flex" id={i} 
			onClick={handleResourceSelect}>
			<div>{title}</div>
			<div className="ml-auto pl-4"><Badge variant="light" pill>{addCommas(item.count)}</Badge></div>
		</Dropdown.Item>
	}

	const getCurrentResourceTitle = () => {
		if (!currentResourceCategory || !categories) return;
		const cat = categories.find( c => {
			return c.stratification === currentResourceCategory.stratification && 
				c.resourceType === currentResourceCategory.resourceType
		});
		return buildResourceTitle(cat.resourceType, cat.stratification);
	}

	return <div>
		<Dropdown>
			<Dropdown.Toggle variant="outline-primary" className="">
				{getCurrentResourceTitle() || "Select Resource"}
			</Dropdown.Toggle>
			<Dropdown.Menu popperConfig={{strategy: "fixed"}}>
				{ categories.map(renderDropDownCategory) }
			</Dropdown.Menu>
		</Dropdown>
	</div>


}

export default ResourceSelector;