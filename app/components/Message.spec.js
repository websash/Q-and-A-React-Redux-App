import test from 'ava'
import sinon from 'sinon'
import {intoDoc} from '../testutils'
import {Simulate} from 'react/lib/ReactTestUtils'
import Message from './Message'

test('Renders the message', t => {
  let node = intoDoc(Message, {text: 'Got message'}).querySelector('.msg')
  t.truthy(node, '.msg')
  t.is(node.textContent, 'Got message')

  node = intoDoc(Message, {counter: 1, text: 'Got message'}).querySelector('.msg')
  t.is(node.textContent, 'Got message')

  node = intoDoc(Message, {counter: 5, text: 'Got message'}).querySelector('.msg')
  t.is(node.textContent, '5) Got message')
})

test('Renders close button', t => {
  const node = intoDoc(Message, {text: 'Got message'}).querySelector('.btn-x')
  t.truthy(node, '.btn-x')
  t.true(/.+/.test(node.textContent))
})

test('Close button invokes `onDismissMessage` when clicked', t => {
  const _props = {text: 'Got message', onDismissMessage: sinon.spy()}
  const btn = intoDoc(Message, _props).querySelector('.btn-x')

  Simulate.click(btn)

  t.true(_props.onDismissMessage.calledOnce)
  t.true(_props.onDismissMessage.calledWith('Got message'))
})
