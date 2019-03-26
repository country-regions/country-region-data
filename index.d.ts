declare module 'country-region-data' {
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
