# country-region-data 

[![Build Status](https://travis-ci.com/country-regions/country-region-data.svg?branch=master)](https://travis-ci.org/country-regions/country-region-data)

This repo provides country and region data in three different formats: es6, UMD (Unified Module Definition) and
plain JSON. The data contains country names, country short codes, country regions, and country region short 
codes. All country names and short codes are guaranteed to be unique. Similarly, all regions and region short
codes *within a single country* are guaranteed to be unique.

I created this repo to house the raw data used for the [country-region-selector](https://github.com/country-regions/country-region-selector),
[react-country-region-selector](https://github.com/country-regions/react-country-region-selector) scripts. I didn't want to 
duplicate it in multiple places and hey, it seemed like this could be useful as a standalone repo.

### Install

This package is available as an npm package. You can install via npm or yarn:

```
npm install country-region-data
yarn add country-region-data
```

### Structure

See the `data.json` file in the root folder for the raw data. The JSON is of the form:

```javascript
[
  {
    "countryName":"Ecuador",
    "countryShortCode":"EC",
    "regions":[
      {
        "name":"Azuay",
        "shortCode":"A"
      },
      ...
    ]
  },
  ... 
]
```

The `data.json` file is the source of truth for the data set, but the generated build artifacts (not seen the repo -
only in the npm package) are:

```
dist/data.js
dist/data-umd.js
```

The first one is an es6 file containing all the data in tree-shakeable format; the second is an UMD file containing the 
entire content. Up until v2 of this repo, UMD was the default. Now the es6 export is the default and the typings reflects
the content of that file, not UMD.

### How to use

The es6 file can be imported like so:

```jsx harmony
import { allCountries } from 'country-region-data';
```

If you're using typescript you'll get all the typings and see the structure of the exported data in your IDE. If not, 
check your node_modules/country-region-data/dist folder and look at the `data.d.ts` file to get the full list of exported 
information.

The UMD file can be used like this:

```
import countryRegionData from 'country-region-data/dist/data-umd';
```

The raw JSON like this:

```
import json from 'country-region-data/data.json';
```

### Typings 

So this bit I'm not sure about... so ping me if I'm wrong or if there's a better way to do it. There are three
different formats for the repo data: JSON, UMD and ES6. I figure es6 is going to be the most likely used format, so the
generated typings file (data.d.ts) is referenced in the "typings" property in the package.json file and should be picked 
up by your IDEs. 

There are no typings for the UMD or JSON format. 


### Contribute

Make your changes to the `data.json` file.

Updates and fixes to the data is much appreciated! The state/prov abbreviations in particular are not yet complete, so
the more contributors the better. Regions that need ISO3166-2 codes can be identified by having a missing `shortCode` 
property for each region. You can find them by cloning the repo, then running:

```
yarn install
npx grunt findIncomplete
```

That'll list all countries with regions that are missing region short codes. Wikipedia has a lot of the data listed here:
https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 

### Data Validation

Before contributing a PR, please validate the JSON content (if you don't, Travis will catch it for you!). To do that, 
run the following on your command line:

```
yarn install
npx grunt validate
```

That'll throw an error if the JSON is invalid or if some duplicate names were accidentally introduced. The error messages 
are pretty clear, I think.


### Changelog

Note that this repo does _not_ use semantic versioning. I realize that's pretty non-standard, but every change
to this repo is a dataset change which is technically backward incompatible. So although we could be bumping
the major version with each release, I think that that would be more problematic: apps can no longer use the `~` and 
`^` chars in their package.json files to get the latest content so updates would be manual and frequent. If people
disagree about this let me know. 

- `2.2.0` - Mar 12, 2022.
    - Ukraine, Romania, Mexico data updated. 
- `2.1.0` - Feb 22, 2022.
    - `countryTuples` named export added to es6 bundle.
    - Data updates for Philippines, Taiwan, Nepal  
- `2.0.0` - Jan 4, 2022.
    - New export formats: es6 (default) as well as the old UMD and JSON.
    - Data updates for France, Bolivia, Vietnam. 
- `1.11.0` - Sept 22, 2021. Data updates: Vietnam. Thanks [barnett](https://github.com/barnett)!
- `1.10.0` - Aug 10, 2021. Data updates: India, Nepal, Moldova regions. Thanks all!
- `1.9.0` - July 26, 2021. Data updates: China regions. Thanks [jshenk](https://github.com/jshenk)
- `1.8.0` - July 25, 2021. Data updates: Morocco, India, Iceland, Honduras. Thanks all!  
- `1.7.0` - Nov 20, 2020. Data updates: France, Norway, Mali, Croatia, Paraguau, Taiwan, Kosovo, Morocco. 
Thanks [mohouyizme](https://github.com/mohouyizme), [fabrice102](https://github.com/fabrice102), 
[nicoepp](https://github.com/nicoepp), [sc0Vu](https://github.com/sc0Vu), [ibravoh149](https://github.com/ibravoh149) and
[EPRenaud](https://github.com/EPRenaud).
- `1.6.0` - Mar 28, 2020. Data updates. Spain data updated. Thanks [gui64](https://github.com/gui64).
- `1.5.1` - Nov 14, 2019. Data updates. Polish and UK data updated. Thanks [nguyennghi3489](https://github.com/nguyennghi3489).
- `1.5.0` - Sept 22, 2019. Data updates. All versions changes on github will now be listed in milestones.
- `1.4.7` - Aug 26, 2019. Data updates. Ghana regions updated. 
- `1.4.6` - Aug 14, 2019. Data updates: Hong Kong region shortcode added; Great Britain regions updated; typescript types.
- `1.4.5` - Nov 28, 2018. Data updates.
- `1.4.4` - July 8, 2018. Data updates.
- `1.4.3` - May 29, 2018. More data updates.
- `1.4.2` - Nov 7, 2017. Data updates.
- `1.4.1` - Nov 5, 2017. Data updates.
- `1.4.0` - July 25, 2017. Version bump, no changes. 
- `1.3.6` - July 5, 2017. JS version added of the json file (thanks [jayeb!](https://github.com/jayeb)!). Minor bug fixes.
- `1.3.5` - Apr 20, 2017. Misc updates. Thanks all!
- `1.3.4` - Dec 31, 2016. Mexico region update - thanks [richi3f](https://github.com/richi3f)! 
- `1.3.3` - Dec 22, 2016. French region fix - thanks [JMartelot](https://github.com/JMartelot)! 
- `1.3.2` - Oct 31, 2016. Lots more region short codes (thanks again, [ellenhutchings](https://github.com/ellenhutchings)!).
- `1.3.1` - Sept 23, 2016. Fix for incorrect shortcodes in Japanese prefectures. 
- `1.3.0` - July 1, 2016. Improved validation added to ensure uniqueness of country names, short codes, region names and 
shortcodes. Various country region additions / updates.
- `1.2.1` - Jun 7, 2016. Taiwan country name change. Travis build status added + basic JSON syntax validation. 
- `1.2.0` - May 14, 2015. Lots more region short codes (again, thanks Ellen!). JSON syntax fixes.
- `1.1.1` - April 30, 2016. JSON syntax fixes. 
- `1.1.0` - April 30, 2016. Looooads of new region shortcodes added thanks to [ellenhutchings](https://github.com/ellenhutchings). Thanks, Ellen!
- `1.0.0` - April 29, 2016. initial version


### License

MIT.
