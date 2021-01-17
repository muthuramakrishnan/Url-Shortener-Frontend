checkAuthentication();
loginUser();

function checkAuthentication(){
    if(localStorage.getItem('access_token'))
    {
        window.location.href = "dashboard.html";
    }
}
async function loginUser(){
    let loginUserForm = document.getElementById('loginForm');
    loginUserForm.addEventListener('submit',async function(event){
        event.preventDefault();
        try{
            let response = await sendLoginRequest();
            response = JSON.parse(response.response);
            localStorage.setItem('access_token',response.access_token);
            localStorage.setItem('refresh_token',response.refresh_token);
            window.location.href = "dashboard.html";
        }            
        catch(err){

            let parsedResponse = JSON.parse(err.response);
            let errorArea = document.getElementById('errorArea')
            errorArea.innerHTML = parsedResponse.description;
            errorArea.setAttribute('class', 'text-danger font-weight-bold p-2 rounded');
        }
        
    }); 
}

function sendLoginRequest(){

    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    let jsonobj = {
        password,
        email
    }
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'https://urlshrinker-mrk.herokuapp.com/users/login';
        let params = JSON.stringify(jsonobj);
        xhr.open('POST',url,true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                return resolve(xhr);
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                return reject(xhr);
            }
        }
        xhr.send(params);
    });
}
