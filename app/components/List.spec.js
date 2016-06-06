import test from 'ava'
import sinon from 'sinon'
import {intoDoc} from '../testutils'
import List from './List'

const _props = {
  pageCount: 1,
  renderItem() {},
  items: [
    {prop: 'foo', id: 1},
    {prop: 'bar', id: 2},
    {prop: 'baz', id: 3}
  ],
  isFetching: false,
  nextPageUrl: 'http://moreinfo',
  onLoadMore() {}
}

test('Renders with the .list className', t => {
  const node = intoDoc(List, _props).querySelector('.list')
  t.truthy(node)
})

test('Renders with the .list className and one from props', t => {
  _props.className = 'given-class-name'
  const node = intoDoc(List, _props).querySelector('.list.given-class-name')
  t.truthy(node)
})

test('Invokes `renderItem` for each item in the `items` array', t => {
  _props.renderItem = sinon.spy()
  intoDoc(List, _props)
  t.true(_props.renderItem.calledWith({prop: 'foo', id: 1}))
  t.true(_props.renderItem.calledWith({prop: 'bar', id: 2}))
  t.true(_props.renderItem.calledWith({prop: 'baz', id: 3}))
  t.true(_props.renderItem.calledThrice)
})

test('Renders spinner', t => {
  const node = intoDoc(List, _props).querySelector('.list > :last-child.spinner')
  t.truthy(node)
})

test.todo('scroll behavior')
