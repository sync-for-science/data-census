import React, { useEffect, useState } from "react";
import ResourceSelector from "./ResourceSelector";
import ElementList from './ElementList';


function ElementPanel({elementsList, currentResourceCategory, onCurrentElementChange, onCurrentResourceCategoryChange}) {

	const [currentElementPath, setCurrentElementPath] = useState();
	const [filteredElements, setFilteredElements] = useState([]);

	useEffect( () => {
		if (!elementsList || !currentResourceCategory) return;
		setFilteredElements( elementsList.filter( el => {
			return el.stratification === currentResourceCategory.stratification && 
				el.resourceType === currentResourceCategory.resourceType
		}));
	}, [elementsList, currentResourceCategory])

	const handleElementSelect = (elementPath) => {
		setCurrentElementPath(elementPath);
		if (onCurrentElementChange) {
			onCurrentElementChange(
				elementsList.find( el => {
					return el.elementPath === elementPath && 
						el.stratification === (currentResourceCategory && currentResourceCategory.stratification) 
				})
			);
		}
	}

	const handleCategoryChange = category => {
		onCurrentResourceCategoryChange(category);
		handleElementSelect(null)
	}

	return <div>
		<ResourceSelector
			data={elementsList}
			onSelect={handleCategoryChange}
			currentResourceCategory={currentResourceCategory}
		/>
		{filteredElements.length > 0 && currentResourceCategory && 
			<ElementList 
				data={filteredElements} 
				selectedElement={currentElementPath} 
				onSelect={handleElementSelect}
			/>
		}
	</div>
	
}

export default ElementPanel;