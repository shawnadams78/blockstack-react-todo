import React, { Component } from 'react';

import Dashboard from './components/Dashboard'
import Landing from './components/Landing'
import UserInfo from './components/UserInfo';

const blockstack = require('blockstack');

class App extends Component {
  constructor(props) {
    super(props)

    let isSignedIn = this.checkSignedInStatus();

    this.state = {
      isSignedIn,
      person: undefined
    }

    if(isSignedIn) {
      this.loadPerson();
    }

    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  checkSignedInStatus() {
    if (blockstack.isUserSignedIn()) {
      return true;
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function(userData) {
        window.location = window.location.origin
      })
      return false;
    }
  }

  loadPerson() {
    let username = blockstack.loadUserData().username

    blockstack.lookupProfile(username).then((person) => {
      this.setState({ person })
    })
  }
  //
  // handleSignIn(event) {
  //   event.preventDefault();
  //   blockstack.redirectToSignIn()
  // }

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    blockstack.redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  handleSignOut(event) {
    event.preventDefault();
    blockstack.signUserOut(window.location.href)
  }

  render() {
    const { isSignedIn } = this.state

    return (
      <div className='app'>
        <header className="header">
          <h3 className="header__small-title">Blockstack+React</h3>
          <h1 className="header__title">Todo</h1>
        </header>

        {!isSignedIn &&
        <div>
          <div className='user'>
            <UserInfo>Welcome!</UserInfo>
            <button className='app__button' onClick={this.handleSignIn}>
              Sign In with Blockstack
            </button>
          </div>
          <Landing/>
        </div>
        }

        {isSignedIn &&
        <div>
          <div className='user'>
            <UserInfo user={this.state.person} />
            <button className='app__button' onClick={this.handleSignOut}>
              Sign Out
            </button>
          </div>
          <Dashboard>Dashboard</Dashboard>
        </div>
        }
      </div>
    )
  }
}

export default App;
