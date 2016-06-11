import React, {Component} from 'react'
import {AppRegistry, PixelRatio, Text, StyleSheet,
  Navigator, TouchableOpacity} from 'react-native'
import Questions from './screens/Questions'
import Answers from './screens/Answers'
import AskQuestion from './screens/AskQuestion'
import Profile from './screens/Profile'

const NavBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index === 0) return null
    const previousRoute = navState.routeStack[index - 1]
    return (
      <TouchableOpacity onPress={() => navigator.pop()}
        style={s.navBarLeftButton}>
        <Text style={[s.navBarText, s.navBarButtonText]}>
          Back
        </Text>
      </TouchableOpacity>
    )
  },

  RightButton(route, navigator, index, navState) {
    return null
  },

  Title(route, navigator, index, navState) {
    return (
      <Text style={[s.navBarText, s.navBarTitleText]}>
        {route.title || `[${index}]`}
      </Text>
    )
  },
}

class AppNavigator extends Component {

  renderScene(route, navigator) {
    const props = {navigator}

    switch(route.id) {
      case 'Answers':
        return <Answers {...props} question={route.row} />
      case 'AskQuestion':
        return <AskQuestion {...props} />
      case 'Profile':
        return <Profile {...props} />
      default:
        return <Questions {...props} />
    }
  }

  render() {
    return (
      <Navigator
        title="Questions"
        initialRoute={this.props.initialRoute}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavBarRouteMapper}
            style={s.navBar} />
        }
        ref="appNavigator"
        renderScene={this.renderScene} />
    )
  }
}

export default AppNavigator

const s = StyleSheet.create({
  navBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#555',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: 'rgb(0, 122, 255)',
  }
})
