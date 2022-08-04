/**
 * app namespace
 * @namespace app
 */

const vm = new Vue ({
  el: '#vue-instance',

   /**
 * Data Function
 * 
 * @function data
 * @memberof app
 * 
 */
  data () {
    return {
      baseUrl: 'http://localhost:3000', // API url
      searchTerm: 'Hello World', // Default search term
      searchDebounce: null, // Timeout for search bar debounce
      searchResults: [], // Displayed search results
      numHits: null, // Total search results found
      searchOffset: 0, // Search result pagination offset

      selectedParagraph: null, // Selected paragraph object
      bookOffset: 0, // Offset for book paragraphs being displayed
      paragraphs: [] // Paragraphs being displayed in book preview window
    }
  },


   /**
 * Created Function
 * 
 * @function created
 * @memberof app
 * 
 */
  async created () {
    this.searchResults = await this.search() // Search for default term
  },
  methods: {
     /**
 * Debounce search input by 100 ms
 * 
 * @function onSearchInput
 * @memberof app
 * 
 */
    onSearchInput () {
      clearTimeout(this.searchDebounce)
      this.searchDebounce = setTimeout(async () => {
        this.searchOffset = 0
        this.searchResults = await this.search()
      }, 100)
    },
    /**
 * Call API to search for inputted term 
 * 
 * @function search
 * @memberof app
 * 
 */
    async search () {
      const response = await axios.get(`${this.baseUrl}/search`, { params: { term: this.searchTerm, offset: this.searchOffset } })
      this.numHits = response.data.hits.total
      return response.data.hits.hits
    },
    /**
 * Get next page of search results
 * 
 * @function nextResultsPage
 * @memberof app
 * 
 */
    async nextResultsPage () {
      if (this.numHits > 10) {
        this.searchOffset += 10
        if (this.searchOffset + 10 > this.numHits) { this.searchOffset = this.numHits - 10}
        this.searchResults = await this.search()
        document.documentElement.scrollTop = 0
      }
    },

     /**
 * Get previous page of search results
 * 
 * @function prevResultsPage
 * @memberof app
 * 
 */
    async prevResultsPage () {
      this.searchOffset -= 10
      if (this.searchOffset < 0) { this.searchOffset = 0 }
      this.searchResults = await this.search()
      document.documentElement.scrollTop = 0
    },


    /**
 * Call the API to get current page of paragraphs
 * 
 * @function getParagraphs
 * @memberof app
 * @param  {} bookTitle
 * @param  {} offset
 */
    async getParagraphs (bookTitle, offset) {
      try {
        this.bookOffset = offset
        const start = this.bookOffset
        const end = this.bookOffset + 10
        const response = await axios.get(`${this.baseUrl}/paragraphs`, { params: { bookTitle, start, end } })
        return response.data.hits.hits
      } catch (err) {
        console.error(err)
      }
    },
    /**
 * Get next page (next 10 paragraphs) of selected book
 * 
 * @function nextBookPage
 * @memberof app
 * 
 */
    async nextBookPage () {
      this.$refs.bookModal.scrollTop = 0
      this.paragraphs = await this.getParagraphs(this.selectedParagraph._source.title, this.bookOffset + 10)
    },

    /**
 * Get previous page (previous 10 paragraphs) of selected book
 * 
 * @function prevBookPage
 * @memberof app
 * 
 */
    async prevBookPage () {
      this.$refs.bookModal.scrollTop = 0
      this.paragraphs = await this.getParagraphs(this.selectedParagraph._source.title, this.bookOffset - 10)
    },


    /**
 * Display paragraphs from selected book in modal window
 * 
 * @function showBookModal
 * @memberof app
 * 
 */
    async showBookModal (searchHit) {
      try {
        document.body.style.overflow = 'hidden'
        this.selectedParagraph = searchHit
        this.paragraphs = await this.getParagraphs(searchHit._source.title, searchHit._source.location - 5)
      } catch (err) {
        console.error(err)
      }
    },


    /**
 * Close the book detail modal
 * 
 * @function closeBookModal
 * @memberof app
 * 
 */
    closeBookModal () {
      document.body.style.overflow = 'auto'
      this.selectedParagraph = null
    }
  }
})
