import React, { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import { Formik, Form, Field } from 'formik';

function App() {
  const [isScannerOpen, setScannerOpen] = useState(false);

  return (
    <Formik
      initialValues={{ barcode: '' }}
      onSubmit={(values) => console.log('Scanned Barcode:', values)}
    >
      {() => (
        <Form>
          <div style={{ margin: '1rem' }}>
            <label>Barcode:</label>
            <Field name="barcode" readOnly />
            <button type="button" onClick={() => setScannerOpen(true)}>Scan</button>
          </div>
          <BarcodeScanner
            fieldName="barcode"
            isOpen={isScannerOpen}
            closeScanner={() => setScannerOpen(false)}
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default App;