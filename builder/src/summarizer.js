const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const zlib = require('zlib');
const readline = require('readline');

const builder = require("./build-definitions");

//TODO: try to load this from definitions and fall back to hard coded list
//used to attempt to interpolate types of choice types (in extensions or if FHIR profiles are not provided)
const primitiveTypes = [
	"boolean", "integer", "string", "decimal", "uri", "url", 
	"canonical", "base64Binary", "instant", "date", "dateTime", 
	"time", "code", "oid", "id", "markdown", "unsignedInt", "positiveInt", "uuid"
]


function buildDefinitions(fhirDefPath) {
	if (!fhirDefPath) return {}
	const resourceProfiles = fs.readFileSync(path.join(fhirDefPath, "profiles-resources.json"), "utf-8");
	const typeProfiles =  fs.readFileSync(path.join(fhirDefPath, "profiles-types.json"), "utf-8");
	const resourceDefinitions = resourceProfiles ? builder.buildBundle(JSON.parse(resourceProfiles)) : {};
	const typeDefinitions = typeProfiles ? builder.buildBundle(JSON.parse(typeProfiles)) : {};
	return Object.assign(resourceDefinitions.definitions, typeDefinitions.definitions);
}


function pathToFhirType(path, definitions) {

	const [resourceType, ...pathSegments] = path.split(".");

	let pathDefinition;
	let typePath = [resourceType];
	pathSegments.forEach( (segment, i) => {

		if (segment[0] === "_")
			return pathDefinition = "primitiveType";

		//shortcut since add resource type to path for contained resources
		if (pathSegments[i-1] === "contained" && pathDefinition.type[0] === pathDefinition.type[0].toUpperCase())
			return typePath = [segment];

		pathDefinition = definitions[typePath.concat(segment).join(".")];
		if (!pathDefinition) return;

		if (pathDefinition.contentReference) {
			typePath = [pathDefinition.contentReference];
		} else if (pathDefinition.type !== "BackboneElement" && pathDefinition.type !== "Element" && pathDefinition.type[0] === pathDefinition.type[0].toUpperCase()) {
			typePath = [pathDefinition.type];
		} else {
			typePath = typePath.concat(segment);
		}

	});
	return pathDefinition;

}


function summarizeResource(resource, definitions={}, stratifyFn, summary={}, skipDetails=[]) {
	const resourceType = resource.resourceType;
	const stratification = stratifyFn ? stratifyFn(resource) : "unstratified";
	let elementPos = -1; //track relative position in case no fhir definition files

	const summarizeElement = (element, path, parentExtension, isArray) => {

		elementPos++;
		let fhirDefinition = pathToFhirType(path.join("."), definitions);
		let fhirType = fhirDefinition ? fhirDefinition.type : undefined;
		let pathString = path.join(".");

		//handle contained resources		
		if (fhirType === "Resource" && element.resourceType) {
			fhirType = element.resourceType;
			path = path.concat([element.resourceType]);
			pathString = path.join(".");
			fhirDefinition = pathToFhirType(path.join("."), definitions);
			isArray = false;
		}

		//try to impute date type - ignores dates without a day value
		if (!fhirType && _.isString(element) && /^\d{4}-\d{2}-\d{2}(T|$)/.test(element))
			fhirType = "date";
		
		//impute coding type - will treat some Quantities as Codings
		if (!fhirType && _.isObject(element) && element.code && element.system)
			fhirType = (element.value || element.unit || element.comparator)
				? "Quantity"
				: "Coding";

		//impute choice types
		elementName = _.last(path);
		if (!fhirType && elementName.indexOf("value") === 0 && elementName.length > 5) {
			fhirType = elementName.replace("value", "");
			//fix case on primitive types
			if (primitiveTypes.indexOf(fhirType[0].toLowerCase() + fhirType.slice(1)) > -1)
				fhirType = fhirType[0].toLowerCase() + fhirType.slice(1);
		}

		const addDetail = (name, detailStratification, detailText) => { 
			const currentCount = _.get(summary, ["detail", stratification, pathString, name, detailStratification, "count"], 0);
			_.set(summary, ["detail", stratification, pathString, name, detailStratification, "count"], currentCount+1);
			if (detailText) {
				const currentText = _.get(summary, ["detail", stratification, pathString, name, detailStratification, "text"], []);
				if (currentText.indexOf(detailText) === -1)
					_.set(summary, ["detail", stratification, pathString, name, detailStratification, "text"], currentText.concat(detailText));
			}
		}

		const markAsHasDetail = () => {
			_.set(summary,  ["summary", stratification, pathString, "hasDetail"], true);
		}

		const addDateDetail = (fromDate, toDate) => {
			const precision = ["Y", "m", "d", "H", "M", "S", "f", "z", "z", "z"][fromDate.split(/[-:.TZ]/g).length-1];
			addDetail("datePrecision", precision);

			const [fromYear, fromMonth] = fromDate.split("-");
			if (toDate) {
				const [toYear, toMonth] = toDate.split("-");
				const startMonth = fromMonth ? parseInt(fromMonth) : 1;
				const endMonth = toMonth ? parseInt(toMonth) : 12;
				for (let y = parseInt(fromYear); y<=parseInt(toYear); y++) {
					for (let m=1; m<=12; m++) {
						if ((y === fromYear && m >= startMonth) || (y === toYear && m <= endMonth) || y > fromYear && y < toYear) {
							addDetail("date", [y, m].join("-"));
						}
					}
				}
			} else if (fromMonth) {
				addDetail("date", [fromYear, fromMonth].join("-"));
				markAsHasDetail();
			} else {
				_.range(1, 13).map( month => addDetail("date", [fromYear, month].join("-")) );
			}

		}
		
		_.set(summary,  ["summary", stratification, pathString, "fhirType"], fhirType);
		const prevPosition = _.get(summary,  ["summary", stratification, pathString, "position"]);
		if (!prevPosition) {
			_.set(summary,  ["summary", stratification, pathString, "position"], 
				fhirDefinition ? fhirDefinition.pos : elementPos)
		}
	
		if (!isArray) {
			const currentCount = _.get(summary, ["summary", stratification, pathString, "count"], 0);
			_.set(summary,  ["summary", stratification, pathString, "count"], currentCount+1);
		}

		if (_.isArray(element)) {
			element.map( e => summarizeElement(e, path, parentExtension, true) );
			const currentInstanceCount = _.get(summary, ["summary", stratification, pathString, "instanceCount"], 0);
			_.set(summary,  ["summary", stratification, pathString, "instanceCount"], currentInstanceCount+element.length);
			return addDetail("instanceCount", element.length+"-items");
		}

		if ((fhirType === "Coding" || fhirType === "Quantity" || fhirType === "Identifier") && skipDetails.indexOf("coding") === -1) {
			const id = [element.system||"", element.code||""].join("|");
			addDetail("coding", id, element.display);
			markAsHasDetail();
		}

		if ((fhirType === "code") && skipDetails.indexOf("coding") === -1) {
			const parentDefinition = pathToFhirType(path.slice(0, path.length-1).join("."), definitions);
			if (!parentDefinition || ["Coding", "Quantity", "Identifier"].indexOf(parentDefinition.type) === -1) {
				addDetail("coding", "|" + element, element.display);
				markAsHasDetail();
			}
		}
	
		if (fhirType === "Period" && skipDetails.indexOf("date") === -1) {
			if (!element.start && element.end) {
				addDateDetail(element.end);
			} else if (!element.end && element.start) {
				addDateDetail(element.start);
			} else if (element.start && element.end) {
				addDateDetail(element.start, element.end);
			}
		}

		if ((fhirType === "date" || fhirType === "dateTime" || fhirType === "instant") && skipDetails.indexOf("date") === -1)
			addDateDetail(element);

		if (fhirType === "Reference" && skipDetails.indexOf("reference") === -1) {
			let targetType = element.type;
			//type, no url
			if (targetType && !element.reference) 
				targetType += " (No URL)";
			//type and contained
			if (targetType && element.reference && element.reference[0] === "#")
				targetType += " (Contained)";
			//no type, no url
			if (!targetType && !element.reference) 
				targetType = "No Resource URL";
			//no type, contained
			if (!targetType && element.reference && element.reference[0] === "#")
				targetType = "Contained Resource";
			//no type, url
			if (!targetType && element.reference) 
				targetType = element.reference.split("/")[element.reference.split("/").length-2];
			addDetail("reference", targetType);
			markAsHasDetail();
		}

		if (fhirType === "Address" && element.postalCode && skipDetails.indexOf("address") === -1) {
			//key can't be a number
			addDetail("postalCode", "zip-" + element.postalCode);
		}

		if (_.isObject(element)) return _.map(element, (v, k) => {
			let extensionUrl;
			if (fhirType === "Extension" || fhirType === "ModifierExtension") {
				extensionUrl = parentExtension && !element.url.indexOf("http")
					? parentExtension + "/" + element.url.replace(/^\/|\/$/g, "") 
					: element.url.replace(/^\/|\/$/g, "");
			}	
			const nextPath = extensionUrl ? path.concat("["+extensionUrl+"]", k) : path.concat(k);			
			summarizeElement(v, nextPath, extensionUrl) 
		})
	}

	summarizeElement(resource, [resourceType]);
	return (summary);

}

function flattenSummary(data) {
	let flatSummary = [];
	_.each( data.summary, (element, stratification) => {
		_.each( element, (values, elementPath) => {
			flatSummary.push({
				resourceType: elementPath.split(".")[0],
				stratification, 
				elementPath, ...values
			});
		})
	})
	let flatDetail = [];
	_.each( data.detail, (element, stratification) => {
		_.each( element, (detail, elementPath) => {
			_.each( detail, (detailContent, detailType) => {
				_.each( detailContent, (values, detailStratification) => {
					const text = values.text ? values.text.join(", ") : "";
					const count = values.count;
					flatDetail.push({
						resourceType: elementPath.split(".")[0],
						stratification,
						elementPath, detailType,
						detailStratification, text, count
					});
				})
			})
		})
	})

	return {summary: flatSummary, detail: flatDetail};
}

function summarizeBundle(filePath, definitions, stratifyFn, summary={}, skipDetails) {
	return new Promise( (resolve, reject) => {
		try {
			const data = JSON.parse( fs.readFileSync(filePath, "utf-8") );
			const resources = data.entry
				? data.entry.map( entry => entry.resource ).filter( resource => !!resource )
				: [data];
			resources.forEach( resource => {
				summarizeResource(resource, definitions, stratifyFn, summary, skipDetails);
			});
			resolve(summary);
		} catch(e) {
			reject(e);
		}
	});
}

function summarizeNDJSON(filePath, definitions, stratifyFn, summary={}, skipDetails) {
	return new Promise( (resolve, reject) => {
		const rs = fs.createReadStream(filePath);
		let lr;
		if (filePath.slice(filePath.length-3) === ".gz") {
			const gunzip = zlib.createGunzip();
			lr = readline.createInterface(rs.pipe(gunzip));
		} else {
			lr = readline.createInterface({input: rs});
		}
		lr.on('error', err => {
			lr.close();
			reject(err);
		});
		lr.on('line', line => {
			const resource = JSON.parse(line);
			summarizeResource(resource, definitions, stratifyFn, summary, skipDetails);
		});
		lr.on('close', () => resolve(summary) );
	});
}

module.exports = { pathToFhirType, summarizeResource, summarizeNDJSON, summarizeBundle, flattenSummary, buildDefinitions };