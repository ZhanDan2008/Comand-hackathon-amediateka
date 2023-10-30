
// //? connections add modal
const updateForm = document.querySelector("#edit-movie-form");
const edit_title = document.querySelector("#edit_title");
const edit_image = document.querySelector("#edit_image");
const edit_description = document.querySelector("#edit_description");
const edit_plot=document.querySelector("#edit_plot")
const edit_genre=document.querySelector("#edit_genre")
const edit_actors=document.querySelector("#edit_actors")
const edit_directors=document.querySelector("#edit_directors")
const edit_year=document.querySelector("#edit_year")
const edit_country = document.querySelector("#edit_country")
const edit_rating=document.querySelector("#edit_rating")
const edit_modal = document.querySelector("#edit-movie-modal");
const edit_form = document.querySelector("#edit-movie-form");
let moovieId = 0;



// ?MAIN_VARIABLES
const USERS_API = "http://localhost:8000/users";
const MOOVIE_API = "http://localhost:8000/moovies";

// !REGISTRATION
// ?ПЕРЕМЕННЫЕ
const logout_btn = document.getElementById("logout_id");
const login_btn = document.getElementById("login_id");
const registration_modal = document.querySelector("#registration_id_modalka");
const login_modal = document.getElementById("login_modal");
const register_btn = document.querySelector("#register_id");  
const register_btn_finish = document.querySelector("#finish_registration_btn");
const login_btn_finish = document.querySelector("#finish_login_btn");
const username_value = document.getElementById("username_id");
const age_value = document.getElementById("age_id");
const password_value = document.getElementById("password_id");
const password_conf_value = document.getElementById("password_conf_id");
const place_for_errors = document.querySelector("#errors_in_register");
const place_for_errors_in_login = document.querySelector("#errors_in_login");
const login_username_value = document.querySelector("#username_login_id");
const login_password_value = document.querySelector("#password_login_id");
// !ADMIN PANEL
const admin_panel_btn = document.getElementById("admin_panel")
const admin_panel = document.getElementById("admin_panel_id")
const place_for_errors_in_admin_panel = document.getElementById("place_for_errors_in_admin_panel")
// *FUNCTIONS
function show_login_logout_register_buttons() {
  if (login_user_or_not()) {
    if (localStorage.getItem("username") === "admin@gmail.com") {
      admin_panel_btn.style.display = "flex";
    }
    login_btn.style.display = "none";
    logout_btn.style.display = "block";
    login_btn.style.backgroundColor = "#ffc107";
    register_btn.style.display = "none";
    return;
  }
  admin_panel_btn.style.display = "none";
  logout_btn.style.display = "none";
  register_btn.style.display = "block";
  login_btn.style.display = "block";
}
show_login_logout_register_buttons();
async function get_all_users_or_moovies(what) {
  if (what == "users") {
    let a = await fetch(USERS_API);
    let b = await a.json();
    return b;
  }
  let a = await fetch(MOOVIE_API);
  let b = await a.json();
  return b;
}
async function checkUniqueUserName(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}
function save_username_in_localstorage(username) {
  localStorage.setItem("username", username);
  show_login_logout_register_buttons();
}
async function get_one_user(username) {
  let all_users = await get_all_users_or_moovies("users");
  return all_users.find((item) => item.username === username);
}
function login_user_or_not() {
  if (!localStorage.getItem("username")) {
    return false;
  }
  return true;
}
function check_admin_or_not() {
  if (localStorage.getItem("username") === "admin@gmail.com") {
    return true;
  }
  return false;
}
async function registerUser(e) {
  e.preventDefault();
  e.stopPropagation()
  if (
    username_value.value === "admin@gmail.com" &&
    password_value.value === "chocolate" &&
    age_value.value === "" &&
    password_conf_value.value === ""
  ) {
    place_for_errors.style.color = "green";
    place_for_errors.innerText = "С возвращеием Админ!";
    setTimeout(() => {
      
      registration_modal.style.display = "none";
      place_for_errors.innerText = "";
      place_for_errors.style.color = "red"
    }, 1000);
    save_username_in_localstorage(username_value.value);
    username_value.value = "";
    age_value.value = "";
    password_value.value = "";
    password_conf_value.value = "";

    render()

    return;
  }
  if (
    !username_value.value.trim() ||
    !age_value.value.trim() ||
    !password_value.value.trim() ||
    !password_conf_value.value.trim()
  ) {
    place_for_errors.innerText = "Не все поля заполнены!";
    return;
  }

  if (password_value.value !== password_conf_value.value) {
    place_for_errors.innerText = "Пароли не совпали!";
    return;
  }
  let uniqueUser = await checkUniqueUserName(username_value.value);
  if (uniqueUser) {
    place_for_errors.innerText = "Имя пользователя занято!";
    return;
  }

  let userObj = {
    username: username_value.value,
    age: age_value.value,
    password: password_value.value,
  };

  await fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  place_for_errors.style.color = "green";
  place_for_errors.innerText = "Успешно!";
  setTimeout(() => {
    place_for_errors.innerText = "";
    registration_modal.style.display = "none";
  }, 1000);
  save_username_in_localstorage(username_value.value);
  username_value.value = "";
  age_value.value = "";
  password_value.value = "";
  password_conf_value.value = "";
  show_login_logout_register_buttons()
}

register_btn.addEventListener("click", (e) => {
  registration_modal.style.display = "block";
});
register_btn_finish.addEventListener("click", registerUser);
//    !LOGOUT

function logout_function() {
  localStorage.removeItem("username");
  show_login_logout_register_buttons();
  render()
}
logout_btn.addEventListener("click", logout_function);

// !LOGIN
// ?переменные

// *FUNCTIONS
async function login_function(e) {
  e.stopPropagation()
  let all_users = await get_all_users_or_moovies("users");
  let a = all_users.filter(
    (item) =>
      item.username === login_username_value.value &&
      item.password === login_password_value.value
  );
  if (a.length === 0) {
    place_for_errors_in_login.innerText =
      "Нет такого пользователя.\nНеверный пароль или имя!";
    return;
  }
  save_username_in_localstorage(a[0].username);
  show_login_logout_register_buttons();
  place_for_errors_in_login.innerText = "Успех!";
  login_modal.style.display = "none";
}
login_btn.addEventListener("click", () => {
  login_modal.style.display = "block";
});
login_btn_finish.addEventListener("click", login_function);

// ! create
function showAddMovieModal() {
  document.getElementById("add-movie-modal").style.display = "block";
}

async function addMovie(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  const image = document.getElementById("image").value;
  let plot = document.getElementById("plot").value;
  const genre = document.getElementById("genre").value.split(', ');
  const country = document.getElementById("country").value;
  const actors = document.getElementById("actors").value.split(', ');
  const directors = document.getElementById("directors").value.split(', ');
  const year = document.getElementById("year").value;
  const rating = document.getElementById("rating").value;
  if(!title || !description || !image || !plot || !genre || !country || !actors || !directors || !year || !rating){
    place_for_errors_in_admin_panel.innerText = 'Не все поля заполнены!'
    return
  }
  if(description.length>200 || plot.length>200){
    let yes_or_not = confirm("Длина поля сюжета или описания превышают 500символов.Если нажмете yes, то мы сохраним первые 500 символов.Если no, то измените содержимое полей.")
    if(yes_or_not){
      plot = plot.slice(0,200)
      description = description.slice(0,200)
    }
    else{
      return;
    }
  }
  const movieData = {
    title,
    description,
    image,
    plot,
    genre,
    country,
    actors,
    directors,
    year,
    rating,
  };
  
  const response = await fetch(MOOVIE_API, {
    method: "POST",
    body: JSON.stringify(movieData),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image").value = "";
  document.getElementById("plot").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("country").value = "";
  document.getElementById("actors").value = "";
  document.getElementById("directors").value = "";
  document.getElementById("year").value = "";
  document.getElementById("rating").value = "";
  place_for_errors_in_admin_panel.style.color = 'green'
  place_for_errors_in_admin_panel.innerText = 'Успешно'
  setTimeout(()=>{
    place_for_errors_in_admin_panel.style.color = 'red'
    place_for_errors_in_admin_panel.innerText = ""
    document.getElementById("add-movie-modal").style.display = "none";
  },1000)


  render();
}


document
  .getElementById("admin_panel")
  .addEventListener("click", showAddMovieModal);

document.getElementById("add-movie-form").addEventListener("submit", addMovie);

// //! read

async function render() {

  const movieList = document.querySelector("#movie-list");
  const response = await fetch(MOOVIE_API);
  const movies = await response.json();
  movieList.innerHTML = "";
  
  movies.forEach((item) => {
    console.log(check_admin_or_not())
    movieList.innerHTML += `
        <div class="movie-list film_img item">
              <img class = 'card' id="${item.id}"

                src= ${item.image}
              />
              
              <p>${item.title}</p>
              <div class="sss">
            ${(check_admin_or_not()) ? `<button id=${item.id} class="btn card_btn edit_card is_admin">Update</button>
            <button id=${item.id} class="btn card_btn del_card is_admin">Delete</button>` : ''}
                </div>
            
        </div>
    `;
  });
  }

render();

// ! update

async function showEditMovieModal(e) {
  const movieId = e.target.id;
  //   console.log(movieId);
  let response = await fetch(`${MOOVIE_API}/${movieId}`);
  let movieObj = await response.json();
  edit_modal.style.display = "flex";
  edit_title.value = movieObj.title;
  edit_image.value = movieObj.image;
  edit_description.value = movieObj.description;
  moovieId = movieId

  //   edit_form.id = "edit-movie-form" + movieObj.id;
}


async function editMovie(e) {
  e.preventDefault();
  const updatedObj = {
    title: edit_title.value,
    image: edit_image.value,
    description: edit_description.value,
    plot: edit_plot.value,
    genre: edit_genre.value.split(", "),
    country: edit_country.value,
    actors: edit_actors.value.split(", "),
    directors:edit_directors.value.split(", "),
    year: edit_year.value.split(", "),
    rating:edit_rating
  };
  const id = moovieId;
  await fetch(`${MOOVIE_API}/${id}/`, {
    method: "PUT",
    body: JSON.stringify(updatedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  edit_modal.style.display = "none";
}


// ! delete
const exit_btn = document.querySelector("#exit-button")
console.log(exit_btn)
async function deleteMovie(e) {
  if (e.target.classList.contains("del_card")) {
    const id = e.target.id;
    await fetch(`${MOOVIE_API}/${id}`, {
      method: "DELETE",
    });
    render();
  }
}
async function detail_view(e){

  if(e.target.classList.contains("card")){
    exit_btn.style.display = "block"
    let pk = await get_all_users_or_moovies()
    let obj = pk.find(item => e.target.id == item.id)
    document.querySelector("section").innerHTML = `
  <div class="container_of_detail_view">
<h1>${obj.title}</h1>
<div class="main_of_detail_view">
<div class="left_part_of_detail_view">
  <img src="${obj.image}">
</div>
<div class="right_part_of_detail_view">
  <div class="left">
    <h2 class="h2_of_detail_view">Description:</h2>
    <p class="description_of_detail_view">${obj.description}
    </p>
    <h2 class="h2_of_detail_view">Plot:</h2>
    <p class="plot_of_detail_view">${obj.plot}
    </p>
    <h2 class="h2_of_detail_view">Genres:</h2>
    <p class="genres_of_detail_view">${obj.genre}
    </p>
    <h2 class="h2_of_detail_view">Country:</h2>
    <p class="country_of_detail_view">
    ${obj.country}
    </p>
  </div>

  <div class="right">
    <h2 class="h2_of_detail_view">Actors:</h2>
    <p class="actors_of_detail_view">
    ${obj.actors}
    </p>
    <h2 class="h2_of_detail_view">Directors:</h2>
    <p class="directors_of_detail_view">
    ${obj.directors}
    </p>
    <h2 class="h2_of_detail_view">Year:</h2>
    <p class="year_of_detail_view">
    ${obj.year}
    </p>
    <h2 class="h2_of_detail_view">Rating:</h2>
    <p class="rating_of_detail_view">
    ${obj.rating}
    </p>
  </div>
</div>


</div>
</div>
  </div>
    `
  }
}
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit_card") && check_admin_or_not()) {
    showEditMovieModal(e);
  }
  deleteMovie(e);
  detail_view(e)
});

document
  .getElementById("edit-movie-form")
  .addEventListener("submit", editMovie);

exit_btn.addEventListener("click",()=>{
  location.reload()
})



