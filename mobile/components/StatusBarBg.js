import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'

class StatusBarBg extends Component {
  render() {
    return (
      <View style={[s.statusBarBg, this.props.style]}>
      </View>
    )
  }
}

const s = StyleSheet.create({
  statusBarBg: {
    height: 20,
    backgroundColor: 'white'
  }
})

export default StatusBarBg
