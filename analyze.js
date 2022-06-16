const fs = require('fs')
const flatten = require('flat')

console.log('Starting...')

const wikievaBasePath = '../rescue-wikieva/output/'
const faunaBasePath = '../rescue-fauna/output/'

const wikievaTaxonomy = flatten(JSON.parse(fs.readFileSync(wikievaBasePath + 'taxonomy/taxonomy.json', 'utf-8')), {delimiter: '->', maxDepth: 7})
const faunaTaxonomy = flatten(JSON.parse(fs.readFileSync(faunaBasePath + 'taxonomy/taxonomy.json', 'utf-8')), {delimiter: '->', maxDepth: 7})

let speciesNotFoundInWikieva = 0
let differentTaxonomiesInWikieva = 0
let speciesFoundInWikieva = 0
let differentTaxonomies = []

Object.keys(faunaTaxonomy).forEach((key) => {
    let faunaSpecies = key.split('->')[6]

    let wikievaTaxonomyIndex = Object.keys(wikievaTaxonomy).findIndex(k => k.split('->')[6] === faunaSpecies)
    if (wikievaTaxonomyIndex !== -1) {
      speciesFoundInWikieva++
      if (!wikievaTaxonomy[key]) {
        differentTaxonomies.push('Wikieva: ' + Object.keys(wikievaTaxonomy)[wikievaTaxonomyIndex] + '\n' + 'Fauna:   ' + key)
        differentTaxonomiesInWikieva++
      }
    } else {
      speciesNotFoundInWikieva++
    }
})

let speciesNotFoundInFauna = 0
let speciesWithDescriptionsNotFoundInFauna = 0
let differentTaxonomiesInFauna = 0
let speciesFoundInFauna = 0
let notFoundWithDescription = []

Object.keys(wikievaTaxonomy).forEach((key) => {
    let wikievaSpecies = key.split('->')[6]
    let faunaTaxonomyIndex = Object.keys(faunaTaxonomy).findIndex(k => k.split('->')[6] === wikievaSpecies)
    if (faunaTaxonomyIndex !== -1) {
      speciesFoundInFauna++
      if (!faunaTaxonomy[key]) {
        let item = 'Wikieva: ' + key + '\n' + 'Fauna:   ' + Object.keys(faunaTaxonomy)[faunaTaxonomyIndex]
        if (differentTaxonomies.indexOf(item) === -1) differentTaxonomies.push(item)
        differentTaxonomiesInFauna++
      }
    } else {
      speciesNotFoundInFauna++
      if (wikievaTaxonomy[key].hasDescription) {
        notFoundWithDescription.push(wikievaSpecies + ' (' + wikievaTaxonomy[key].risk + ')')
        speciesWithDescriptionsNotFoundInFauna++
      }
    }
})

console.log()
console.log('Resumen del cruce entre el libro rojo y Wikieva:')
console.log('-----------------------------------------------:')
console.log('Número de especies en el libro rojo que están en Wikieva:', speciesFoundInWikieva)
console.log('Número de especies en el libro rojo que no están en Wikieva:', speciesNotFoundInWikieva)
console.log('Número de especies clasificadas de diferente manera entre el libro rojo y Wikieva:', differentTaxonomiesInWikieva)
console.log('Número de especies en Wikieva que no están en el libro rojo:', speciesNotFoundInFauna)
console.log('Número de especies en Wikieva (con descripción) que no están en el libro rojo:', speciesWithDescriptionsNotFoundInFauna)
console.log()
console.log('Diferencias de clasificación entre Wikieva y el libro rojo:')
console.log('-----------------------------------------------------------')
console.log()

differentTaxonomies.sort().forEach(item => {console.log(item); console.log();})
console.log('Lista de especies en Wikieva (con descripción) que no están en el libro rojo:')
console.log('-----------------------------------------------------------------------------')
notFoundWithDescription.sort().forEach(item => console.log(item))
