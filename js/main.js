//? connections add modal
const addFilmBtn = document.querySelector("#add_film_btn");
const addFilmModal = document.querySelector(".addFilmModal");
const addFilmUrlInp = document.getElementById("addFilmUrl");
const addFilmTitleInp = document.getElementById("addFilmTitle");
const addFilmDescriptionInp = document.getElementById("addFilmDescription");
const addFilmTrailerInp = document.getElementById("addFilmTrailer");
const addFilmPlotInp = document.getElementById("addFilmPlot");
const addFilmGenreInp = document.getElementById("addFilmGenre");
const addFilmCountryInp = document.getElementById("addFilmCountry");
const addFilmActorsInp = document.getElementById("addFilmActors");
const addFilmDirectorsInp = document.getElementById("addFilmDirectors");
const addFilmYearInp = document.getElementById("addFilmYear");
const addFilmRaitingInp = document.getElementById("addFilmRaiting");
const addFilmAssessmentsInp = document.getElementById("addFilmAssessments");

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
async function get_all_users_or_moovies(what = undefined) {
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
      
      registration_modal.style.display = "none";
      place_for_errors.innerText = "";
      place_for_errors.style.color = "red"
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

//! add modal
//! read

//? render
async function render() {
  let all_moovies = await get_all_users();
  console.log(all_moovies);
  all_moovies.forEach((item) => {
    console.log(item);
    console.log(document.getElementById("check1"));
    document.getElementById("check1").innerHTML += `
    <div class="watch_now_img film_img">
              <img
                src= ${item.image}
                alt=""
              />
              <p>${item.title}</p>
            </div>
    `;
  });
}

//! create

async function create() {
  let movieObj = {
    title: addFilmTitleInp.value,
    image: addFilmUrlInp.value,
    description: addFilmDescriptionInp.value,
    plot: addFilmPlotInp.value,
    genre: addFilmGenreInp.value.split(","),
    country: addFilmCountryInp.value,
    actors: addFilmActorsInp.value.split(","),
    directors: addFilmDirectorsInp.value.split(","),
    year: addFilmYearInp.value,
    rating: addFilmRaitingInp.value,
    assessments: addFilmAssessmentsInp.value.split(","),
  };

  await fetch(MOOVIE_API, {
    method: "POST",
    body: JSON.stringify(movieObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    // title: addFilmTitleInp.value,
    // image: addFilmUrlInp.value,
    // description: addFilmDescriptionInp.value,
    // plot: addFilmPlotInp.value,
    // genre: addFilmGenreInp.value.split(","),
    // country: addFilmCountryInp.value,
    // actors: addFilmActorsInp.value.split(","),
    // directors: addFilmDirectorsInp.value.split(","),
    // year: addFilmYearInp.value,
    // rating: addFilmRaitingInp.value,
    // assessments: addFilmAssessmentsInp.value.split(","),
  });
  render();
}

addFilmBtn.addEventListener("click", create);
