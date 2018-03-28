import React, { Component } from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';
import LocationBox from './LocationBox.js';


class App extends Component {
  render() {
    return (
      <Container text>
        <Segment>
          <Header as="h1">Do I have the BMLT?</Header>
          <LocationBox/>
        </Segment>
      </Container>
    );
  }
}


export default App;
