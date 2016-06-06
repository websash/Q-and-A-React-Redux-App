import test from 'ava'
import {intoDoc} from '../testutils'
import Question from './Question'

const _props = {
  user: {
    id: 'xxx',
    avatar: 'http://foo.com/ava.png',
    name: 'Jack Johnson'
  },
  link: '/slug=Id',
  title: 'Test Question',
  text: 'Test question details',
  created: 'Apr 3',
  createdAt: '2016-04-03',
  ansCount: 4
}

test('Condensed: renders question title', t => {
  _props.condensed = true
  const selector = 'li h3 a[href="/slug=Id"]'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.textContent, 'Test Question')
})

test('Condensed: renders time created', t => {
  _props.condensed = true
  const selector = 'li time[dateTime="2016-04-03"]'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.textContent, 'Apr 3')
})

test('Condensed: renders number of answers', t => {
  _props.condensed = true
  const node = intoDoc(Question, _props)
  t.true(/\b4 ans\./.test(node.innerHTML))
})

test('Condensed: renders user\'s avatar', t => {
  _props.condensed = true
  const selector = 'li a.avatar[href="/users/xxx"] img'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.src, 'http://foo.com/ava.png')
})

test('Condensed: renders user\'s name', t => {
  _props.condensed = true
  const selector = 'li a.uname[href="/users/xxx"]'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.textContent, 'Jack Johnson')
})


test('Detailed: renders question title', t => {
  _props.condensed = false
  const selector = 'h2'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.textContent, 'Test Question')
})

test('Detailed: renders question body', t => {
  _props.condensed = false
  const node = intoDoc(Question, _props)
  t.true(/\bTest question details\b/.test(node.innerHTML))
})

test('Detailed: renders user\'s avatar', t => {
  _props.condensed = false
  const selector = 'a.avatar[href="/users/xxx"] img'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.src, 'http://foo.com/ava.png')
})

test('Detailed: renders user\'s name', t => {
  _props.condensed = false
  const selector = 'a.uname[href="/users/xxx"]'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.textContent, 'Jack Johnson')
})

test('Detailed: renders time created', t => {
  _props.condensed = false
  const selector = 'time[dateTime="2016-04-03"]'
  const node = intoDoc(Question, _props).querySelector(selector)
  t.truthy(node, selector)
  t.is(node.textContent, 'Apr 3')
})

test('Detailed: renders number of answers (plural)', t => {
  _props.condensed = false
  const node = intoDoc(Question, _props)
  t.true(/\b4 answers\b/.test(node.innerHTML))
})

test('Detailed: renders number of answers (sing)', t => {
  _props.condensed = false
  _props.ansCount = 1
  const node = intoDoc(Question, _props)
  t.true(/\b1 answer\b/.test(node.innerHTML))
})

test('Detailed: does not render zero number of answers', t => {
  _props.condensed = false
  _props.ansCount = 0
  const node = intoDoc(Question, _props)
  t.false(/\b0 answer/.test(node.innerHTML))
})
