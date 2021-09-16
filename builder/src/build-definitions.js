const buildBundle = (bundle) => {
	let definitions = {};
	let resourceNames = [];

	bundle.entry
		.filter( entry =>  entry.resource.resourceType == "StructureDefinition")
		.forEach( sd => {
			if (sd.resource.kind !== "complex-type" && sd.resource.kind !== "datatype" && sd.resource.kind !== "resource") return;

			//ignore profiled types (eg. SimpleQuantity) since will build the Quantity schema
			if (sd.resource.name !== sd.resource.type && sd.resource.type) return;

			if (sd.resource.kind === "resource") {
				resourceNames.push(sd.resource.name);
				//resourceType doesn't seem to be a field anywhere?
				definitions[sd.resource.name + ".resourceType"] = {type: "string", pos: 0};
			}

			sd.resource.snapshot.element.forEach( (elem, pos) => {

				if (!elem.type && elem.contentReference) {
					definitions[elem.path] = {
						pos,
						type: "ContentReference", 
						isArray: elem.max !== "1" && elem.max !== "0", 
						contentReference: elem.contentReference.slice(1)
					}
				}

				elem.type && elem.type.length && elem.type.forEach( type => {
					const path = elem.type.length === 1
						? elem.path
						: elem.path.replace("[x]", type.code[0].toUpperCase() + type.code.slice(1));
					const typeExtension = type.extension && 
						type.extension.find( ext => ext.url === "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type");
					const outputType = typeExtension
						? typeExtension.valueUrl
						: type.code === "http://hl7.org/fhirpath/System.String" ? "string" : type.code;
					const isArray =  elem.max !== "1" && elem.max !== "0";
					const referenceTargets = type.targetProfile &&
						type.targetProfile.map( profile => profile.split("/")[profile.split("/").length-1] );
					const choiceType = elem.path.indexOf("[x]") > -1 ? elem.path : undefined;
					definitions[path] = {type: outputType, isArray, referenceTargets, pos, choiceType};
				});
			});
		});
	return {definitions, resourceNames};
}

module.exports = {buildBundle}