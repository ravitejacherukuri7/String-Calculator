import React, { Component } from "react";
import './CalcContainer.css';
import Button from './Button';
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';

const numOr0 = (n) => {
    let val = parseInt(n);
    if (isNaN(val)) {
        return 0
    } else {
        return val
    }
}

let delimiterRegex = (delimiter, cb) => {
    let delRegex = delimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    cb(delRegex);
}


let customDelimiters = [',', '\\n'];


class CalculatorContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            string: "",
            result: "",
            error: "",
            message: "",
            formula: ""
        };
    }



    handleInputChange = (event) => {
        this.setState({
            string: event.target.value
        });
    };

    handleSubmit = () => {
       
        this.setState({
            error: "",
            message: ""
        })
       
        if (this.state.string.startsWith("//")) {
            this.handleDelimiter(this.state.string, (newString) => {
                this.makeNumArr(newString);
            });
        } else {
            this.makeNumArr(this.state.string);
        }
    }

    handleDelimiter = (string, cb) => {
        let convertedArr = [];

        let delimiter = string.split('//').pop().split('\\n')[0];

        if (/^\[[\S\s]*]$/.test(delimiter)) {
            delimiter.split(/\[|\]/g)
                .filter((elem) => {
                    return elem != false;
                })
                .map((el) => {
                    delimiterRegex(el, (regex) => {
                        convertedArr.push(regex);
                    })
                });

        } else {
            delimiterRegex(delimiter, regex => {
                convertedArr.push(regex);
            });
        }

        convertedArr.forEach((elem) => {
            if (customDelimiters.indexOf(elem) === -1) {
                customDelimiters.push(elem);
            }
        })

        let newString = string.split(/\/\/(.*?)\\n/g).pop();
        cb(newString);
    }

    makeNumArr = (string) => {
        let noNString = string.replace(/\\n/g, ',');
        let customRegex = new RegExp(customDelimiters.join('|'), 'g');
        let splitArr = noNString.split(customRegex);
        let negArr = [];
        for (let i = 0; i <= splitArr.length; i++) {
            if (splitArr[i] > 1000) {
                splitArr[i] = 0
            }
            if (Math.sign(splitArr[i]) === -1) {
                negArr.push(splitArr[i]);
            }
        }


        if (negArr.length > 0) {
            this.setState({
                message: `Please change the following integers to positive values: ${negArr} .`,
                error: "true"
            });
            
        } else {
            this.startAdd(splitArr);
        };
    }

    startAdd = (arr) => {
        this.setState({
            message: "",
            error: "",
            result: arr.reduce((a, b) =>
                numOr0(a) + numOr0(b))
        });
    };


    render() {
        const errorClass = this.state.error ? '' : 'hidden';

        return (
            <div>
                <Container>
                    <Row>
                        <Col id="titleCol">
                            <InputGroup
                                onChange={(e) => { this.handleInputChange(e) }}
                                data-test="input-group"
                            >
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Your String Here</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl as="textarea" aria-label="With textarea" />
                                <Button
                                    data-test="submit-button"
                                    id="submitBtn"
                                    handleClick={this.handleSubmit}
                                    message={"Get the Sum!"}
                                    type="submit">
                                </Button>
                            </InputGroup>
                            <p className={`error ${errorClass}`} data-test="error-display"> Error: {this.state.message} </p>
                            <p data-test="formula-display"> </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h1 data-test="result-display"> {this.state.result} </h1>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default CalculatorContainer