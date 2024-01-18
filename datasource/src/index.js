import { default as axios } from "axios";

/**
 * @typedef {Object} ConnectorOptions
 * @property {string} package - The name of the NPM package that you want to get stats from
 * @property {string} dateRange - (optional) A date range that you want to get stats from in the format of "YYYY-MM-DD:YYYY-MM-DD"
 */
export const options = {
  package: {
    title: "NPM Package",
    description:
      "Name of the NPM package that you want to get stats from",
    type: "string",
    required: true,
  },
  dateRange: {
    title: "Custom Date Range",
    description: "Optionally specify a custom date range in format YYYY-MM-DD:YYYY-MM-DD",
    type: "string",
    required: false
  },
};


export const getRunner = () => {
  // Hit the npm api to get the package stats
  // https://api.npmjs.org/downloads/range/last-year/@evidence-dev/evidence
  return () => Promise.resolve();
};

/** @type {import("@evidence-dev/db-commons").ProcessSource<ConnectorOptions>} */
export async function* processSource(options, sourceFiles, utilFuncs) {
  console.log(options);

  let today = new Date();
  let dateRanges =[
    {tableName: "last_day", value: "last-day", },
    {tableName: "last_week", value: "last-week", },
    {tableName: "last_month", value: "last-month", },
    {tableName: "last_year", value: "last-year", },
    {tableName: "max_range", value: "2005-01-01:" + today.toISOString().split('T')[0]}
  ]

  if (options.dateRange) {
    dateRanges.push({value: options.dateRange, tableName: "custom_date_range"});
  } 

  for (let dateRange of dateRanges) {
    let apiUrl = `https://api.npmjs.org/downloads/range/${dateRange.value}/${options.package}`;

    const response = await axios.get(apiUrl);
    const downloads = response.data.downloads;

    // map dates to JS Date objects
    const rows = downloads.map((row) => {
      return {
        ...row,
        day: new Date(row.day),
      };
    });

    yield {
      rows: rows,
      columnTypes: [
        {
          name: "downloads",
          evidenceType: "number",
          typeFidelity: "inferred",
        },
        {
          name: "day",
          evidenceType: "date",
          typeFidelity: "inferred",
        },
      ],
      expectedRowCount: downloads.length,
      name: dateRange.tableName,
      content: JSON.stringify(options),
    };
  }
}


/** @type {import("@evidence-dev/db-commons").ConnectionTester<ConnectorOptions>} */
export const testConnection = async (opts) => {
  return true;
};
