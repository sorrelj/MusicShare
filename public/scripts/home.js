const http = new XMLHttpRequest();

const url = 'http://localhost:8000/feeddata';
http.open("GET", url);
http.send();

http.onreadystatechange = (e) =>{
    console.log('done'+http.responseText);
}