const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const db = 'q_and_a'
const host = 'localhost'
const dir = 'fixtures'

fs.readdir('./db', (err, files) => {
  if (err) throw new Error(err)
  files = files.filter(file => path.extname(file) === '.json')
  files.forEach(importCollection)
})

function importCollection(file) {
  const p = exec(
    `mongoimport --host ${host} --db ${db} --jsonArray -c ${file.slice(0, -5)} --file ${dir}/${file}`
  )

  p.stdout.on('data', data => console.log(data))

  // mongoimport returns everything on stderr WTF!!!
  p.stderr.on('data', data => console.log(data.trim()))
}
