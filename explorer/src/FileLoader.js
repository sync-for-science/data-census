import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone"
import { Button, Spinner, Alert } from "react-bootstrap";
import _ from "lodash";

const currentFileVersion = "1.0.0";

function FileLoader(props) {

	const [loading, setLoading] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const fileInput = useRef();

	const onFileLoaded = props.onFileLoaded;

	useEffect( () => {
		const dataUrl = getUrlParameter("data");
		if (!dataUrl) return;

		setLoading(true);
		setErrorMessage(null);

		fetch(dataUrl)
			.then( response => {
				if (!response.ok)
					throw new Error(`${dataUrl} - HTTP ${response.status} - ${response.statusText}`);				
				return response;
			})
			.then( data => data.text() )
			.then( data => {
				try {
					return JSON.parse(data);
				} catch (e) {
					throw new Error(`${dataUrl} is not a valid bulk data summary file`);
				}
			})
			.then( data => {
				const [elements, detail] = readData(data)
				if (onFileLoaded) 
					onFileLoaded(elements, detail);
			})
			.catch(e => {
				setErrorMessage(e.message);
				setLoading(false);
			});
	}, [onFileLoaded])

	function getUrlParameter(name) {
		name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(window.location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};
	
	const handleSelectFile = e => {
		e.preventDefault();
		fileInput.current.value = "";
		fileInput.current.click();
	}

	const handleFileSelected = e => {
		e.preventDefault();
		e.stopPropagation();
		if (e.target.files.length === 1)
			readFile(e.target.files[0]);
	}

	const readData = data => {
		const shortenExtensionUrl = url => url.indexOf("/") > -1 
			? "..." + url.match(/[^/]+(?=\/$|$)/) 
			: url;

		if (!data.summary || !data.detail || !_.isArray(data.summary) || !_.isArray(data.detail) || !data.version)
			throw new Error("Invalid file format");
		if (data.version !== currentFileVersion) throw new Error(`Version ${data.version} files are not supported`);

		let summaryData = _.map(data.summary, el => {

			const pathParts =  el.elementPath.split(/\.(?![^[]*\])/);
			
			const isExtensionUrl = pathParts[pathParts.length-1] === "url" && 
				pathParts[pathParts.length-2][0] === "[";
			
			//nest extension url under parent
			const level = pathParts.length - (isExtensionUrl ? 3 : 2);

			//remove brackets from extensions and add ... prefix to truncated urls;
			const display = isExtensionUrl
				? shortenExtensionUrl(pathParts[pathParts.length-2].replace(/\[|\]/g, ""))
				: pathParts[pathParts.length-1];

			//drop url element from extension url
			const elementPath = isExtensionUrl
				? pathParts.slice(0, pathParts.length-1).join(".")
				: el.elementPath;

			const parentPath = isExtensionUrl
				? pathParts.slice(0, pathParts.length-2).join(".")
				: pathParts.slice(0, pathParts.length-1).join(".");

			//push extensions to bottom
			let position = el.position;
			if (el.fhirType ===  "ModifierExtension") position = 2000;
			if (el.fhirType === "Extension") position = 3000;

			return {...el, parentPath, level, display, elementPath, position, rawPath: el.elementPath};
		});

		//interleave elements in hierarchy and add parent counts
		summaryData = _.orderBy(summaryData, ["level", "parentPath", "position"], ["asc", "asc", "desc"]);

		let orderedData = [];
		let parentIndex;
		_.forEach(summaryData, (el,i) => {
			if (el.level === -1) return orderedData.unshift(el); //resource has no parent
			if (!parentIndex || el.parentPath !== summaryData[i-1].parentPath || el.stratification !== summaryData[i-1].stratification) {
				parentIndex = _.findIndex(orderedData, d => d.elementPath === el.parentPath && d.stratification === el.stratification);
			}
			const parentCount = orderedData[parentIndex].instanceCount || orderedData[parentIndex].count || 0;
			orderedData.splice(parentIndex+1, 0, {...el, parentCount});
		});

		return [orderedData, data.detail];

	}

	const readFile = file => {
		const reader = new FileReader();
		setLoading(true);
		setErrorMessage(null);

		return new Promise( (resolve, reject) => {	
			reader.onload = e => resolve(reader.result);
			reader.onerror = e => reject(e);
			reader.readAsText(file);
		})
		.then( data => {
			try {
				return JSON.parse(data);
			} catch (e) {
				throw new Error("Error unable to parse file")
			}
		})
		.then( data => {
			const [elements, detail] = readData(data)
			if (props.onFileLoaded) 
				props.onFileLoaded(elements, detail);
		})
		.catch(e => {
			setErrorMessage(e.message);
			setLoading(false);
		});
	}
		
	return <div className="text-center">
		{ errorMessage && <Alert variant="danger" className="m-2 p-2 text-left">{errorMessage}</Alert> } 
		{ loading && <Spinner animation="border" role="status" className="m-5">
			<span className="sr-only">Loading...</span>
	  	</Spinner>}
		{ !loading && 
			<DropZone fileDropHandler={readFile}>
				<div>
					<input ref={fileInput}
						type="file" 
						style={{display: 'none'}}
						onChange={handleFileSelected}
						accept=".json, application/json"
					/>
					<Button className="mt-5" onClick={handleSelectFile}>Select File</Button>
					<div className="mt-2 pb-5">or drop file here</div>
				</div>
			</DropZone>
		}
	</div>
	
}

export default FileLoader;