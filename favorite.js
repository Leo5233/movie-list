const BASE_URL = 'https://webdev.alphacamp.io'
const index_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function displayMovie(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += ` <div class="col-sm-3">
                <div class='mb-2 mr-2'>
                    <div class="card" style="width: 17rem; height: 550px;">
                        <img src="${POSTER_URL + item.image}"
                            class="card-img-top" alt="movie posters">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>                      
                        </div>
                        <div class="card-footer">
                            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id='${item.id}'>
                                more
                            </button>
                            <button class="btn btn-danger btn-remove-favorite "data-id='${item.id}'>x</button>
                        </div>
                    </div>
                </div>
            </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showModalMovie(movieID) {
  axios.get(index_URL + movieID).then(response => {
    const target = response.data.results
    const name = document.querySelector('#movie-modal-title')
    const releaseDate = document.querySelector('#movie-modal-date')
    const description = document.querySelector('#movie-modal-description')
    const movieImage = document.querySelector('#movie-modal-image img')
    name.innerText = target.title
    releaseDate.innerText = 'Release Date: ' + target.release_date
    description.innerText = target.description
    movieImage.src = POSTER_URL + target.image
  })
}

function removeFromFavorite(movieID){
  for (let i in movies){
    if (movies[i].id === movieID){
      movies.splice(i, 1)
      localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    }
  }

}

displayMovie(movies)


dataPanel.addEventListener('click', function moreClicked(event) {
  let movieID = Number(event.target.dataset.id)
  if (event.target.matches('.btn-show-movie')) {
    showModalMovie(movieID)
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(movieID)
    displayMovie(movies)
  }
})

