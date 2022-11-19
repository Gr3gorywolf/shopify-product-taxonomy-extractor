const { createHash } = require('./helpers');


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
          id:id.trim(), children: r[hash].result
        }
        r.result.push(data);
      }
      return r[hash];
    }, level)
  }
  return result;
}



module.exports = {
  parseTaxonomy
}
