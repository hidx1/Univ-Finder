import React from 'react';
import axios from 'axios';

import Flag from 'react-world-flags'
import Countries from './data/countries.json';

import { 
    Button,
    Card,
    Container,
    Dropdown,
    Form,
    Navbar,
    Row,
    Col,
} from 'react-bootstrap';

import './App.css';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            email: "",
            query: "",
            country: "Country",
            timer: 0.5,
            loading: false
        }
    }

    resetTimer = () => {
        this.setState({
            count: 0.5
        })
        clearInterval(this.myInterval);
    }

    handleSearch = (event) => {
        let q = event.target.value;
        this.myInterval = setInterval(() => {
            this.setState({
                count: this.state.count - 1
            });

            if (this.state.count < 0) {
                clearInterval(this.myInterval);

                this.setState({
                    query: q,
                    loading: true
                });

                // document.getElementsById('loading-stat').style.display = 'default';
                
                let cty = this.state.country;
                if (cty === 'Country') {
                    cty = '';
                }

                console.log("calling API with param name=" + this.state.query + "&country=" + cty);
                
                axios("https://cors-anywhere.herokuapp.com/universities.hipolabs.com/search?name=" 
                    + this.state.query + "&country=" + cty, {
                    'Origin': 'https://developer.mozilla.org',
                    'X-Requested-With': 'XMLHttpRequest',
                })
                .then(response => {
                    this.setState({
                        data: response.data,
                        loading: false
                    });
                    console.log("API Call finished");
                    // document.getElementsById('loading-stat').style.display = 'none';
                });

                this.setState({
                    count: 0.5
                })
            }
        }, 1000)
    }

    handleEmail = (event) => {
        let e = event.target.value;
        this.myInterval = setInterval(() => {
            this.setState({
                count: this.state.count - 1
            });

            if (this.state.count < 0) {
                clearInterval(this.myInterval);

                this.setState({email: e});

                console.log("saving email address " + this.state.email + " to JSON file users.json");

                axios.get("http://127.0.0.1:5000/users?email=" + this.state.email, {
                    'withCredentials': true
                });

                console.log("Saving email finished");

                this.setState({
                    count: 0.5
                })
            }
        }, 1000)
    }

    submitHandler(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div className="App">

                {/* Navbar */}
                <div>
                    <Navbar className="Navbar">
                        <Navbar.Brand style={{color: 'white', fontFamily: 'Open Sans', fontWeight: 'bold', paddingLeft: '2rem'}} className="Brand" href="/">Univ Finder</Navbar.Brand>
                    </Navbar>
                </div>
            
                <div className="Body">
                    <Form inline style={{marginBottom: '1rem'}}>

                        {/* Search Input */}
                        <Form.Control type="text" placeholder="Search" 
                        style={{maxWidth: 'calc(100vw - 150px'}}
                        onKeyDown={this.resetTimer} 
                        onChange={this.handleSearch}
                        onSubmit={this.submitHandler}/>

                        {/* Country Filter Button */}
                        <Dropdown style={{padding: '0.5rem'}}>
                            <Dropdown.Toggle variant="dark">
                                {this.state.country}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{maxHeight: 'calc(100vh - 220px)', overflowY: 'auto'}}>
                                <Dropdown.Item value="None" onClick={() => {this.setState({country: 'Country'});}}>None</Dropdown.Item>
                                {Countries.map((country => 
                                    <Dropdown.Item onClick={() => {this.setState({country: country['name']});}}>{country['name']}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* <div id="loading-stat">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                            <div>Loading...</div>
                        </div> */}
                    </Form>

                    {/* Universities Cards Container */}
                    <Container style={{boxSizing: 'border-box', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0, maxWidth: '100vw'}}>
                        <Row>
                            {this.state.data.map((datum => 
                                <Col xs={4} md={3} lg={2} className="Col">
                                    <Card>
                                        <Card.Header style={{padding: 0}}>
                                            <Flag code={ datum['alpha_two_code']}/>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Title>{datum['name']}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Country: {datum['country']}</Card.Subtitle>
                                        <Card.Link href={datum['web_pages'][0]}>{datum['web_pages'][0]}</Card.Link>
                                        </Card.Body>
                                    </Card>
                                </Col>))}
                        </Row>
                    </Container>
                </div>
                <div>

                    {/* Newsletter */}
                    <Form inline className="Newsletter">
                        <Form.Text className="Join" style={{color: 'white'}}>Join Our Newsletter</Form.Text>
                        <Row inline>
                            <Col>
                                <Form.Group controlId="formBasicEmail" style={{alignContent: 'flex-end'}}>
                                    <Form.Control style={{marginLeft: '1rem', maxWidth: 'calc(100vw - 10px)'}} 
                                    type="email" 
                                    placeholder="Enter your email..." 
                                    onChange={this.handleEmail}
                                    onKeyDown={this.resetTimer}
                                    onSubmit={this.submitHandler}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button variant="dark" type="submit" onClick={this.handleEmail}>
                                    Subscribe
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}