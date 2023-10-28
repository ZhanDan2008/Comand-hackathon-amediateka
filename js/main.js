// //? connections add modal
const updateForm = document.querySelector("#edit-movie-form");
const edit_title = document.querySelector("#edit_title");
const edit_image = document.querySelector("#edit_image");
const edit_description = document.querySelector("#edit_description");
const edit_modal = document.querySelector("#edit-movie-modal");
const edit_form = document.querySelector("#edit-movie-form");

// ?MAIN_VARIABLES
const USERS_API = "http://localhost:8000/users";
const MOOVIE_API = "http://localhost:8000/moovies";

// !REGISTRATION
// ?ПЕРЕМЕННЫЕ
const logout_btn = document.getElementById("logout_id");
const login_btn = document.getElementById("login_id");
const registration_modal = document.querySelector(".registration_modal");
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
const admin_panel_btn = document.querySelector("#admin_panel");
// *FUNCTIONS
function show_login_logout_register_buttons() {
  if (login_user_or_not()) {
    if (localStorage.getItem("username") === "admin@gmail.com") {
      admin_panel_btn.style.display = "block";
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
async function get_all_users(what) {
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
  let all_users = await get_all_users("users");
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
  return FontFaceSetLoadEvent;
}
async function registerUser(e) {
  e.preventDefault();
  if (
    username_value.value === "admin@gmail.com" &&
    password_value.value === "chocolate" &&
    age_value.value === "" &&
    password_conf_value.value === ""
  ) {
    let userObj = {
      username: username_value.value,
      age: age_value.value,
      password: password_value.value,
      admin: true,
    };

    await fetch(USERS_API, {
      method: "POST",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    place_for_errors.style.color = "green";
    place_for_errors.innerText = "С возвращеием Админ!";
    setTimeout(() => {
      place_for_errors.innerText = "";
      registration_modal.style.display = "none";
    }, 1000);
    save_username_in_localstorage(username_value.value);
    username_value.value = "";
    age_value.value = "";
    password_value.value = "";
    password_conf_value.value = "";

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
  place_for_errors.innerText = "";
  save_username_in_localstorage(username_value.value);
  username_value.value = "";
  age_value.value = "";
  password_value.value = "";
  password_conf_value.value = "";
}

register_btn.addEventListener("click", (e) => {
  registration_modal.style.display = "block";
});
register_btn_finish.addEventListener("click", registerUser);
//    !LOGOUT

function logout_function() {
  localStorage.removeItem("username");
  show_login_logout_register_buttons();
}
logout_btn.addEventListener("click", logout_function);

// !LOGIN
// ?переменные

// *FUNCTIONS
async function login_function() {
  let all_users = await get_all_users("users");
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

// Функция для отправки формы добавления фильма
async function addMovie(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;
  const trailerUrl = document.getElementById("trailerUrl").value;
  const plot = document.getElementById("plot").value;
  const genre = document.getElementById("genre").value;
  const country = document.getElementById("country").value;
  const actors = document.getElementById("actors").value;
  const directors = document.getElementById("directors").value;
  const year = document.getElementById("year").value;
  const rating = document.getElementById("rating").value;
  const assessments = document.getElementById("assessments").value;

  const response = await fetch(MOOVIE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      image,
      trailerUrl,
      plot,
      genre,
      country,
      actors,
      directors,
      year,
      rating,
      assessments,
    }),
  });
  document.getElementById("add-movie-modal").style.display = "none";

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image").value = "";
  document.getElementById("trailerUrl").value = "";
  document.getElementById("plot").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("country").value = "";
  document.getElementById("actors").value = "";
  document.getElementById("directors").value = "";
  document.getElementById("year").value = "";
  document.getElementById("rating").value = "";
  document.getElementById("assessments").value = "";
  render();
}


document
  .getElementById("add-movie-button")
  .addEventListener("click", showAddMovieModal);

document.getElementById("add-movie-form").addEventListener("submit", addMovie);

// //! read

async function render() {
  const movieList = document.querySelector("#movie-list");
  const response = await fetch(MOOVIE_API);
  const movies = await response.json();
  movieList.innerHTML = "";
  
  movies.forEach((item) => {
    movieList.innerHTML += `
        <div class="movie-list film_img">
              <img
                src= ${item.image}
              />
              
              <p>${item.title}</p>
              <div class="sss">
            ${
              
                `<button id=${item.id} class="btn card_btn edit_card">Update</button>
            <button id=${item.id} class="btn card_btn del_card">Delete</button>`
                 
            }
          </div>
            
        </div>
    `;
  });
}
render();

// ! update

async function showEditMovieModal(e) {
  const movieId = e.target.id;
  let response = await fetch(`${MOOVIE_API}/${movieId}`);
  let movieObj = await response.json();
  edit_modal.style.display = "block";
  edit_title.value = movieObj.title;
  edit_image.value = movieObj.image;
  edit_description.value = movieObj.description;

  edit_form.id = "edit-movie-form" + movieObj.id;
}

async function editMovie(e) {
  e.preventDefault();
  const updatedObj = {
    title: edit_title.value,
    image: edit_image.value,
    description: edit_description.value,
  };

  const id = e.target.id.substring(15);
  
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

async function deleteMovie(e) {
  if (e.target.classList.contains("del_card")) {
    const id = e.target.id;
    await fetch(`${MOOVIE_API}/${id}`, {
      method: "DELETE",
    });
    render();
  }
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit_card")) {
    showEditMovieModal(e);
  }
});

document.getElementById("edit-movie-form").addEventListener("submit", editMovie);

document.addEventListener("click", (e) => {
  deleteMovie(e);
});
