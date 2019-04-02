import React, { Component } from 'react';

import './UserInfo.css';

class UserInfo extends Component {
  render() {
    return (
      <div className="user-info">
        {this.props.user && this.props.user.name}
        {this.props.children}
      </div>
    )
  }
}

export default UserInfo;
