createUser();
async function createUser(){
    let createUserForm = document.getElementById('signupForm');
    createUserForm.addEventListener('submit',async function(event){
        event.preventDefault();
        try{
            await sendCreateRequest();
            alert('Sign Up Successful Please Login to continue');
            window.location.href = "login.html";

        }            
        catch(err){

            let parsedResponse = JSON.parse(err.response);
            let errorArea = document.getElementById('errorArea')
            errorArea.innerHTML = parsedResponse.description;
            errorArea.setAttribute('class', 'text-danger font-weight-bold p-2 rounded');
        }
        
    }); 
}

function sendCreateRequest(){

    let name = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    let jsonobj = {
        name,
        password,
        email
    }
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'https://urlshrinker-mrk.herokuapp.com/users/signup';
        let params = JSON.stringify(jsonobj);
        xhr.open('POST',url,true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                return resolve('200');
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                return reject(xhr);
            }
        }
        xhr.send(params);
    });
}
