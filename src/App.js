import React from 'react';
import './App.css';
import CalculatorContainer from "./components/CalcContainer.js";
import { Row, Col } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Row id="infoRow" className="justify-content-md-center">
        <Col md="6" id="titleCol">
          <h1 className="text-left">String</h1>
          <h1 className="text-left">Calculator</h1>
        </Col>
      </Row>

      <CalculatorContainer data-test="component-calculator-container"/>
      
    </div>
  );
}

export default App;
