/**
 * test_queries namespace
 * @namespace test_queries
 */

const { client, index, type } = require('./connection')


/**
 * returns the number of objects it counted  
 * 
 * @function count
 * @memberof test_queries
 * 
 */
async function count () {
  const result = await client.count({ index, type })
  console.log('count', result)
}


/**
 * runs unit test 1
 * 
 * @function testSearch
 * @memberof test_queries
 * 
 */
async function testSearch () {
  const result = await client.search({
    index,
    type,
    body: {
      query: {
        match: { 'Title': 'Hound' }
      }
    }
  })

  console.log('testSearch', result)
}


/**
 * runs unit test 2
 * 
 * @function testSearch2
 * @memberof test_queries
 * 
 */
async function testSearch2 () {
  const result = await client.search({
    index,
    type,
    body: {
      query: {
        match: { 'Text': 'opium den sherlock' }
      },
      highlight: {
        fields: {
          Text: {}
        }
      }
    }
  })

  console.log('testSearch2', result)
  for (let hit of result.hits.hits) {
    console.log(hit._source.Text)
    console.log(hit.highlight.Text)
  }
}

async function main () {
  await count()
  await testSearch()
  await testSearch2()
}

main()
