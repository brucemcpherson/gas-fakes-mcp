This script is to ensure that authentication for apps script is properly set up. For this example, bypass any MCP servers. 

## General rules
- Put any generated scripts into ./gemini-created-scripts, and give them the same filename as the prompt file filename
- there's no need to handle authentication as gas-fakes will take care of that automatically.
- Gas-fakes is a direct enulation of Apps Script. The code you write should be as if you are writing for Apps Script. 
- Since all Apps Script services are global there's no need to import them individually. The only import required is import @mcpher/gas-fakes.
- sandbox mode is enabled with ScriptApp.__behavior.sandboxMode = true
- sandbox cleanup happens with ScriptApp.__behavior.trash()

## Create a gas-fakes Google Apps Script to ensure gas-fakes is operating successfully
- import '@mcpher/gas-fakes'
- enable sandbox mode
- create a new document called '--gas-fakes-test'
- append a paragraph with the text 'coffee turns potential into momentum.'
- read the document text and ensure it matches what you created
- tidy up sandbox 

## run the script on gas-fakes
