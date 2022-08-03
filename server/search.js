/**
 * search namespace
 * @namespace search
 */

const { client, index, type } = require('./connection')

module.exports = {
  /**
 * Query ES index for the provided term 
 * @function queryTerm
 * @memberof search
 * 
 * @param  {} term
 * @param  {} offset
 * 
 * @see {@link connection} for further information.
 * 
 */
  queryTerm (term, offset = 0) {
    const body = {
      from: offset,
      query: { match: {
        text: {
          query: term,
          operator: 'and',
          fuzziness: 'auto'
        } } },
      highlight: { fields: { text: {} } }
    }

    return client.search({ index, type, body })
  },

  /**
 * Get the specified range of paragraphs from a book 
 * @function getParagraphs
 * @memberof search
 * 
 * @param  {} bookTitle
 * @param  {} startLocation
 * @param  {} endLocation
 * 
 * @see {@link connection} for further information.
 * 
 */
  getParagraphs (bookTitle, startLocation, endLocation) {
    const filter = [
      { term: { title: bookTitle } },
      { range: { location: { gte: startLocation, lte: endLocation } } }
    ]

    const body = {
      size: endLocation - startLocation,
      sort: { location: 'asc' },
      query: { bool: { filter } }
    }

    return client.search({ index, type, body })
  }
}
