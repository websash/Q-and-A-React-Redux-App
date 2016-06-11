import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {StyleSheet, Image, Text, View,
  ListView, TouchableOpacity} from 'react-native'

const Question = ({id, title, text, onPress}) =>
  <View style={s.row}>
    <TouchableOpacity activeOpacity={0.5}
      onPress={_ => onPress({id, title, text})}>
      <View style={s.touchable}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../assets/avatar.png')} style={{
            width: 28,
            height: 28,
            opacity: 0.55,
            marginRight: 8
          }} />
          <Text style={s.question}>{title}</Text>
        </View>
        <Icon name="chevron-right" size={12} style={s.iconMore} />
      </View>
    </TouchableOpacity>
  </View>

export default Question

const s = StyleSheet.create({
  question: {
    color: '#5b5b5d',
    fontSize: 16
  },
  row: {
    borderBottomColor: '#6b6b6d',
    borderBottomWidth: .5,
  },
  touchable: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconMore: {
    color: '#5b5b5d'
  }
})
