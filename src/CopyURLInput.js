import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import copy from 'copy-to-clipboard';

class BMLTResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    }
  }

  render() {
    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    let latitude = this.props.latitude;
    let longitude = this.props.longitude;
    let url = `${protocol}//${hostname}/?latitude=${latitude}&longitude=${longitude}`;
    let handleCopy = () => {
      copy(url);
      this.setState({copied: true});
    };

    let content = this.state.copied === true ? 'Copied': 'Copy URL';
    return (
      <Input
        action={{ labelPosition: 'right', icon: 'copy', content: content, onClick:handleCopy }}
        fluid
        defaultValue={url} />
    );
  }
}

export default BMLTResult;
