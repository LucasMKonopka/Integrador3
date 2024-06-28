const firebaseConfig = {
    apiKey: "AIzaSyBPlhIlvJV45Q0MYEPeD39w7Yfumor2aas",
    authDomain: "integrador-34f24.firebaseapp.com",
    projectId: "integrador-34f24",
    storageBucket: "integrador-34f24.appspot.com",
    messagingSenderId: "172090242497",
    appId: "1:172090242497:web:f8a358455abec8f2c36b40"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Autenticação persistente ativada.");
    })
    .catch((error) => {
        console.error("Erro ao configurar a persistência de autenticação:", error);
    });

    document.addEventListener('DOMContentLoaded', function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("Usuário já autenticado:", user);
                console.log("User ID:", user.uid);
                console.log("User Email:", user.email);
                if (window.location.href.includes('login.html')) {
                    window.location.href = "../views/inicial.html";
                }
            } else {
                console.log("Usuário não autenticado.");
            }
        });

    function login() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                console.log("Usuário logado com sucesso:", user);
                window.location.href = "../views/inicial.html";
            })
            .catch((error) => {
                console.error("Erro ao fazer login:", error);
                alert("Erro ao fazer login: " + error.message);
            });
    }
    window.login = login;

    function Sair() {
        firebase.auth().signOut()
            .then(() => {
                console.log("Usuário deslogado com sucesso.");
                localStorage.removeItem('user');
                window.location.href = "../views/login.html";
            })
            .catch((error) => {
                console.error('Erro ao fazer logout:', error);
            });
    }
    window.Sair = Sair;

    function validateForm(event) {
        event.preventDefault();

        var password = document.getElementById("password");
        var confirmPassword = document.getElementById("confirmar_password");
        var passwordLengthMessage = document.getElementById("password-length-message");
        var passwordMessage = document.getElementById("password-message");

        if (!password || !confirmPassword || !passwordLengthMessage || !passwordMessage) {
            console.error("Elementos de formulário não encontrados.");
            return;
        }

        var passwordValue = password.value;
        var confirmPasswordValue = confirmPassword.value;

        if (passwordValue.length < 6) {
            passwordLengthMessage.textContent = "A senha deve ter pelo menos 6 caracteres.";
            return;
        } else {
            passwordLengthMessage.textContent = "";
        }

        if (passwordValue !== confirmPasswordValue) {
            passwordMessage.textContent = "As senhas não coincidem.";
            return; 
        } else {
            passwordMessage.textContent = "";
        }

        register();
    }
    window.validateForm = validateForm;

    function register() {
        var email = document.getElementById("email");
        var password = document.getElementById("password");

        if (!email || !password) {
            console.error("Elementos de e-mail ou senha não encontrados.");
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then(() => {
                window.location.href = "../views/login.html"; 
            })
            .catch(error => {
                alert(getErrorMessage(error));
            });
    }
    window.register = register;

    function RedefinirSenha() {
        var email = document.getElementById('email');

        if (!email) {
            console.error("Elemento de e-mail não encontrado.");
            return;
        }

        firebase.auth().sendPasswordResetEmail(email.value)
            .then(() => {
                alert('E-mail enviado com sucesso para redefinição de senha.');
                window.location.href = "../views/login.html";
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    alert('Não existe uma conta associada a este e-mail. Por favor, verifique o e-mail fornecido.');
                } else {
                    alert('Ocorreu um erro ao enviar o e-mail de redefinição de senha. Por favor, tente novamente mais tarde.');
                }
            });
    }
    window.RedefinirSenha = RedefinirSenha;

    function getErrorMessage(error) {
        if (error.code == "auth/email-already-in-use") {
            return "Email já está em uso";
        }
        return error.message;
    }

    document.getElementById('register-form').addEventListener('submit', validateForm);
});


