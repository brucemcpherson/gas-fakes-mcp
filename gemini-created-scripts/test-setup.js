import '@mcpher/gas-fakes';

function testSetup() {
  // enable sandbox mode
  ScriptApp.__behavior.sandboxMode = true;

  const docName = '--gas-fakes-test';
  let doc;
  try {
    // create a new document
    doc = DocumentApp.create(docName);
    const body = doc.getBody();

    // append a paragraph
    const textToAppend = 'coffee turns potential into momentum.';
    body.appendParagraph(textToAppend);
    doc.saveAndClose();

    // read the document text and ensure it matches
    const doc2 = DocumentApp.openById(doc.getId());
    const docText = doc2.getBody().getText();

    if (docText.trim() !== textToAppend) {
      console.log(`Verification failed. Expected: "${textToAppend}", but got: "${docText.trim()}"`);
    } else {
      console.log('Verification successful!');
    }
  } finally {
    // tidy up sandbox
    ScriptApp.__behavior.trash();
    console.log('Sandbox cleaned up.');
  }
}

testSetup();