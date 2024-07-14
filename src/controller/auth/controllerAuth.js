import { loginModel, registerModel, logoutModel, RedefinirSenhaModel, salvarEdicaoUserModel, cancelarEdicaoUserModel, apagarUserModel } from '../../model/serviceauth.js';

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
    
///////////////////////// edição

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const userId = user.uid;
        // Obtém email diretamente do objeto user
        document.getElementById('email').value = user.email || '';

        firebase.firestore().collection('users').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('novoNome').value = userData.nome || '';
                    document.getElementById('cpf').value = userData.cpf || '';
                } else {
                    console.log("Nenhum documento encontrado.");
                }
            })
            .catch((error) => {
                console.error("Erro ao obter documento:", error);
            });
    } else {
        console.log("Nenhum usuário autenticado.");
    }
});
/*
// Botões de edição
document.getElementById('salvarAlteracoes').addEventListener('click', salvarEdicaoUser);
document.getElementById('cancelarAlteracoes').addEventListener('click', cancelarEdicaoUser);
document.getElementById('excluirAnimal').addEventListener('click', apagarUser);
*/
function salvarEdicaoUser() {
    const novoNome = document.getElementById('novoNome').value;
    const cpf = document.getElementById('cpf').value;
    const novoEmail = document.getElementById('email').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarNovaSenha = document.getElementById('confirmarNovaSenha').value;

    if (novaSenha && novaSenha !== confirmarNovaSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const user = firebase.auth().currentUser;
    if (user) {
        const currentEmail = user.email;
        const currentPassword = prompt('Para atualizar o e-mail e a senha, por favor insira sua senha atual:');

        // Reautenticar o usuário
        const credentials = firebase.auth.EmailAuthProvider.credential(currentEmail, currentPassword);
        user.reauthenticateWithCredential(credentials)
            .then(() => {
                return salvarEdicaoUserModel(novoNome, cpf, novoEmail, novaSenha, user.uid);
            })
            .then(() => {
                alert('Dados atualizados com sucesso.');
                window.location.href = "../views/inicial.html";
            })
            .catch((error) => {
                console.error("Erro ao atualizar dados do usuário:", error);
                alert("Erro ao atualizar dados do usuário: " + error.message);
            });
    }
}
window.salvarEdicaoUser = salvarEdicaoUser;

function cancelarEdicaoUser() {
    cancelarEdicaoUserModel();
}

function apagarUser() {
    const confirmation = confirm('Tem certeza de que deseja excluir o usuário? Esta ação é irreversível.');

    if (confirmation) {
        const user = firebase.auth().currentUser;
        if (user) {
            const currentEmail = user.email;
            const currentPassword = prompt('Para excluir o usuário, por favor insira sua senha atual:');
            
            // Reautenticar o usuário
            const credentials = firebase.auth.EmailAuthProvider.credential(currentEmail, currentPassword);
            user.reauthenticateWithCredential(credentials)
                .then(() => {
                    return apagarUserModel(user.uid);
                })
                .then(() => {
                    return user.delete();
                })
                .then(() => {
                    alert('Usuário excluído com sucesso.');
                    window.location.href = "../views/login.html";
                })
                .catch((error) => {
                    console.error("Erro ao excluir usuário:", error);
                    alert("Erro ao excluir usuário: " + error.message);
                });
        }
    }
}
window.apagarUser = apagarUser;


});

