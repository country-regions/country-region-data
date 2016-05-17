## country-region-data 

[![Build Status](https://travis-ci.org/benkeen/country-region-data.svg?branch=master)](https://travis-ci.org/benkeen/country-region-data)

### About

This repo contain the source data for the [country-region-selector](https://github.com/benkeen/country-region-selector) 
script. As I plan on creating multiple versions of this script (React, Polymer, X-Tags, etc), I've moved the source 
data here so that each of the repos can pull from the single source. 

See the `data.json` file for the data. It's of the form: 

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

The state/prov abbreviations are not yet complete, so pull requests welcome! For more information, see:
https://github.com/benkeen/country-region-selector/issues/2#issuecomment-98549680

Regions that need ISO3166-2 codes can be identified by having a missing `shortCode` property for each region.

Before contributing a PR, you might want to validate the JSON content. To do that, do the following on your command line:

```
npm install
grunt validate
```

That'll throw an error if the JSON is invalid.

### License

MIT.
