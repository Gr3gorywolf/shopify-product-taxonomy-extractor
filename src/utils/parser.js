const fs = require('fs');
const _ = require('lodash');
const { set } = require('lodash');
const { createHash } = require('./helpers');





const traverse = (obj) => {
  for (let k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      traverse(obj[k])
    } else {
      // Do something with obj[k]
    }
  }
}

/** This is a description of the foo function. 
 * @param {string} rawTaxonomy - The raw taxonomy (on string)
*/
async function parseTaxonomy(rawTaxonomy) {
  let lines = rawTaxonomy.split('\n');
  let result = [];
  let level = { result };
  for (let line of lines) {
    if (line.includes('#') || !line.includes('-')) continue;
    const [id, rawCategory] = line.split('-')
    rawCategory.split('>').reduce((r, name, i, a) => {
      const hash = createHash(name)
      if (!r[hash]) {
        r[hash] = { result: [] };
        const data = {
          name: name.trim(),
          id, children: r[hash].result
        }
        r.result.push(data);
      }
      return r[hash];
    }, level)
  }
 
  const idMapping = traverse(result);
   
  console.log({ idMapping })
  return result;
}



module.exports = {
  parseTaxonomy
}
