const fhirpath = require("fhirpath");

const expressions = [{
	name: "obs_cat",
	expr: `
		Observation.category.coding.where(
			system='http://terminology.hl7.org/CodeSystem/observation-category' or
			system='http://hl7.org/fhir/observation-category'
		).first().code
	`
},{
	//TODO: need better approach for Epic since not all endpoints have epic in the name
	//Pull in endpoint list and create many checks (maybe too slow)? 
	name: "ehr",
	expr: `
		iif(meta.extension.where(
			url='http://hl7.org/fhir/4.0/StructureDefinition/extension-Meta.source'
		).valueUri.lower().contains('cerner'), 'cerner') |
		iif(meta.extension.where(
			url='http://hl7.org/fhir/4.0/StructureDefinition/extension-Meta.source'
		).valueUri.lower().contains('epic'), 'epic')
	`
}]

function getStratificationOptions() { return expressions.map( item => item.name) }

function buildStratificationFn(stratifications=["obs_cat"], customExpressions = []) {
	const mergedExpressions = customExpressions.concat(expressions);
	const fns = stratifications.map( stratification => {
		const item = mergedExpressions.find( e => e.name === stratification);
		if (!item) throw new Error(`Stratification ${stratification} not found`);
		return fhirpath.compile(item.expr);
	});
	return resource => {
		const categories = fns.map( fn => {
			const result = fn(resource);
			return result.length > 0 ? result[0] : null;
		}).filter( result => !!result )
		return categories.length ? categories.join(", ") : "unstratified";
	}
}

module.exports = { buildStratificationFn, getStratificationOptions };