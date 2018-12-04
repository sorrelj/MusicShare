var postArea = document.getElementById('postArea');

const http = new XMLHttpRequest();

const url = 'http://localhost:8000/feeddata';
http.open("GET", url);
http.send();

http.onreadystatechange = (e) =>{
    console.log('done'+http.responseText);
    if (http.responseText == '404'){
        postArea.innerText = 'Follow users to see posts.'
    }

}