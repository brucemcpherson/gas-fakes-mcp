# gas-fakes-mcp

This project is an experiment to use [`@mcpher/gas-fakes`](https://github.com/brucemcpherson/gas-fakes) as a server, integrated with Google Cloud services and the Gemini CLI.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version `20.11.0` or higher)
- Google Cloud SDK (`gcloud` command-line tool)

## Setup Instructions

Follow these steps to configure and run the project.

### 1. Initialize the Project

First, initialize a new Node.js project from your root directory. You can accept the default answers for most of the prompts. We'll be using es6 syntax in all these examples, so make sure "type" : "module" is in your package.json.

```bash
npm init
```

Next, install the gas-fakes package

```bash
npm install @mcpher/gas-fakes
```

### 2. Install the Gemini CLI

The Gemini CLI can be installed as a global npm package. This allows you to use the `gemini` command from anywhere in your terminal.

```bash
npm install -g @google/gemini-cli
```

### 3. Create the `.env` Configuration File

This project uses a `.env` file in the root directory to manage environment variables. Create a file named `.env` and add the following content, replacing the placeholder with your Google Cloud Project ID.

```env
# Your Google Cloud Project ID
GCP_PROJECT_ID="your-gcp-project-id"

# Default scopes for gcloud authentication
DEFAULT_SCOPES="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/userinfo.email"

# Additional scopes (comma-separated, with a leading comma)
EXTRA_SCOPES=",https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets"
```
### 4. Authenticate with Google Cloud

gas-fakes uses Application Default credentials to get the necessary permission to access your workspace resources. It will use the information in the .env file to request the necessary scopes and take you through a browser based authorization process. 

To start this off
```bash
bash shells/setaccount.sh
````

### 5. Set Environment for Gemini CLI

The Gemini CLI requires the `GOOGLE_CLOUD_PROJECT` environment variable to be set. The `exgcp.sh` script reads your `.env` file and exports this variable for your current terminal session.

Run it using the `source` command (or its shorthand `.`) from your project root:

```bash
source ./exgcp.sh
```

You should see a confirmation message, and the `GOOGLE_CLOUD_PROJECT` variable will now be available to the `gcloud` and Gemini CLI tools in your terminal.

## Running Apps Script on Node

gas-fakes should now be all set up and ready to run from your local environment. 



## Using Gemini to Test Your Setup
Now that your environment is configured, you can use the Gemini CLI to generate and run a script that tests your gas-fakes setup. This test will create a Google Doc, add some text, and then verify the content.

### Generate the Test Script

Use the gemini command with the provided prompt to create the test script. This command will read the instructions from prompts/test-setup.md and generate the corresponding JavaScript file.

```bash
gemini -p prompts/test-setup.md
```
This will create a new Apps Script ile at gemini-created-scripts/test-setup.js, and run it for you.


Congratulations! You have successfully set up and tested your gas-fakes environment.

## Setting up an MCP server for gas-fakes

This is fully explained in this [post](https://medium.com/google-cloud/secure-and-conversational-google-workspace-automation-integrating-gemini-cli-with-a-gas-fakes-mcp-0a5341559865) [by Kanshi Tanaike](https://medium.com/@tanaike?source=post_page---byline--0a5341559865---------------------------------------)

This repo contains the required files to replicate that. 

### Install MCP server modules

```bash
npm install @modelcontextprotocol/sdk zod
```

This repo already contains the a test version of the mcp server in mcp/gas-fakes-mcp.js

### The mcp server is defined in your .gemini settings

This repo contains a suitable .gemini/settings.json. These settings are addede to those that gemini finds in ~/.gemini/settings.json allowing you have specific settings for multiple projects.

### Check that gemini sees your mcp server

When you start gemini, it should report this
````
Using: 1 MCP server (ctrl+t to view)
````

You can get more information about the mcp server using \mcp status. This gives this information
````
This file, ..../mcp/gas-fakes-mcp.js, sets up a server that provides a tool for executing Google Apps 
  Script in a sandboxed environment.

  Here's a breakdown of its functionality:

   - Tool Definition: It defines a tool named run-gas-fakes-test.
   - Execution: This tool executes a given Google Apps Script.
   - Sandboxing: By default, the script is run in a secure sandbox, but this can be disabled.
   - Whitelisting: It supports whitelisting Google Drive file IDs to allow the script to interact with specific files.
   - Process: The tool writes the provided script into a temporary file, executes it with Node.js, captures the output, and then deletes the temporary 
     file.

  In essence, this allows for the safe execution of Google Apps Script code with controlled access to Google Drive files.
````

#### test the mcp server

Now we can be less verbose in describing the task to Gemini, since the mcp server knows how to do that. 

##### Here's the first task

Create a Google Apps Script for achieving the following steps. Here, the script is not required to be run. Just show the created script.

1. Create a new Google Spreadsheet as "temp spreadsheet".
2. Insert a new sheet as "temp" to the created Spreadsheet.
3. Put a value of `[["header1", "header2", "header3"], ["a2", "b2","c2"]]` into the "temp" sheet.
4. Get the values of row 2 of the "temp" sheet.
5. Show the values.
6. Show the created script.
7. Run the created script.

You can provide this to Gemini as the file path of ./prompts/test_mcp_sheet.md

##### Here's the execution log
````
✦ Here is the Google Apps Script:

    1 function createAndProcessSheet() {
    2   // 1. Create a new Google Spreadsheet as "temp spreadsheet".
    3   const ss = SpreadsheetApp.create("temp spreadsheet");
    4 
    5   // 2. Insert a new sheet as "temp" to the created Spreadsheet.
    6   const sheet = ss.insertSheet("temp");
    7 
    8   // 3. Put a value of [["header1", "header2", "header3"], ["a2", "b2","c2"]] into the "temp" sheet.
    9   const values = [["header1", "header2", "header3"], ["a2", "b2", "c2"]];
   10   sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
   11 
   12   // 4. Get the values of row 2 of the "temp" sheet.
   13   const row2Values = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues();
   14 
   15   // 5. Show the values.
   16   console.log(row2Values);
   17 }


✦ The script has been executed, and the values of row 2 are [[ 'a2', 'b2', 'c2' ]].
````

##### Here's the second task

Now we can do complicated things with a very short prompt.

Create a Google Apps Script for achieving the following steps.

1. Retrieve values from the "large airports" sheet using the whitelisted ID
2. Find the airport with the highest elevation and show its name, municipality, iso_country and iata_code, its elevation converted to meters, and its distance from paris in kilometers.

Run the script with a sandbox including the publicly shared spreadhseet ID "15MDlPLVH4IhnY2KJBWYGANoyyoUFaxeWVDOe-pupKxs" in the whitelisting

And the result
````
 Here is the Google Apps Script:

    1 function findHighestAirportAndDistance() {
    2   const spreadsheetId = "15MDlPLVH4IhnY2KJBWYGANoyyoUFaxeWVDOe-pupKxs";
    3   const sheetName = "large airports";
    4 
    5   try {
    6     const ss = SpreadsheetApp.openById(spreadsheetId);
    7     const sheet = ss.getSheetByName(sheetName);
    8     if (!sheet) {
    9       console.log(`Sheet with name "${sheetName}" not found.`);
   10       return;
   11     }
   12     const data = sheet.getDataRange().getValues();
   13     const headers = data[0];
   14     const nameIndex = headers.indexOf("name");
   15     const municipalityIndex = headers.indexOf("municipality");
   16     const countryIndex = headers.indexOf("iso_country");
   17     const iataIndex = headers.indexOf("iata_code");
   18     const elevationIndex = headers.indexOf("elevation_ft");
   19     const latIndex = headers.indexOf("latitude_deg");
   20     const lonIndex = headers.indexOf("longitude_deg");
   21 
   22 
   23     if (elevationIndex === -1 || latIndex === -1 || lonIndex === -1) {
   24       console.log("Required columns (elevation_ft, latitude_deg, longitude_deg) not found.");
   25       return;
   26     }
   27 
   28     let highestAirport = null;
   29     let maxElevation = -Infinity;
   30     let airportCoords = {};
   31 
   32     for (let i = 1; i < data.length; i++) {
   33       const row = data[i];
   34       const elevation = parseFloat(row[elevationIndex]);
   35       if (!isNaN(elevation) && elevation > maxElevation) {
   36         maxElevation = elevation;
   37         highestAirport = {
   38           name: row[nameIndex],
   39           municipality: row[municipalityIndex],
   40           iso_country: row[countryIndex],
   41           iata_code: row[iataIndex],
   42           elevation_ft: elevation
   43         };
   44         airportCoords = {
   45             lat: parseFloat(row[latIndex]),
   46             lon: parseFloat(row[lonIndex])
   47         };
   48       }
   49     }
   50 
   51     if (highestAirport) {
   52         const elevation_m = highestAirport.elevation_ft * 0.3048;
   53 
   54         const paris = { lat: 48.8566, lon: 2.3522 };
   55         const distance_km = getDistance(airportCoords, paris);
   56 
   57         highestAirport.elevation_m = elevation_m;
   58         highestAirport.distance_from_paris_km = distance_km;
   59         delete highestAirport.elevation_ft;
   60 
   61 
   62       console.log(JSON.stringify(highestAirport, null, 2));
   63     } else {
   64       console.log("No airport data found.");
   65     }
   66 
   67   } catch (e) {
   68     console.log(`An error occurred: ${e.toString()}`);
   69   }
   70 }
   71 
   72 function getDistance(coords1, coords2) {
   73     const R = 6371; // Radius of the Earth in km
   74     const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
   75     const dLon = (coords2.lon - coords1.lon) * Math.PI / 180;
   76     const a =
   77         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
   78         Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
   79         Math.sin(dLon / 2) * Math.sin(dLon / 2);
   80     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   81     return R * c;
   82 }
  Now, I will run the script with a sandbox including the spreadsheet ID in the whitelist.

 The script has been executed. The airport with the highest elevation is:

   1 {
   2   "name": "Alejandro Velasco Astete International Airport",
   3   "municipality": "Cusco",
   4   "iso_country": "PE",
   5   "iata_code": "CUZ",
   6   "elevation_m": 3310.128,
   7   "distance_from_paris_km": 10027.062937620996
   8 }
````

## summary

The combination of mcp server and gas-fakes allows you to quikcly develop native apps script without ever leaving Node.