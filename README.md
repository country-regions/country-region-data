# country-region-data 

[![Build Status](https://travis-ci.com/country-regions/country-region-data.svg?branch=master)](https://travis-ci.org/country-regions/country-region-data)

This repo contains a static JSON file of country names, country short codes, country regions, and country region short 
codes. All country names and short codes are guaranteed to be unique. Similarly, all regions and region short
codes *within a single country* are guaranteed to be unique.

I created this repo to house the raw data used for the [country-region-selector](https://github.com/country-regions/country-region-selector),
[react-country-region-selector](https://github.com/country-regions/react-country-region-selector) scripts. I didn't want to 
duplicate it in multiple places and hey, it seemed like this could be useful as a standalone repo.

See the `data.json` file for the data. The JSON is of the form:

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
    }
  },
  ... 
]
```

Note: the `data.js` file is an UMD version of the data.json file, generated automatically. The `data.json` file is the
source of truth for the data set.


### Contribute

Updates and fixes to the data is much appreciated! The state/prov abbreviations in particular are not yet complete, so
the more contributors the better. Regions that need ISO3166-2 codes can be identified by having a missing `shortCode` 
property for each region. You can find them by cloning the repo, then running:

```
npm install
grunt findIncomplete
```

That'll list all countries with regions that are missing region short codes. Wikipedia has a lot of the data listed here:
https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

**Please note**: you should edit the `data.json` file, not the `data.js` file. The JS file is generated automatically out of
the `data.json` file by running `grunt umdify` on the command line. So if you add your change to the JS file only, they
will get overwritten next time that command is run.
 

### Data Validation

Before contributing a PR, please validate the JSON content (if you don't, Travis will catch it for you!). To do that, 
run the following on your command line:

```
npm install
grunt validate
```

That'll throw an error if the JSON is invalid or if some duplicate names were accidentally introduced. The error messages 
are pretty clear, I think.


### Changelog

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
