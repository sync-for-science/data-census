import './App.css';
import React, {useState} from "react";
import _ from "lodash";
import ElementPanel from './ElementPanel';
import ElementDetailPanel from "./ElementDetailPanel";
import FileLoader from "./FileLoader";
import { ReactComponent as Logo } from './bulb.svg';

function App() {

	const [elementsList, setElementsList] = useState();
	const [elementsDetail, setElementsDetail] = useState();
	const [currentElement, setCurrentElement] = useState();
	const [currentResourceCategory, setCurrentResourceCategory] = useState();

	const handleFileLoaded = (elements, detail) => {
			setElementsList(elements);
			setElementsDetail(detail);
			const categories = _.chain(elements)
				.filter( item => {
					return item.elementPath === item.resourceType;
				}).value();
			if (categories.length === 1) 
				setCurrentResourceCategory(categories[0])
	}

	return <div className="h-100 d-flex flex-column">

		<div className="flex-shrink-0 py-3 px-4 text-white" style={{background: "#059669"}}>
			<div className="d-flex align-items-center">
				<Logo style={{fill: "white", height: "1.8em"}} className="mr-2" />
				<h4 className="mb-0">FHIR DATA CENSUS</h4>
			</div>
		</div>

		{ !elementsList && <FileLoader onFileLoaded={handleFileLoaded} />}


		{ elementsList && 

			<div className="flex-grow-1 d-flex " style={{height: "1px"}}>

				<div className="p-4 flex-shrink-0" style={{overflowY: "auto"}}>
					<ElementPanel
						elementsList={elementsList}
						currentResourceCategory={currentResourceCategory}
						onCurrentElementChange={setCurrentElement}
						onCurrentResourceCategoryChange={setCurrentResourceCategory}
					/>
				</div>

				{currentElement && <div className="p-4 flex-grow-1 bg-light" style={{overflowY: "auto", borderLeft: "1px solid #dadce0"}}>
					<ElementDetailPanel 
						currentElement={currentElement}
						detailData={elementsDetail}
					/>
				</div>}

			</div>

		}

	</div>
	
}

export default App;