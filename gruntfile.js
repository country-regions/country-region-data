const _ = require('underscore');
const libumd = require('libumd');

const findDuplicates = (sourceArray, prop) => {
  const duplicates = [];
  const groupedByCount = _.countBy(sourceArray, (item) => item[prop]);

  for (var name in groupedByCount) {
    if (groupedByCount[name] > 1) {
      const whereClause = [];
      whereClause[prop] = name;
      _.where(sourceArray, whereClause).map((item) => {
        duplicates.push(item);
      });
    }
  }

  return _.uniq(_.pluck(duplicates, prop));
};

const getCountryNames = (content) =>
  content.map(({ countryName }) => countryName);

const getJSON = (grunt) => {
  let content = '';
  try {
    content = grunt.file.readJSON('data.json');
  } catch (e) {
    grunt.fail.fatal('data.json is not valid JSON. Error: ' + e);
  }
  return content;
};

module.exports = (grunt) => {
  const validate = () => {
    const content = getJSON(grunt);

    // check country names and country shortcodes are unique
    const duplicateCountryNames = findDuplicates(content, 'countryName');
    if (duplicateCountryNames.length > 0) {
      grunt.fail.fatal(
        'The country names are not unique - duplicates: ' +
          duplicateCountryNames
      );
    }
    const duplicateCountryShortCodes = findDuplicates(
      content,
      'countryShortCode'
    );
    if (duplicateCountryShortCodes.length > 0) {
      grunt.fail.fatal(
        'The country short codes are not unique - duplicates: ' +
          duplicateCountryShortCodes
      );
    }

    // now check region names and short codes are unique for each country
    content.forEach((countryData) => {
      const duplicateRegionNames = findDuplicates(countryData.regions, 'name');

      if (duplicateRegionNames.length > 0) {
        grunt.fail.fatal(
          'The region names for ' +
            countryData.countryName +
            ' are not unique - duplicates: ' +
            duplicateRegionNames
        );
      }
      const duplicateRegionShortCodes = findDuplicates(
        countryData.regions,
        'shortCode'
      );
      if (duplicateRegionShortCodes.length > 0) {
        grunt.fail.fatal(
          'The region names for ' +
            countryData.countryName +
            ' are not unique - duplicates: ' +
            duplicateRegionShortCodes
        );
      }
    });
    console.log('PASS!');
  };

  const findIncomplete = () => {
    const content = getJSON(grunt);
    const incompleteCountries = [];

    content.forEach((countryData) => {
      for (var i = 0; i < countryData.regions.length; i++) {
        if (!_.has(countryData.regions[i], 'shortCode')) {
          incompleteCountries.push(countryData.countryName);
          break;
        }
      }
    });

    if (incompleteCountries.length > 0) {
      console.log(
        '\nThe following countries are missing region short codes: \n-',
        incompleteCountries.join('\n- ')
      );
      console.log('\n(' + incompleteCountries.length + ' countries)');
    } else {
      console.log('All regions now have short codes. Nice!');
    }
  };

  const umdify = () => {
    const content = getJSON(grunt);

    const output = libumd('return ' + JSON.stringify(content, null, 2) + ';', {
      globalAlias: 'countryRegionData',
      indent: 2,
    });

    const file = 'dist/data-umd.js';
    grunt.file.write(file, output);

    console.log(`UMD module created: ${file}`);
  };

  const es6ify = () => {
    const content = getJSON(grunt);
    const countryNames = content.map(({ countryName }) => countryName);

    let output = `export const countryNames = ${JSON.stringify(countryNames)};\n`;

    const countryShortCodes = content.map(
      ({ countryShortCode }) => countryShortCode
    );
    output += `export const countryShortCodes = ${JSON.stringify(countryShortCodes)};\n`;

    content.map(({ countryName, countryShortCode, regions }) => {
      output += `export const ${countryShortCode} = [\n\t"${countryName}",\n\t"${countryShortCode}",\n\t[\n${regions.map(({ name, shortCode }) => `\t\t["${name}", "${shortCode}"]`).join(',\n')}\n\t]\n];\n`;
    });

    output += `export const allCountries = [${countryShortCodes.join(',')}];\n`;

    const countryTuples = content.map(({ countryName, countryShortCode }) => [
      countryName,
      countryShortCode,
    ]);
    output += `export const countryTuples = ${JSON.stringify(countryTuples)};\n`;

    const file = 'dist/data.js';
    grunt.file.write(file, output);

    // now generate the corresponding typings file
    let typingsOutput = `declare module 'country-region-data' {
	export type CountryName = "${countryNames.join('" | "')}";\n`;
    typingsOutput += `\texport type CountrySlug = "${countryShortCodes.join('" | "')}";\n`;
    typingsOutput += `\texport type RegionName = string;
	export type RegionSlug = string;

	export const countryNames: CountryName[];
	export const countryShortCodes: CountrySlug[];
	export const countryTuples: [CountryName, CountrySlug][];
	export type Region = [RegionName, RegionSlug];
	
	export type CountryData = [
		CountryName,
		CountrySlug,
		Region[]
	];
	
	export const allCountries: CountryData[];	
	export default allCountries;
`;
    typingsOutput += countryShortCodes
      .map((shortCode) => `\texport const ${shortCode}: CountryData;`)
      .join('\n');
    typingsOutput += '\n}\n';

    const typingsFile = 'dist/data.d.ts';
    grunt.file.write(typingsFile, typingsOutput);

    console.log(`ES6 module created: ${file}`);
  };

  grunt.registerTask('default', ['validate']);
  grunt.registerTask('validate', validate);
  grunt.registerTask('findIncomplete', findIncomplete);
  grunt.registerTask('build', ['umdify', 'es6ify']);
  grunt.registerTask('umdify', umdify);
  grunt.registerTask('es6ify', es6ify);
};
