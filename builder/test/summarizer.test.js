const _ = require("lodash");
const path = require("path");

const summarizer = require("../src/summarizer");

describe("abstract FHIR definitions", () => {

	test("R4", () => {
		const definitions = summarizer.buildDefinitions(path.join(__dirname, "../fhir/R4.0.1"));
		expect(definitions["Patient.deceasedBoolean"]).toEqual({ 
			type: "boolean",
			isArray: false,
			pos: 15,
			choiceType: "Patient.deceased[x]" 
		});
	});

	test("R2", () => {
		const definitions = summarizer.buildDefinitions(path.join(__dirname, "../fhir/R2"));
		expect(definitions["Patient.deceasedBoolean"]).toEqual({ 
			type: "boolean",
			isArray: false,
			pos: 15,
			choiceType: "Patient.deceased[x]" 
		});
	});

});

describe("aggregate element summary", () => {

	test("count non-array element", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.birthDate"].count
		).toEqual(1);
	});

	test("count array element", () => {
		const resource = {
			resourceType: "Patient", 
			identifier: [{value: 1}, {value:2}]
		};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.identifier.value"].count
		).toEqual(2);
	});

	test("fhir type for valid element", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const definitions = {"Patient.birthDate": {type: "date"}};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.summary.unstratified["Patient.birthDate"].fhirType
		).toEqual("date");
	});

	test("fhir type for invalid element", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01"};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.birthDate"].fhirType
		).toEqual(undefined);
	});

	test("fhir position for valid element", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const definitions = {"Patient.birthDate": {type: "date", pos: 2}};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.summary.unstratified["Patient.birthDate"].position
		).toEqual(2);
	});

	test("fhir position for invalid element", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.birthDate"].position
		).toEqual(2);
	});

	test("stratify resource if stratifier", () => {
		const stratifier = resource => resource.deceasedBoolean ? "dead" : "alive";
		const resource = {resourceType: "Patient", deceasedBoolean: true, birthDate: "2020-01-01"};
		const data = summarizer.summarizeResource(resource, {}, stratifier);
		expect(
			data.summary.dead["Patient.birthDate"].count
		).toEqual(1);
	});

	test("aggregate counts across multiple resources", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const resource2 = {resourceType: "Patient", birthDate: "2020-01-01"};
		let data = summarizer.summarizeResource(resource);
		data = summarizer.summarizeResource(resource2, {}, null, data)
		expect(
			data.summary.unstratified["Patient.birthDate"].count
		).toEqual(2);
	})

});

describe("contained element types", () => {

	test("include data types in contained resource", () => {
		const resource = {resourceType: "Observation", 
			contained: [{
				resourceType: "Patient",
				birthDate: "2020-01-01"
			}]
		};
		const definitions = {
			"Observation.contained": {type: "Resource", pos: 0},
			"Patient.birthDate": {type: "date", pos: 2}
		};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.summary.unstratified["Observation.contained.Patient"].fhirType
		).toEqual("Patient");
		expect(
			data.summary.unstratified["Observation.contained.Patient"].count
		).toEqual(1);
		expect(
			data.summary.unstratified["Observation.contained.Patient.birthDate"].fhirType
		).toEqual("date");
	});

	test("include data types for contained resource without resourceType", () => {
		const resource = {resourceType: "Observation", 
			contained: [{
				birthDate: "2020-01-01"
			}]
		};
		const definitions = {
			"Observation.contained": {type: "Resource", pos: 0},
		};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.summary.unstratified["Observation.contained.birthDate"].count
		).toEqual(1);
	});

	test("include data types in multiple contained resources", () => {
		const resource = {resourceType: "Observation", 
			contained: [{
				resourceType: "Patient",
				birthDate: "2020-01-01"
			},{
				resourceType: "Patient",
				birthDate: "2020-01-01"
			}]
		};
		const definitions = {
			"Observation.contained": {type: "Resource", pos: 0},
			"Patient.birthDate": {type: "date", pos: 2}
		};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.summary.unstratified["Observation.contained.Patient.birthDate"].count
		).toEqual(2);
	});

	test("include data types in multiple types of contained resources", () => {
		const resource = {resourceType: "Observation", 
			contained: [{
				resourceType: "Patient",
				birthDate: "2020-01-01"
			}, {
				resourceType: "Practitioner",
				gender: "male"
			}]
		};
		const definitions = {
			"Observation.contained": {type: "Resource", pos: 0},
			"Patient.birthDate": {type: "date", pos: 2},
			"Practitioner.gender": {type: "string", pos: 2}
		};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.summary.unstratified["Observation.contained.Patient.birthDate"].fhirType
		).toEqual("date");
		expect(
			data.summary.unstratified["Observation.contained.Practitioner.gender"].fhirType
		).toEqual("string");
	});


});


describe("impute element types", () => {

	test("impute date type", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.birthDate"].fhirType
		).toEqual("date");
	});

	test("impute Coding type", () => {
		const resource = {
			resourceType: "Observation",
			code: {
				coding: [{
					system: "http://loinc.org",
					code: "77606-2",
					display: "Weight-for-length Per age and sex"
				}]
			}
		};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Observation.code.coding"].fhirType
		).toEqual("Coding");
	});

	test("impute Quantity type", () => {
		const resource = {
			resourceType: "Observation",
			valueQuantity: {
				value: 36.5,
				unit: "C",
				system: "http://unitsofmeasure.org",
				code: "Cel"
			}
		};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Observation.valueQuantity"].fhirType
		).toEqual("Quantity");
	});

	test("impute primitive choice type", () => {
		const resource = {
			resourceType: "Patient",
			valueString: "Test"
		};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.valueString"].fhirType
		).toEqual("string");
	});

	test("impute complex choice type", () => {
		const resource = {
			resourceType: "Patient",
			extension: {
				url: "test",
				valueIdentifier: { value: "1234" }
			}
		};
		const data = summarizer.summarizeResource(resource, {});
		expect(
			data.summary.unstratified["Patient.extension.valueIdentifier"].fhirType
		).toEqual("Identifier");
	});

});

describe("aggregate element detail", () => {

	test("instance count for array element", () => {
		const resource = {resourceType: "Patient", identifier: [{value: 1}, {value:2}]};
		const resource2 = {resourceType: "Patient", identifier: [{value: 1}, {value:2}, {value:3}]};
		let data = summarizer.summarizeResource(resource);
		data = summarizer.summarizeResource(resource2, {}, null, data)
		expect(
			data.detail.unstratified["Patient.identifier"].instanceCount["2-items"].count
		).toEqual(1);
		expect(
			data.detail.unstratified["Patient.identifier"].instanceCount["3-items"].count
		).toEqual(1);
	});

	test("date precision", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const definitions = {"Patient.birthDate": {type: "date", pos: 2}};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.detail.unstratified["Patient.birthDate"].datePrecision.d.count
		).toEqual(1);
		const resource2 = {resourceType: "Patient", birthDate: "2020-01"};
		const data2 = summarizer.summarizeResource(resource2, definitions);
		expect(
			data2.detail.unstratified["Patient.birthDate"].datePrecision.m.count
		).toEqual(1);
	});

	test("date month and year", () => {
		const resource = {resourceType: "Patient", birthDate: "2020-01-01"};
		const definitions = {"Patient.birthDate": {type: "date", pos: 2}};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.detail.unstratified["Patient.birthDate"].date["2020-01"].count
		).toEqual(1);
	});

	test("Coding system and code", () => {
		const resource = {
			resourceType: "Observation",
			code: {
				coding: [{
					system: "http://loinc.org",
					code: "77606-2",
					display: "Weight-for-length Per age and sex"
				}]
			}
		};
		const definitions = {
			"Observation.code": {type: "CodeableConcept", pos: 14},
			"CodeableConcept.coding": {type: "Coding", pos: 0}
		};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.detail.unstratified["Observation.code.coding"].coding["http://loinc.org|77606-2"].count
		).toEqual(1);
	});

	test("code text", () => {
		const resource = {
			resourceType: "Observation",
			code: {
				coding: [{
					system: "http://loinc.org",
					code: "77606-2",
					display: "Weight-for-length Per age and sex"
				}]
			}
		};
		const resource2 = {			
			resourceType: "Observation",
			code: {
				coding: [{
					system: "http://loinc.org",
					code: "77606-2",
					display: "Weight-for-length for age and sex"
				}]
			}
		};
		const definitions = {
			"Observation.code": {type: "CodeableConcept", pos: 14},
			"CodeableConcept.coding": {type: "Coding", pos: 0}
		};
		let data = summarizer.summarizeResource(resource, definitions);
		data = summarizer.summarizeResource(resource2, definitions, null, data)
		expect(
			data.detail.unstratified["Observation.code.coding"].coding["http://loinc.org|77606-2"].text
		).toEqual([
			"Weight-for-length Per age and sex", "Weight-for-length for age and sex"
		]);
	});

	test("code", () => {
		const resource = {resourceType: "Observation", status: "final"};
		const definitions = {"Observation.status": {type: "code"}};
		const data = summarizer.summarizeResource(resource, definitions);
		expect(
			data.detail.unstratified["Observation.status"].coding["|final"].count
		).toEqual(1);
	});

});

describe("flatten working JSON structures", () => {
	test( "flatten summary and detail", () => {
		const working = {
			"summary": {
				"unstratified": {
					"Observation": {"position": 0,"count": 2},
					"Observation.resourceType": {"position": 0,"count": 2},
					"Observation.code": {"fhirType": "CodeableConcept","position": 14,"count": 2},
					"Observation.code.coding": {"fhirType": "Coding","position": 0, "count": 2,"instanceCount": 2}
				}
			},
			"detail": {
				"unstratified": {
					"Observation.code.coding": {
						"coding": {
							"http://loinc.org|77606-2": {
								"count": 2,
								"text": [ "Weight-for-length Per age and sex","Weight-for-length for age and sex"]
							}
						},
						"instanceCount": {"1-items": {"count": 2}}
					}
				}
			}
		}
		const flattened = summarizer.flattenSummary(working);
		expect(flattened).toEqual({ 
			summary:[{ 
				resourceType: 'Observation',
				stratification: 'unstratified',
				elementPath: 'Observation',
				position: 0,
				count: 2
			},{ 
				resourceType: 'Observation',
				stratification: 'unstratified',
				elementPath: 'Observation.resourceType',
				position: 0,
				count: 2 
			},{ 
				resourceType: 'Observation',
				stratification: 'unstratified',
				elementPath: 'Observation.code',
				fhirType: 'CodeableConcept',
				position: 14,
				count: 2 
			},{ 
				resourceType: 'Observation',
				stratification: 'unstratified',
				elementPath: 'Observation.code.coding',
				fhirType: 'Coding',
				position: 0,
				count: 2,
				instanceCount: 2 
			}],
			detail: [{ 
				resourceType: 'Observation',
				stratification: 'unstratified',
				elementPath: 'Observation.code.coding',
				detailType: 'coding',
				detailStratification: 'http://loinc.org|77606-2',
				text:
					'Weight-for-length Per age and sex, Weight-for-length for age and sex',
				count: 2 
			},{ 
				resourceType: 'Observation',
				stratification: 'unstratified',
				elementPath: 'Observation.code.coding',
				detailType: 'instanceCount',
				detailStratification: '1-items',
				text: '',
				count: 2 
			} ]
		})
	});
});