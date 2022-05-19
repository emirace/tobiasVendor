import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
  return (
    <Alert variant={props.variant || 'light'} className="alertinfo">
      {props.children}
    </Alert>
  );
}
