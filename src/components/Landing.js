import React from 'react'
import './landing.css'

class Landing extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='landing'>
          <img className='landing__screenshot-image' src='/screenshot.gif' />
        </div>
      </div>
    )
  }
}

export default Landing
