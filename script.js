checkAuthentication();
createShortUrl();
logoutTrigger();
async function checkAuthentication(){
    try{
        let access_token = localStorage.getItem('access_token');
        let response = await getUrlData(access_token);
        response = JSON.parse(response.response)
        
        let table = document.querySelector('#urlTable');
        let tBody = document.createElement('tbody');
    
        response.forEach(function(data){
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.setAttribute('style','max-width: 900px; word-wrap:break-word');
            let a = document.createElement('a');
            a.setAttribute('href',data.fullUrl);
            a.innerText = data.fullUrl;
            td.append(a);
            tr.append(td);

            td = document.createElement('td');
            a = document.createElement('a');
            a.setAttribute('href','https://urlshrinker-mrk.herokuapp.com/'+data.shortUrl);
            a.innerText = data.shortUrl;
            td.append(a);
            tr.append(td);

            td = document.createElement('td');
            td.innerText = data.clicks;
            tr.append(td);
            tBody.append(tr);
    });
    table.append(tBody);
    }
    catch(err){
        if(err.status == 401){
            if(localStorage.getItem('refresh_token')){
                //make a call to /tokens endpoint to exchage access for refresh
                try{
                    await performTokenExchage(localStorage.getItem('refresh_token'));
                    checkAuthentication();
                }
                catch(error){
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = "login.html";
                }
            }
            else{
                window.location.href = "login.html";
            }
        }
    }
}

async function performTokenExchage(refresh_token){
    let jsonobj = {
        'token':refresh_token
    };
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open('POST','https://urlshrinker-mrk.herokuapp.com/token',true);
        xhr.setRequestHeader('Content-Type','application/json');
        let params = JSON.stringify(jsonobj);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                localStorage.setItem('access_token',JSON.parse(xhr.response).access_token);
                resolve(xhr);
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                reject(xhr);
            }
        }
        xhr.send(params);
    });
}

function getUrlData(access_token){
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open('GET','https://urlshrinker-mrk.herokuapp.com/shortUrls',true);
        xhr.setRequestHeader('authorization', access_token);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                resolve(xhr);
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                reject(xhr);
            }
        }
        xhr.send();
    });
}

async function createShortUrl(){
    let createForm = document.getElementById('url-shortener-form');
    createForm.addEventListener('submit',async function(event){
        event.preventDefault();
        await sendCreateRequest(localStorage.getItem('access_token'));
        location.reload();
    })
    
}

function sendCreateRequest(access_token){
    let fullUrl = document.getElementById('fullUrl').value;
    
    let jsonobj = {
        'fullUrl':fullUrl
    }
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'https://urlshrinker-mrk.herokuapp.com/shorturls';
        let params = JSON.stringify(jsonobj);
        xhr.open('POST',url,true);
        xhr.setRequestHeader('authorization', access_token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                return resolve('CREATE SUCCESS');
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                return reject('Internal Service Error');
            }
        }
        xhr.send(params);
    });
}

async function logoutTrigger(){
    let logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click',async function(event){
        event.preventDefault();
        await sendLogoutRequest(localStorage.getItem('refresh_token'));
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = "login.html";
    });
    
}
function sendLogoutRequest(token){
    
    let jsonobj = {
        token
    }
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'https://urlshrinker-mrk.herokuapp.com/users/logout';
        let params = JSON.stringify(jsonobj);
        xhr.open('POST',url,true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                return resolve('logout SUCCESS');
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                return reject('Internal Service Error');
            }
        }
        xhr.send(params);
    });
}