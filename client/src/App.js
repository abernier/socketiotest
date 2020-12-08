import React from 'react'

import { io } from 'socket.io-client'
import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_APIURL || ""}/api`,
  withCredentials: true
})

class App extends React.Component {
  state = {orderId: ""}

  socket = io(`${process.env.REACT_APP_APIURL || ""}/`, {
    autoConnect: false,
  })

  componentDidMount() {
    this.socket.on('order:update', (order) => {
      alert('order has just updated from server:', order.status)
    })

    this.socket.connect()
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    return (
      <>
        <input type="text" value={this.state.orderId} onChange={e => this.setState({orderId: e.target.value})} />
        
        <button onClick={e => {
          this.socket.emit('order:subscribe', this.state.orderId)
        }}>Subscribe to order #{this.state.orderId}</button>
      </>
    );
  }  
}

export default App;
