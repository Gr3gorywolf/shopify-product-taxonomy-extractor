const axios = require('axios');
const fs = require('fs');
const { ISO_LANGS } = require('./utils/constants');
const { parseTaxonomy } = require('./utils/parser');

const distFolder = `${__dirname}/../dist`
const rawFiles = {}
const parsedTaxonomies = {}




async function parseTaxonomies() {
 const parsed =  await parseTaxonomy(rawFiles['es'])
 fs.writeFileSync(`${distFolder}/parsed/es.json`,JSON.stringify(parsed));
}

async function fetchRawTaxonomies(useCacheOnly = false) {
  const baseUrl = 'https://help.shopify.com/txt/product_taxonomy'
  for (let lang of ISO_LANGS) {
    const fileName = `${distFolder}/raw/${lang}.txt`;
    if (fs.existsSync(fileName)) {
      rawFiles[lang] = fs.readFileSync(fileName).toString();
    } else
      if (!useCacheOnly) {
        try {
          const res = await axios.get(`${baseUrl}/${lang}.txt`, {
            responseType: 'text'
          });
          fs.writeFileSync(fileName, res.data);
          rawFiles[lang] = res.data;
        } catch (err) {
          console.log(`failed to get  the ${lang} taxonomy`)
        }
      }
  }
}

async function prepare() {
  const dirs = [distFolder, `${distFolder}/raw`, `${distFolder}/parsed`]
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir);
    }
  })
}

async function extract() {
  console.log('Preparing...')
  await prepare()
  console.log('Fetching...')
  await fetchRawTaxonomies(true);
  console.log('Parsing...')
  await parseTaxonomies();
}

extract();
