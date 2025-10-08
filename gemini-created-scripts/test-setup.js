
import '@mcpher/gas-fakes';

function testSetup() {
  // enable sandbox mode
  ScriptApp.__behavior.sandboxMode = true;

  const docName = '--gas-fakes-test';
  const docText = 'coffee turns potential into momentum.';

  // create a new document
  const doc = DocumentApp.create(docName);
  doc.getBody().appendParagraph(docText);
  doc.saveAndClose();

  // read the document text and ensure it matches what you created
  const readDoc = DocumentApp.openById(doc.getId());
  const readText = readDoc.getBody().getText();

  if (readText.trim() !== docText) {
    throw new Error(`Expected "${docText}", but got "${readText.trim()}"`);
  }
  console.log('Successfully created and verified document content.');


  // tidy up sandbox
  ScriptApp.__behavior.trash();
  console.log('Sandbox tidied up.');
}

testSetup();
