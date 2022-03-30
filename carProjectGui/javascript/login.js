
const userNameLabel = document.querySelector("#userNameLabel");
const userPassLabel = document.querySelector("#userPassLabel");
const loginBtn = document.querySelector("#loginBtn");
document.selectedUserId;

loginBtn.addEventListener('click', loginForUser);
let incorrectLogin=0;

async function loginForUser(e) {
    e.preventDefault();
    let userName = userNameLabel.value;
    let password = userPassLabel.value;
    userNameLabel.value = "";
    userPassLabel.value = "";
    axios({
        method: 'GET',
        url: 'http://localhost:8069/usersLogin',
        params: {
            userName: userName,
            password: password
        }
    }).then(response => {
        if (response.data <= 0) {
            console.log('hatalı giriş');
            incorrectLogin++;
            if(incorrectLogin>=3){
                alert("Three times incorrect login.Try again later.");
                incorrectLogin=0;
            }
        } else {
            localStorage.setItem("userId", response.data);

            // console.log(new Intl.DateTimeFormat('tr-TR').format(date));
            let date = new Date();
            let loginYear = date.getFullYear();
            let loginMonth = date.getMonth() + 1;
            let loginDay = date.getDate();
            let loginHours = date.getHours();
            let loginMinutes = date.getMinutes();
            let loginDate = `${loginDay}/${loginMonth}/${loginYear}  ${loginHours}:${loginMinutes}`;
            localStorage.setItem("loginDate",loginDate);
            console.log(response.data);
            window.location.href = "http://127.0.0.1:5500/webPages/mainPage.html"
            // window.location.href = "http://127.0.0.1:5500/webPages/mapPage.html"
        }
    }).catch(err => {
        console.log(err);
    })
}
