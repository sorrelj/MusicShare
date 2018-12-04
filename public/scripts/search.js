
var searchData = document.getElementById('searchData');
var str = searchData.innerText;

var addData = document.getElementById('addData');

if (str == '404'){
    var newLI = document.createElement('li');
    newLI.className = 'collection-item';
    newLI.innerHTML = "<h5 style=\"color: red\">No Users Found</h5>"
}
