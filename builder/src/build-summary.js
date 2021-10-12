#!/usr/bin/env node

//	node build-summary.js -p "../fhir/R4.0.1" -r "../input/Observation.ndjson" -o "../output"

const fs = require('fs');
const path = require("path");
const {Command, flags} = require('@oclif/command');
const Listr = require('listr');
const glob = require('glob');
const _ = require("lodash");
const summarizer = require("./summarizer");
const stratifications = require("./stratifications");

const currentFileVersion = "1.0.0";
const defaultFileName = "summary.json";

function makePathAbsolute(rawPath) {
	return rawPath[0] === "."
		? path.join(process.cwd(), rawPath)
		: rawPath;
}


function buildOutputPaths(rawPath) {
	const absolutePath = makePathAbsolute(rawPath);

	return ((fs.existsSync(absolutePath) && !fs.lstatSync(absolutePath).isDirectory()) ||
		path.basename(absolutePath).indexOf(".json") > -1
	)
		? [absolutePath, absolutePath.replace(path.basename(absolutePath), "")] 
		: [path.join(absolutePath, defaultFileName), absolutePath];
}

function buildResourceFileList(rawPaths) {
	let resourceFiles = [];
	rawPaths.forEach( rawPath => {
		if (["ndjson", "json", "gz"].indexOf(_.last(rawPath.split("."))) > -1) {
			const fullPath = makePathAbsolute(rawPath);
			if (fs.existsSync(fullPath)) {
				resourceFiles.push(fullPath);
			} else {
				throw new Error(`File not found ${rawPath}`);
			}
		} else {
			const fullPath = makePathAbsolute(rawPath);
			const files = glob.sync(path.join(fullPath, "/**/*.{json,ndjson,gz}"), {});
			resourceFiles = resourceFiles.concat(files)
		}
	});
	return _.uniq(resourceFiles).sort();
}

class Summarize extends Command {
	async run() {
		const {flags} = this.parse(Summarize);
		const profilePath = 
			flags.profiles ? makePathAbsolute(flags.profiles) : null;
		const resourceFiles = buildResourceFileList(flags.resources);

		const [outputFullPath, outputDir] = buildOutputPaths(flags.output);

		//throw if profile files don't exist
		if (profilePath && (
			!fs.existsSync(path.join(profilePath, "profiles-types.json")) ||
			!fs.existsSync(path.join(profilePath, "profiles-resources.json")) 
		)) throw new Error(`profiles-types.json and profiles-resources.json not found at ${profilePath}`);
			
		//throw if no resource files
		if (!resourceFiles.length) 
			throw new Error("No resource files found. Ensure that your files have a .ndjson or .gz extension for bulk data and a .json extension for bundles");

		//throw if no output directory
		if (!fs.existsSync(outputDir))
			throw new Error(`Output location ${flags.output} not found`);

		//throw if append and no file
		if (flags.append && !fs.existsSync(outputFullPath))
			throw new Error(`Output location ${flags.output} not found`);

		let definitions = {};
		let summary = {};

		let stratificationFn;
		if (!flags["stratify-by"]) {
			stratificationFn = stratifications.buildStratificationFn(["obs_cat"]);
		} else if (flags["stratify-by"].length > 1 || flags["stratify-by"][0] !== "none") {
			stratificationFn = stratifications.buildStratificationFn(flags["stratify-by"])
		}

		const fileTasks = new Listr( resourceFiles.map( filePath => {
			return {
				title: _.last(filePath.split("/")), 
				task: () => {
					const summarizeFn = _.last(filePath.split(".")) === "json" 
						? summarizer.summarizeBundle
						: summarizer.summarizeNDJSON;
					return summarizeFn(filePath, definitions, stratificationFn, summary, flags.skip)
						.then( fileSummary => summary = fileSummary );
				}
			}
		}) );

		const tasks = new Listr([{
			title: "Read Profiles",
			task: () => definitions = summarizer.buildDefinitions(profilePath)
		},{
			title: "Parse Resource Files",
			task: () => fileTasks
		},{
			title: "Generate Output File",
			task: () => {
				let summarized = summarizer.flattenSummary(summary);
				summarized.version = currentFileVersion;				;
				const prettyPrint = flags.pretty ? 2 : null;
				if (flags.append) {
					const currentData = JSON.parse( fs.readFileSync(outputFullPath, "utf-8") );
					if (!currentData.version ||  currentData.version !== currentFileVersion || !currentData.summary || !currentData.detail)
						throw new Error("Invalid file format");
					summarized.summary = currentData.summary.concat(summarized.summary);
					summarized.detail = currentData.detail.concat(summarized.detail);
				}
				fs.writeFileSync(outputFullPath, JSON.stringify(summarized, null, prettyPrint), "utf-8");
			}
		}])

		tasks.run();
	}
}

const stratOptions = stratifications.getStratificationOptions();

Summarize.flags = {
	version: flags.version(),
	help: flags.help(),
	profiles: flags.string({
		char: 'p',
		description: "Path to FHIR profiles (`profiles-resources.json` and `profiles-types.json`). Census will attempt to impute date and coding types if omitted."
	}),
	resources: flags.string({
		char: 'r',
		description: "Path to a directory of FHIR resource files or a single FHIR resource file. File(s) may be FHIR Bundles in json format or FHIR Bulk Data files in ndjson format. Defaults to current directory.",
		default: [process.cwd()],
		multiple: true
	}),
	output: flags.string({
		char: 'o',
		description: "Output folder path (file will be named `summary.json`) or path to a specific file name with a `.json` extension. Defaults to current directory.",
		default: process.cwd(),
	}),
	"stratify-by": flags.string({
		char: 's',
		description: "Stratification function. Defaults to `obs_cat` to stratify Observation resources by category (pass a value of `none` to skip all stratification). May be one or more of: " + stratOptions.map( s => "'" + s + "'").join(", "),
		multiple: true 
	}),
	append: flags.boolean({
		char: 'a',
		description: "Flag to indicate Census should append new data to an existing output file rather than replacing it. File path and name can be set using the `output` parameter."
	}),
	pretty: flags.boolean({
		description: "Flag to indicate Census should format the output file with white space (useful for debugging)."
	}),
	skip: flags.string({
		description: "Flag to indicate element detail that should not be recorded in output file and will then not be visible in the Explorer interface. Reduces the summarization time and output file size. May be one or more values of `coding`, `date`, `address`, or `reference`.",
		multiple: true
	}),
}

Summarize.run()
	.catch(require('@oclif/errors/handle'))