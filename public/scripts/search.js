
var searchData = document.getElementById('searchData');
var str = searchData.innerText;

var addData = document.getElementById('addData');

if (str == '404'){
    var newLI = document.createElement('li');
    newLI.className = 'collection-item';
    newLI.innerHTML = "<h5 style=\"color: red\">No Users Found</h5>";

    addData.appendChild(newLI)
}else{
    var newLI = document.createElement('li');
    newLI.className = 'collection-item';
    newLI.innerHTML = "<br><br>"+
                            "<a href=\"/follow?username="+str+"\" class=\"center\" style=\"font-size:20px\">"
                                +str+
                                "<i class=\"material-icons\" style=\"margin-left:12px; font-size:20px\">group_add</i>"+
                            "</a>"+
                      "<br><br>";

    addData.appendChild(newLI)

}
