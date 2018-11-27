//JS file to handle home page buttons

var signupbtn = document.getElementById('signupbtn');
var loginbtn = document.getElementById('loginbtn');


/*
 * Sign in
 */
signupbtn.addEventListener('click', function(e) {
  console.log('Sign Up clicked');
  window.location.href = '/register';
});

/*
 * Login
 */
loginbtn.addEventListener('click', function(e) {
    console.log('Login clicked');
});