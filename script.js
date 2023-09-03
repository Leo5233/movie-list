const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const pagination = document.querySelector("#pagination");
const ModeBtn = document.querySelector(".change-mode");

const RenderMODE = {
  IMAGE_MODE: "IMAGE_MODE",
  LIST_MODE: "LIST_MODE"
};

const model = {
  BASE_URL: "https://webdev.alphacamp.io",
  index_URL: "",
  POSTER_URL: "",
  movies: [],
  filterMovie: [],
  thisPageMovies: [],
  generateDataURL() {
    this.index_URL = this.BASE_URL + "/api/movies/";
    this.POSTER_URL = this.BASE_URL + "/posters/";
  },
  movieOnePage: 12,
  nowPage: 1,
  CURRENT_MODE: RenderMODE.IMAGE_MODE
};

const view = {
  displayMovieImageMode(data) {
    let rawHTML = "";
    data.forEach((item) => {
      rawHTML += ` <div class="col-sm-3">
                <div class='mb-2 mr-2'>
                    <div class="card" style="width: 17rem; height: 100%; min-height:320px;">
                        <img src="${model.POSTER_URL + item.image}"
                            class="card-img-top" alt="movie posters">
                        <div class="card-body">
                            <h5 class="card-title">${
                              item.title
                            }</h5>                      
                        </div>
                        <div class="card-footer">
                            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id='${
                              item.id
                            }'>
                                more
                            </button>
                            <button class="btn btn-info btn-add-favorite "data-id='${
                              item.id
                            }'>+</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    dataPanel.innerHTML = rawHTML;
  },
  displayMovieListMode(data) {
    let rawHTML = "";

    data.forEach((item) => {
      rawHTML += `<div class="list-body ">
                    <div class='list-movie-title'>
                    <h5 class="card-title">
                       ${item.title}
                    </h5>   
                    </div>
                    <div class='list-movie-btn'>
                     <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id='${item.id}'>more</button>
                     <button class="btn btn-info btn-add-favorite "data-id='${item.id}'>+</button>
                     </div>
                  </div>
             <hr>`;
    });
    dataPanel.innerHTML = rawHTML;
  },
  showModalMovie(movieID) {
    axios.get(model.index_URL + movieID).then((response) => {
      const target = response.data.results;
      const name = document.querySelector("#movie-modal-title");
      const releaseDate = document.querySelector("#movie-modal-date");
      const description = document.querySelector("#movie-modal-description");
      const movieImage = document.querySelector("#movie-modal-image img");
      name.innerText = target.title;
      releaseDate.innerText = "Release Date: " + target.release_date;
      description.innerText = target.description;
      movieImage.src = model.POSTER_URL + target.image;
    });
  },
  showPagination(movieOnePage, movies) {
    const pages = Math.ceil(movies.length / movieOnePage);
    let rawHTML = "";
    for (let i = 1; i <= pages; i++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
    }
    pagination.innerHTML = rawHTML;
  },
  slicePage(movies) {
    model.thisPageMovies = movies.slice(
      12 * (model.nowPage - 1),
      12 * model.nowPage
    );
  },
  renderPage(movies = model.movies) {
    this.showPagination(model.movieOnePage, movies);
    this.slicePage(movies);
    if (model.CURRENT_MODE === RenderMODE.IMAGE_MODE) {
      this.displayMovieImageMode(model.thisPageMovies);
    } else if (model.CURRENT_MODE === RenderMODE.LIST_MODE) {
      this.displayMovieListMode(model.thisPageMovies);
    }
  }
};

const controller = {
  addToFavorite(movieID) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const movie = model.movies.find((item) => item.id === movieID);
    if (list.every((item) => item.id !== movie.id)) {
      list.push(movie);
      localStorage.setItem("favoriteMovies", JSON.stringify(list));
    } else {
      alert("this movie is already in favorite!");
    }
  },
  changePage(event) {
    if (event.target.matches(".page-link")) {
      model.nowPage = Number(event.target.innerText);
      const data = model.filterMovie.length ? model.filterMovie : model.movies;
      view.renderPage(data);
    }
  },
  setDefaultPage() {
    model.generateDataURL();
    axios.get(model.index_URL).then((response) => {
      this.getAllMovies(response.data.results);
      view.renderPage();
    });
  },
  getAllMovies(movies) {
    model.movies.push(...movies);
  },
  moreClicked(event) {
    let movieID = Number(event.target.dataset.id);
    if (event.target.matches(".btn-show-movie")) {
      view.showModalMovie(movieID);
    } else if (event.target.matches(".btn-add-favorite")) {
      controller.addToFavorite(movieID);
    }
  },
  submitSearchForm() {
    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword.length) {
      alert("please enter valid string");
    } else {
      model.filterMovie = model.movies.filter((movie) =>
        movie.title.toLowerCase().includes(keyword)
      );
      model.nowPage = 1;
      if (!model.filterMovie.length) {
        alert(`No search result with keyword: ${keyword}`);
        view.renderPage();
      } else {
        console.log(model.filterMovie.length);
        view.renderPage(model.filterMovie);
      }
    }
  },
  changeDisplayMode(event) {
    if (event.target.classList.contains("picMode")) {
      model.CURRENT_MODE = RenderMODE.IMAGE_MODE;
    } else if (event.target.classList.contains("listMode")) {
      model.CURRENT_MODE = RenderMODE.LIST_MODE;
    }
    const data = model.filterMovie.length ? model.filterMovie : model.movies;
    view.renderPage(data);
  }
};

controller.setDefaultPage();

dataPanel.addEventListener("click", (event) => controller.moreClicked(event));

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controller.submitSearchForm();
});

pagination.addEventListener("click", controller.changePage);

modeBtn.addEventListener("click", (event) => {
  controller.changeDisplayMode(event);
});
