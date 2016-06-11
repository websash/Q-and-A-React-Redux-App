import React, {Component} from 'react'
import {StyleSheet, AppRegistry, TabBarIOS} from 'react-native'
import AppNavigator from './Navigator'
import Icon from 'react-native-vector-icons/Ionicons'

class q_and_a extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'questions'
    }
  }

  render() {
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>

        <Icon.TabBarItemIOS title="Questions"
          iconName="ios-paper-outline"
          selected={this.state.selectedTab === 'questions'}
          onPress={() => this.setState({selectedTab: 'questions'})}>
          <AppNavigator initialRoute={{id: 'Questions', title: 'Questions'}}/>
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS title="Ask Question"
          iconName="ios-create-outline"
          selected={this.state.selectedTab === 'ask'}
          onPress={() => this.setState({selectedTab: 'ask'})}>
          <AppNavigator initialRoute={{id: 'AskQuestion', title: 'Ask Question'}}/>
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS title="My Profile"
          iconName="ios-contact-outline"
          selected={this.state.selectedTab === 'profile'}
          onPress={() => this.setState({selectedTab: 'profile'})}>
          <AppNavigator initialRoute={{id: 'Profile', title: 'My Profile'}}/>
        </Icon.TabBarItemIOS>

      </TabBarIOS>
    )
  }
}

AppRegistry.registerComponent('q_and_a', () => q_and_a)
