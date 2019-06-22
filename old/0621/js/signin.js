function initApp() {
    // Login with Email/Password
    var txtUsername = document.getElementById('inputUsername');
    var txtEmail = document.getElementById('inputEmail');
    var txtPassword = document.getElementById('inputPassword');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btngoogle');
    var btnSignUp = document.getElementById('btnSignUp');
    
    document.getElementById('canvas').style.display = "none";
    document.getElementById('sign_in').style.display = "block";

    btnLogin.addEventListener('click', function () {
        /// TODO 2: Add email login button event
        ///         1. Get user input email and password to login
        var email = txtEmail.value;
        var password = txtPassword.value;
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            create_alert('error', errorMessage);
        });
        ///         2. Back to index.html when login success'
        firebase.auth().onAuthStateChanged(async function(user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                await firebase.database().ref('profile/'+ uid + '/info').set({
                    userName: txtUsername.value,
                    email: email
                }).then(function (){
                    //window.location.href = "game.html";
                    document.getElementById('sign_in').style.display = "none";
                    document.getElementById('canvas').style.display = "block";
                    game.state.start('boot');
                });
              // ...
            } else {
            }
        });
        ///         3. Show error message by "create_alert" and clean input field
    });
/*
    btnGoogle.addEventListener('click', function () {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            alert(errorMessage);
        });
        ///         2. Back to index.html when login success
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
              var displayName = user.displayName;
              var email = user.email;
              var emailVerified = user.emailVerified;
              var photoURL = user.photoURL;
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
              var providerData = user.providerData;
              window.location.href = "game.html";
              // ...
            } else {
            }
        });
        ///         3. Show error message by "create_alert"
    });
*/
    btnSignUp.addEventListener('click', function () {        
        /// TODO 4: Add signup button event
        ///         1. Get user input email and password to signup
        var email = txtEmail.value;
        var password = txtPassword.value;
        firebase.auth().createUserWithEmailAndPassword(email,password).then(
                create_alert('success', "Account created")  
            ).catch(function(error) {
                    // Handle Errors here.
            create_alert('error', errorMessage);
            var errorCode= error.code;
            var errorMessage= error.message;
            txtEmail.value = "";
            txtPassword.value = "";
        }).then(
            firebase.auth().signInWithEmailAndPassword(email, password)
        ).then(function() {
            console.log("init");
            initValues();
        });
        ///         2. Show success message by "create_alert" and clean input field
        ///         3. Show error message by "create_alert" and clean input field
        
    });
}

// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}

window.onload = function () {
    initApp();
};