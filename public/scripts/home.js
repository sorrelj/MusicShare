var postArea = document.getElementById('postArea');

const http = new XMLHttpRequest();

const url = 'http://localhost:8000/feeddata';
http.open("GET", url);
http.send();

http.onreadystatechange = (e) =>{
    //console.log('done'+http.responseText);
    if (http.responseText == '404'){
        postArea.innerText = 'Follow users to see posts.'
    }else{
        var data = JSON.parse(http.responseText);
        var newHTML = '<ul class="collapsible" style="width: 60%;margin-left:20%">';
    
        var i;
        for (i = 0; i < data.length; i ++){
            newHTML = newHTML +
                '<li class="active">'+
                    '<div class="collapsible-header">'+data[i].user+'</div>'+
                    '<div class="collapsible-body" style="display: block">'+
                        '<br><br>'+
                        '<div class="center">'+
                            data[i].spotify+
                        '</div>'+
                        '<br><br>'+
                        data[i].textData+
                        '<br><br>'+
                    '</div>'+
                '</li>';
        }

        newHTML = newHTML + '</ul>';
        postArea.innerHTML=newHTML;
    
    }
}

