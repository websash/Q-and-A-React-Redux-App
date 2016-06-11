import React, {Component} from 'react'
import {View, StyleSheet, StatusBar} from 'react-native'

class ViewContainer extends Component {
  render() {
    return (
      <View style={[s.viewContainer, this.props.style]}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        {this.props.children}
      </View>
    );
  }
}

const s = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#eee'
  }
})

export default ViewContainer
