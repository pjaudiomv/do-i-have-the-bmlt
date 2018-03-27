import React, { Component } from 'react';
import { Header, Modal, Input, Button } from 'semantic-ui-react';

class GetLocationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationText: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible});
  }

  render() {
    const inlineStyle = {
      modal : {
        marginTop: '0px !important',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
      }
    };

    let updateLocationText = (event, data) => {
      this.setState({locationText: data.value});
    };

    let handleClick = () => {
      if (this.state.locationText === undefined || this.state.locationText.trim() === '') {
        this.setState({inputHasErrors: true});
        return;
      }
      this.setState({
        visible: false,
        inputHasErrors: false
      });
      let address = this.state.locationText;
      let url = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBiYze0yzbraSghRqXvK1_oAtQlqe9n594&address=${address}&sensor=false`;
      fetch(url).then(
        (result) => {
          result.json().then(
            (r) => {
              if (r.status !== 'OK') {
                if (this.props.errorCallback) {
                  this.props.errorCallback();
                }
                return;
              }
              let latitude = r.results[0].geometry.location.lat;
              let longitude = r.results[0].geometry.location.lng;
              this.props.successCallback(latitude, longitude);
            }
          )
        },
        (error) => {
          this.props.errorCallback();
        }
      )
    };

    return (
      <Modal open={this.state.visible} style={inlineStyle.modal} size="small" closeOnDocumentClick={false} basic>
        <Header>Enter your City/Province or Postal Code</Header>
        <Input
          fluid
          error={this.state.inputHasErrors}
          onChange={updateLocationText}
          action={<Button content='Search' onClick={handleClick} />} />
      </Modal>
    );
  }
}

export default GetLocationModal;