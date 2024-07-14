import { loginModel, registerModel, logoutModel, RedefinirSenhaModel } from '../../model/serviceauth.js';

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Usuário já autenticado:", user);
            console.log("UID do usuário:", user.uid);
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

        loginModel(email, password)
            .then((user) => {
                console.log("Usuário logado com sucesso:", user);
                window.location.href = "../views/inicial.html";
            })
            .catch((error) => {
                console.error("Erro ao fazer login:", error);
                alert('Erro ao fazer login! Email ou senha incorreto!');
            });
    }
    window.login = login;

    function Sair() {
        logoutModel()
            .then(() => {
                window.location.href = "../views/login.html";
            })
            .catch((error) => {
                console.error("Erro ao fazer logout:", error);
                alert("Erro ao fazer logout: " + error.message);
            });
    }
    window.Sair = Sair;

    function validateForm(event) {
        event.preventDefault();

        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmar_password");
        const passwordLengthMessage = document.getElementById("password-length-message");
        const passwordMessage = document.getElementById("password-message");

        if (!password || !confirmPassword || !passwordLengthMessage || !passwordMessage) {
            console.error("Elementos de formulário não encontrados.");
            return;
        }

        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;

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
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf_cnpj").value;

        if (!email || !password || !nome || !cpf) {
            console.error("Elementos de e-mail, senha, nome ou CPF não encontrados.");
            return;
        }

        const additionalData = { nome, cpf };

        registerModel(email, password, additionalData)
            .then(() => {
                console.log("Usuário e dados adicionais cadastrados com sucesso!");
                window.location.href = "../views/login.html";
            })
            .catch(error => {
                console.error("Erro ao criar usuário:", error);
                alert("Erro ao criar usuário: " + error.message);
            });
    }
    window.register = register;

    function RedefinirSenha() {
        var email = document.getElementById('email').value;
    
        RedefinirSenhaModel(email)
            .then(() => {
                console.log('E-mail de redefinição de senha enviado.');
                alert('E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.');
            })
            .catch((error) => {
                console.error("Erro ao enviar e-mail de redefinição de senha:", error);
                alert("Erro ao enviar e-mail de redefinição de senha: " + error.message);
            });
    }

    window.RedefinirSenha = RedefinirSenha;
    document.getElementById('register-form').addEventListener('submit', validateForm);
});

