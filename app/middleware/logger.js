export default store => next => action => {
  console.group(action.type)
  console.log('dispatching', action)
  const result = next(action)
  console.info('STATE', store.getState())
  console.groupEnd(action.type)
  return result
}
