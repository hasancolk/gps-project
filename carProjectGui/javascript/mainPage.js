
const userId = localStorage.getItem("userId");
const loginDate = localStorage.getItem("loginDate");
const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener('click', logOutForUser);

async function getCarsForUser(id) {
    // console.log('user id : ' + id);


    axios({
        method: 'GET',
        url: 'http://localhost:8069/getUsersCars',
        params: {
            id: id,
        }
    }).then(response => {
        localStorage.setItem("carArray", response.data);
    }).catch(err => {
        console.log(err);
    })
}
getCarsForUser(userId);

async function logOutForUser(e) {
    e.preventDefault();
    let date = new Date();
    let logoutYear = date.getFullYear();
    let logoutMonth = date.getMonth() + 1;
    let logoutDay = date.getDate();
    let logoutHours = date.getHours();
    let logoutMinutes = date.getMinutes();
    let logoutDate = `${logoutDay}/${logoutMonth}/${logoutYear}  ${logoutHours}:${logoutMinutes}`;
    console.log(userId, loginDate, logoutDate);
    axios({
        method:"POST",
        url:"http://localhost:8069/userLogout",
        params:{
            id:userId,
            loginTime:loginDate,
            logoutTime:logoutDate,
        }
    }).then(response=>{
        console.log(response); 
        window.location.replace("http://127.0.0.1:5500/webPages/loginPage.html")
        localStorage.setItem("userId", undefined);
        localStorage.setItem("carArray", undefined);
    }).catch(err=>{
        console.log(err);
    });
}
