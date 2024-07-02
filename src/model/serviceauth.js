const firebaseConfig = {
    apiKey: "AIzaSyBPlhIlvJV45Q0MYEPeD39w7Yfumor2aas",
    authDomain: "integrador-34f24.firebaseapp.com",
    projectId: "integrador-34f24",
    storageBucket: "integrador-34f24.appspot.com",
    messagingSenderId: "172090242497",
    appId: "1:172090242497:web:f8a358455abec8f2c36b40"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var nome = document.getElementById("nome").value;
        var cpf = document.getElementById("cpf_cnpj").value;
    
        if (!email || !password || !nome || !cpf) {
            console.error("Elementos de e-mail, senha, nome ou CPF não encontrados.");
            return;
        }
    
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                return firebase.firestore().collection('users').doc(user.uid).set({
                    nome: nome,
                    cpf: cpf
                });
            })
            .then(() => {
                console.log("Usuário e dados adicionais cadastrados com sucesso!");
                window.location.href = "../views/login.html";
            })
            .catch(error => {
                console.error("Erro ao criar usuário:", error);
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
////////////////////

document.addEventListener('DOMContentLoaded', function() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const userId = user.uid;

            firebase.firestore().collection('users').doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        document.getElementById('novoNome').value = doc.data().nome || '';
                        document.getElementById('cpf').value = doc.data().cpf || '';
                    } else {
                        console.error("Nenhum dado encontrado para este usuário no Firestore.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao obter informações do usuário do Firestore: ", error);
                });

            document.getElementById('email').value = user.email || '';
        } else {
            console.log("Nenhum usuário autenticado.");
        }
    });
});


function salvarEdicaoUser() {
    const inputNovoNome = document.getElementById('novoNome');
    const inputCpf = document.getElementById('cpf');
    const inputNovoEmail = document.getElementById('email');
    const inputNovaSenha = document.getElementById('novaSenha');
    const inputConfirmarNovaSenha = document.getElementById('confirmarNovaSenha');

    if (!inputNovoNome || !inputCpf || !inputNovoEmail || !inputNovaSenha || !inputConfirmarNovaSenha) {
        console.error("Elementos do formulário não encontrados.");
        return;
    }

    const novoNome = inputNovoNome.value;
    const cpf = inputCpf.value;
    const novoEmail = inputNovoEmail.value;
    const novaSenha = inputNovaSenha.value;
    const confirmarNovaSenha = inputConfirmarNovaSenha.value;

    if (novaSenha !== confirmarNovaSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    const user = firebase.auth().currentUser;
    if (user) {
        const userId = user.uid;

        const credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            prompt('Para atualizar o e-mail e a senha, por favor insira sua senha atual:')
        );

        user.reauthenticateWithCredential(credentials).then(() => {
            return firebase.firestore().collection('users').doc(userId).update({
                nome: novoNome,
                cpf: cpf
            });
        })
        .then(() => {
            if (novoEmail !== user.email) {
                return user.updateEmail(novoEmail);
            }
        })
        .then(() => {
            if (novaSenha) {
                return user.updatePassword(novaSenha);
            }
        })
        .then(() => {
            console.log("Informações do usuário atualizadas com sucesso!");
            alert("Informações atualizadas com sucesso.");
        })
        .catch((error) => {
            if (error.code === 'auth/requires-recent-login') {
                alert('Por razões de segurança, você precisa fazer login novamente para atualizar o e-mail e a senha.');
                firebase.auth().signOut().then(() => {
                    window.location.href = "../views/login.html";
                });
            } else if (error.code === 'auth/operation-not-allowed') {
                console.error("A atualização de e-mail ou senha não está habilitada nas configurações do Firebase.");
                alert("A atualização de e-mail ou senha não está permitida. Por favor, contate o administrador.");
            } else {
                console.error("Erro ao atualizar informações do usuário: ", error);
                alert("Erro ao atualizar informações: " + error.message);
            }
        });
    } else {
        console.error("Nenhum usuário logado.");
    }
}

window.salvarEdicaoUser = salvarEdicaoUser;




function cancelarEdicaoUser() {
    if (window.confirm("Tem certeza que deseja cancelar as alterações? As alterações não salvas serão perdidas.")) {
        window.location.href = "../views/inicial.html";
    }
}

window.cancelarEdicaoUser = cancelarEdicaoUser;

function apagarUser() {

    const senha = prompt("Para confirmar, digite sua senha:");

    if (senha !== null) { 

        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            senha
        );

        user.reauthenticateWithCredential(credential)
            .then(() => {

                firebase.firestore().collection('animais').where('userId', '==', user.uid).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            doc.ref.delete();
                        });
                        console.log("Animais do usuário apagados com sucesso.");
                    })
                    .catch((error) => {
                        console.error("Erro ao apagar animais do usuário: ", error);
                    });

                firebase.firestore().collection('fichas').where('userId', '==', user.uid).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            doc.ref.delete();
                        });
                        console.log("Fichas do usuário apagadas com sucesso.");
                    })
                    .catch((error) => {
                        console.error("Erro ao apagar fichas do usuário: ", error);
                    });

                firebase.firestore().collection('users').doc(user.uid).delete()
                    .then(() => {
                        console.log("Dados do usuário apagados com sucesso.");

                        user.delete()
                            .then(() => {
                                alert("Usuário e dados apagados com sucesso.");
                                window.location.href = "../views/login.html";
                            })
                            .catch((error) => {
                                console.error("Erro ao apagar usuário: ", error);
                                alert("Erro ao apagar usuário: " + error.message);
                            });
                    })
                    .catch((error) => {
                        console.error("Erro ao apagar dados do usuário no Firestore: ", error);
                        alert("Erro ao apagar dados do usuário: " + error.message);
                    });
            })
            .catch((error) => {
                console.error("Erro ao reautenticar usuário: ", error);
                alert("Erro ao reautenticar usuário: " + error.message);
            });
    }
}

window.apagarUser = apagarUser;



