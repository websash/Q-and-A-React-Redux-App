import React, {Component} from 'react'
import {StyleSheet, Text, View, ListView, TouchableHighlight} from 'react-native'
import ViewContainer from '../components/ViewContainer'
import StatusBarBg from '../components/StatusBarBg'
import Icon from 'react-native-vector-icons/FontAwesome'

class Answers extends Component {

  handlePress() {}

  render() {
    // console.log(this.props.navigator)
    return (
      <ViewContainer>
        <StatusBarBg style={{backgroundColor: '#ababad'}} />
        <View style={{marginTop: 60, marginHorizontal: 15}}>
          <Text>ANSWERS SCREEN</Text>
          <Text>{this.props.question.title}</Text>
        </View>
      </ViewContainer>
    )
  }
}

const s = StyleSheet.create({
})

export default Answers
