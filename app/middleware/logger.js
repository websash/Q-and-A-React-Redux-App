export default store => next => action => {
  if (process.browser) {
    console.groupCollapsed(action.type)
    console.log('dispatching', action)
    const result = next(action)
    console.info('STATE', store.getState())
    console.groupEnd(action.type)
    return result
  } else {
    console.log('→ dispatching', action.type)
    return next(action)
  }
}
