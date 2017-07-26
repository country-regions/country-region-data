## country-region-data 

[![Build Status](https://travis-ci.org/benkeen/country-region-data.svg?branch=master)](https://travis-ci.org/benkeen/country-region-data)

This repo contains a static JSON file of country names, country short codes, country regions, and country region short 
codes. All country names and short codes are guaranteed to be unique. Similarly, all regions and region short
codes *within a single country* are guaranteed to be unique.

I created this repo to house the raw data used for the [country-region-selector](https://github.com/benkeen/country-region-selector),
[react-country-region-selector](https://github.com/benkeen/react-country-region-selector) scripts. I didn't want to 
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

### Contribute

The state/prov abbreviations are not yet complete, so pull requests welcome! Regions that need ISO3166-2 codes can 
be identified by having a missing `shortCode` property for each region. You can find them by cloning the repo, then 
running:

```
npm install
grunt findIncomplete
```

That'll list all countries with regions that are missing region short codes. Wikipedia has a lot of the data listed here:
https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2


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
