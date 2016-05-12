const exec = require('child_process').exec

const db = 'q_and_a'
const host = 'localhost'
const dir = 'db'

const p = exec(`mongo ${db} --quiet --eval "print(db.getCollectionNames())"`)

p.stdout.on('data', data => data.split(',').forEach(exportCollection))
p.stderr.on('data', data => console.error(data))

function exportCollection(collection) {
  const coll = collection.trim()
  const p = exec(
    `mongoexport --host ${host} -d ${db} -c ${coll} --jsonArray --pretty -o ${dir}/${coll}.json`
  )

  p.stdout.on('data', data => console.log(data))

  // mongoexport returns everything on stderr WTF!!!
  p.stderr.on('data', data => console.log(data.trim()))
}
