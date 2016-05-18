module.exports =
  process.env.NODE_ENV !== 'production'
    ? require('./store.dev') : require('./store.prod')
