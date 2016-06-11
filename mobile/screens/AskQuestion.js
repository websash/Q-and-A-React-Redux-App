import React, {Component} from 'react'
import {StyleSheet, StatusBar, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import ViewContainer from '../components/ViewContainer'
import StatusBarBg from '../components/StatusBarBg'

class AskForm extends Component {
  render() {
    return (
      <ViewContainer>
        <StatusBarBg style={{backgroundColor: '#ababad'}} />
        <ScrollView style={{padding: 15}}>
          <Text style={{marginTop: 40, marginHorizontal: 15}}>
            ASK QUESTION SCREEN
          </Text>
        </ScrollView>
      </ViewContainer>
    )
  }
}

export default AskForm
