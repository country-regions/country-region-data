const _ = require('underscore');

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
const getCountryShortCodes = (content) =>
  content.map(({ countryShortCode }) => countryShortCode);
const getCountryTuples = (content) => {
  return content.map(({ countryName, countryShortCode }) => [
    countryName,
    countryShortCode,
  ]);
};

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

  const generateJS = (format) => {
    const content = getJSON(grunt);
    const countryNames = getCountryNames(content);
    const countryShortCodes = getCountryShortCodes(content);
    const countryTuples = getCountryTuples(content);

    const prefix = format === 'esm' ? 'export const' : '    var';

    let jsString = `${prefix} countryNames = ${JSON.stringify(countryNames)};\n`;
    jsString += `${prefix} countryShortCodes = ${JSON.stringify(countryShortCodes)};\n`;
    jsString += `${prefix} countryTuples = ${JSON.stringify(countryTuples)};\n`;

    content.map(({ countryName, countryShortCode, regions }) => {
      jsString += `${prefix} ${countryShortCode} = [\n\t"${countryName}",\n\t"${countryShortCode}",\n\t[\n${regions.map(({ name, shortCode }) => `\t\t["${name}", "${shortCode}"]`).join(',\n')}\n\t]\n];\n`;
    });

    jsString += `${prefix} allCountries = [${countryShortCodes.join(',')}];\n`;

    return { jsString, countryShortCodes };
  };

  const generateUmdFile = () => {
    const { jsString, countryShortCodes } = generateJS('umd');

    const fullContent =
      `(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['countryRegionData'] = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports
    module.exports = factory();
  } else {
    root['countryRegionData'] = factory();
  }
}(this, function () {\n` +
      jsString +
      `\n\nreturn { countryShortCodes, countryNames, countryTuples, allCountries, ${countryShortCodes.join(', ')} };\n\n` +
      '}));';

    const file = 'dist/data-umd.js';
    grunt.file.write(file, fullContent);

    console.log(`UMD module created: ${file}`);
  };

  const generateEsmFile = () => {
    const { jsString } = generateJS('esm');

    const file = 'dist/data.js';
    grunt.file.write(file, jsString);

    console.log(`ES6 module created: ${file}`);
  };

  const generateTypings = () => {
    const content = getJSON(grunt);
    const countryNames = getCountryNames(content);
    const countryShortCodes = getCountryShortCodes(content);

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
  };

  grunt.registerTask('default', ['validate']);
  grunt.registerTask('validate', validate);
  grunt.registerTask('findIncomplete', findIncomplete);
  grunt.registerTask('build', [
    'generateUmdFile',
    'generateEsmFile',
    'generateTypings',
  ]);
  grunt.registerTask('generateUmdFile', generateUmdFile);
  grunt.registerTask('generateEsmFile', generateEsmFile);
  grunt.registerTask('generateTypings', generateTypings);
};
