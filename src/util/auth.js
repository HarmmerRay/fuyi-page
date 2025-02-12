
import md5 from "js-md5"
let isAuthenticated = false;

export  function login() {
    isAuthenticated = true;
}

export  function logout() {
    isAuthenticated = false;
}

function getCookie(name) {
    let cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        let parts = cookies[i].split('=');
        if (parts[0] === name) {
            return parts[1];
        }
    }
    return '';
}
function setCookie(name, value, days, path, domain) {
    // 设置cookie的名称和值
    let cookie = `${name}=${encodeURIComponent(value)}`;

    // 如果提供了有效期（天数），则添加到cookie字符串
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 将天数转换为毫秒
        cookie += `; expires=${date.toUTCString()}`;
    }

    // 如果提供了路径，则添加到cookie字符串
    if (path) {
        cookie += `; path=${path}`;
    }

    // 如果提供了域，则添加到cookie字符串
    if (domain) {
        cookie += `; domain=${domain}`;
    }

    // 设置HttpOnly标志，以避免JavaScript访问cookie
    cookie += '; HttpOnly';

    // 设置Secure标志，确保cookie只通过HTTPS传输
    //cookie += '; Secure';

    // 将cookie字符串保存到浏览器
    document.cookie = cookie;
}


const encrypt = (admin_id) => {

    // const year = new Date().toLocaleDateString();
    // console.log(year);
    // const newyear = year.replace("/", "-");
    // const newyear1 = newyear.replace("/", "-");
    // const newyear2 = newyear1.replace("-", "-0");
    // const hours = new Date().getHours();
    // const timeuser = newyear2.concat(" ", hours);
    // console.log(timeuser);
    // return time;
    // formatDate();
    const time = md5("ZhixuanAI" + formatDate() + "^&*" + admin_id);
    return time;
};


function formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}`;
}
function getQueryParamsRegex() {
    const queryString = window.location.search;
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params = {};
    let match;
    while (match = regex.exec(queryString)) {
        params[match[1]] = match[2];
    }
    return params;
}
export  function checkAuth() {
    console.log(window.location.href)
    if (window.location.href.indexOf('from_token')>0){
        // 使用方法
        // 假设你想获取名为'user'的cookie
        let admin_id = getCookie('admin_id');
        if (admin_id && admin_id>0){
            localStorage.setItem('counter', JSON.stringify({admin_id:admin_id}));
        }
    }
    
    if (window.location.href.indexOf('hide_tabs') > 0){
        
        localStorage.setItem('hide_tabs', 1);

    }
    if (window.location.href.indexOf('admin_id') > 0) {
        const p=getQueryParamsRegex()
        //console.log("admin_id参数", p.encrypt, p.admin_id)
        if (encrypt(p.admin_id) == p.encrypt && p.admin_id>0){
            console.log("加密通过")
            localStorage.setItem('counter', JSON.stringify({ admin_id: p.admin_id }));
        }
        

    }

    const data = localStorage.getItem('counter');

    // 将读取的数据转换为 JavaScript 对象
    const store = JSON.parse(data);

    if (store && store.admin_id!=undefined && store.admin_id != null && store.admin_id !== '' && store.admin_id>0){
        isAuthenticated = true;
    }
    else{
        isAuthenticated = false;
    }
    console.log("是否登录",isAuthenticated)
    return isAuthenticated;
}
