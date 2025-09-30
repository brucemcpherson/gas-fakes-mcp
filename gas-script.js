function myFunction() {
  // 1. Create a new Google Spreadsheet as "temp spreadsheet".
  const spreadsheet = SpreadsheetApp.create("temp spreadsheet");

  // 2. Insert a new sheet as "temp" to the created Spreadsheet.
  const sheet = spreadsheet.insertSheet("temp");

  // 3. Put a value of [["header1", "header2", "header3"], ["a2", "b2","c2"]] into the "temp" sheet.
  sheet.getRange("A1:C2").setValues([["header1", "header2", "header3"], ["a2", "b2", "c2"]]);

  // 4. Get the values of row 2 of the "temp" sheet.
  const row2Values = sheet.getRange("A2:C2").getValues();

  // 5. Show the values.
  Logger.log(row2Values);
}
