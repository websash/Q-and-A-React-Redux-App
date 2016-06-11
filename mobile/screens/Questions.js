import React, {Component} from 'react'
import {StyleSheet, StatusBar, Text, View, ListView, TouchableOpacity} from 'react-native'
import ViewContainer from '../components/ViewContainer'
import Question from '../components/Question'
import StatusBarBg from '../components/StatusBarBg'

const questions = [
  {id: 1, title: "Lorem ipsum dolor sit amet", text: "barbaz"},
  {id: 2, title: "Consectetur adipiscing elit", text: "foobaz"},
  {id: 3, title: "Morbi blandit sodales", text: "foobar"},
  {id: 4, title: "Phasellus quis dui", text: "bar"},
  {id: 5, title: "Nunc elementum ornare", text: "foobar"},
  {id: 6, title: "Curabitur eu mauris", text: "foobar"},
]

class Questions extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2})
    this.state = {questionsDataSrc: ds.cloneWithRows(questions)}
    this.renderRow = this.renderRow.bind(this)
    this.navToAnswers = this.navToAnswers.bind(this)
  }

  navToAnswers(row) {
    this.props.navigator.push({id: 'Answers', title: 'Answers', row})
  }

  renderRow(row) {
    return <Question {...row} onPress={this.navToAnswers} />
  }

  render() {
    return (
      <ViewContainer>
        <StatusBarBg style={{backgroundColor: '#ababad'}} />
        <ListView style={{padding: 15, marginTop: 10}}
          dataSource={this.state.questionsDataSrc}
          renderRow={this.renderRow} />
      </ViewContainer>
    )
  }
}

export default Questions
