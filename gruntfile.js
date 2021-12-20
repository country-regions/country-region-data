var _ = require('underscore');
var libumd = require('libumd');

var findDuplicates = function (sourceArray, prop) {
	var duplicates = [];
	var groupedByCount = _.countBy(sourceArray, function (item) {
		return item[prop];
	});

	for (var name in groupedByCount) {
		if (groupedByCount[name] > 1) {
			var whereClause = [];
			whereClause[prop] = name;
			_.where(sourceArray, whereClause).map(function (item) {
				duplicates.push(item);
			});
		}
	}

	return _.uniq(_.pluck(duplicates, prop));
};

var getJSON = function (grunt) {
	var content = '';
	try {
		content = grunt.file.readJSON('data.json');
	} catch (e) {
		grunt.fail.fatal('data.json is not valid JSON. Error: ' + e);
	}
	return content;
};


module.exports = function (grunt) {

	function validate () {
		var content = getJSON(grunt);

		// check country names and country shortcodes are unique
		var duplicateCountryNames = findDuplicates(content, 'countryName');
		if (duplicateCountryNames.length > 0) {
			grunt.fail.fatal('The country names are not unique - duplicates: ' + duplicateCountryNames);
		}
		var duplicateCountryShortCodes = findDuplicates(content, 'countryShortCode');
		if (duplicateCountryShortCodes.length > 0) {
			grunt.fail.fatal('The country short codes are not unique - duplicates: ' + duplicateCountryShortCodes);
		}

		// now check region names and short codes are unique for each country
		content.forEach(function (countryData) {
			var duplicateRegionNames = findDuplicates(countryData.regions, 'name');
			if (duplicateRegionNames.length > 0) {
				grunt.fail.fatal('The region names for ' + countryData.countryName + ' are not unique - duplicates: ' + duplicateRegionNames);
			}
			var duplicateRegionShortCodes = findDuplicates(countryData.regions, 'shortCode');
			if (duplicateRegionShortCodes.length > 0) {
				grunt.fail.fatal('The region names for ' + countryData.countryName + ' are not unique - duplicates: ' + duplicateRegionShortCodes);
			}
		});
		console.log('PASS!');
	}


	function findIncomplete () {
		var content = getJSON(grunt);

		var incompleteCountries = [];
		content.forEach(function (countryData) {
			for (var i = 0; i < countryData.regions.length; i++) {
				if (!_.has(countryData.regions[i], 'shortCode')) {
					incompleteCountries.push(countryData.countryName);
					break;
				}
			}
		});

		if (incompleteCountries.length > 0) {
			console.log('\nThe following countries are missing region short codes: \n-', incompleteCountries.join('\n- '));
			console.log('\n(' + incompleteCountries.length + ' countries)');
		} else {
			console.log('All regions now have short codes. Nice!');
		}
	}

	function umdify() {
		var content = getJSON(grunt);

		var output = libumd('return ' + JSON.stringify(content, null, 2) + ';', {
			globalAlias: 'countryRegionData',
			indent: 2
		});

		const file = 'dist/data.js';
		grunt.file.write(file, output);

		const typingsOutput = `declare module 'country-region-data' {
	export interface Region {
		name: string;
		shortCode: string;
	}

	export interface Country {
		countryName: string;
		countryShortCode: string;
		regions: Region[];
	}

	const countryRegionData: Country[];

	export default countryRegionData;
}
`;

		const typingsFile = 'dist/data.d.ts';
		grunt.file.write(typingsFile, typingsOutput);

		console.log(`UMD module created: ${file}`);
	}


	function es6ify() {
		var content = getJSON(grunt);

		const countryNames = content.map(({ countryName }) => countryName);
		let output = `export const countryNames = ${JSON.stringify(countryNames)};\n`;

		const countryShortCodes = content.map(({ countryShortCode }) => countryShortCode);
		output += `export const countryShortCodes = ${JSON.stringify(countryShortCodes)};\n`;

		content.map(({ countryName, countryShortCode, regions }) => {
			output += `export const ${countryShortCode} = [\n\t"${countryName}",\n\t"${countryShortCode}",\n\t[\n${regions.map(({ name, shortCode }) => `\t\t["${name}", "${shortCode}"]`).join(",\n")}\n\t]\n];\n`;
		});

		output += `export const allCountries = [${countryShortCodes.join(",")}];\n`;

		const file = 'dist/data-es6.js';
		grunt.file.write(file, output);

		// now generate the corresponding typings file
		let typingsOutput = `export type CountryName = "${countryNames.join('" | "')}";\n`;
		typingsOutput += `export type CountrySlug = "${countryShortCodes.join('" | "')}";\n`;
		typingsOutput += `export type RegionName = string;
export type RegionSlug = string;

export const countryNames: CountryName[];
export const countryShortCodes: CountrySlug[];
export type Region = [RegionName, RegionSlug];

export type CountryData = [
	CountryName,
	CountrySlug,
	Region[]
];

export const allCountries: CountryData[];

export default allCountries;

`;
		typingsOutput += countryShortCodes.map((shortCode) => `export const ${shortCode}: CountryData;`).join("\n");

		const typingsFile = 'dist/data-es6.d.ts';
		grunt.file.write(typingsFile, typingsOutput);

		console.log(`ES6 module created: ${file}`);
	}

	grunt.registerTask('default', ['validate']);
	grunt.registerTask('validate', validate);
	grunt.registerTask('findIncomplete', findIncomplete);
	grunt.registerTask('build', ['umdify', 'es6ify']);
	grunt.registerTask('umdify', umdify);
	grunt.registerTask('es6ify', es6ify);
};
