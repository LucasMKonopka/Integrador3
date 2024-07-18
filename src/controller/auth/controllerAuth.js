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
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao fazer login! Email ou senha incorreto!'
                });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao fazer logout: ' + error.message
                });
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
                let errorMessage = "Erro ao criar usuário.";
    
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'O endereço de e-mail já está em uso por outra conta.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'O endereço de e-mail é inválido.';
                } else if (error.code === 'auth/operation-not-allowed') {
                    errorMessage = 'Operação não permitida. Entre em contato com o suporte.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'A senha é muito fraca. Por favor, escolha uma senha mais forte.';
                }
    
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: errorMessage
                });
            });
    }
    window.register = register;
    

    function RedefinirSenha() {
        var email = document.getElementById('email').value;

        RedefinirSenhaModel(email)
            .then(() => {
                console.log('E-mail de redefinição de senha enviado.');
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.'
                });
            })
            .catch((error) => {
                console.error("Erro ao enviar e-mail de redefinição de senha:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao enviar e-mail de redefinição de senha: ' + error.message
                });
            });
    }
    window.RedefinirSenha = RedefinirSenha;

    document.getElementById('register-form').addEventListener('submit', validateForm);

    if (window.location.href.includes('editarUsuario.html')) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                const userId = user.uid;
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
    }

    async function salvarEdicaoUser() {
        const novoNome = document.getElementById('novoNome').value;
        const cpf = document.getElementById('cpf').value;
        const novoEmail = document.getElementById('email').value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarNovaSenha = document.getElementById('confirmarNovaSenha').value;

        if (novaSenha && novaSenha !== confirmarNovaSenha) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'As senhas não coincidem.'
            });
            return;
        }

        const user = firebase.auth().currentUser;
        if (user) {
            const currentEmail = user.email;

            const { value: currentPassword } = await Swal.fire({
                title: 'Autenticação Necessária',
                input: 'password',
                inputLabel: 'Para atualizar o e-mail e a senha, por favor insira sua senha atual:',
                inputPlaceholder: 'Digite sua senha atual',
                inputAttributes: {
                    maxlength: 20,
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                showCancelButton: true
            });

            if (!currentPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cancelado',
                    text: 'Atualização de dados cancelada.'
                });
                return;
            }

            const credentials = firebase.auth.EmailAuthProvider.credential(currentEmail, currentPassword);
            user.reauthenticateWithCredential(credentials)
                .then(() => {
                    return salvarEdicaoUserModel(novoNome, cpf, novoEmail, novaSenha, user.uid);
                })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'Dados atualizados com sucesso.'
                    });
                    window.location.href = "../views/inicial.html";
                })
                .catch((error) => {
                    console.error("Erro ao atualizar dados do usuário:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao atualizar dados do usuário: ' + error.message
                    });
                });
        }
    }
    window.salvarEdicaoUser = salvarEdicaoUser;

    function cancelarEdicaoUser() {
        cancelarEdicaoUserModel();
    }
    window.cancelarEdicaoUser = cancelarEdicaoUser;

    function apagarUser() {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Tem certeza de que deseja excluir o usuário? Esta ação é irreversível.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const user = firebase.auth().currentUser;
                if (user) {
                    const currentEmail = user.email;
                    Swal.fire({
                        title: 'Autenticação Necessária',
                        input: 'password',
                        inputLabel: 'Para excluir o usuário, por favor insira sua senha atual:',
                        inputPlaceholder: 'Digite sua senha atual',
                        inputAttributes: {
                            maxlength: 20,
                            autocapitalize: 'off',
                            autocorrect: 'off'
                        },
                        showCancelButton: true
                    }).then(({ value: currentPassword }) => {
                        if (!currentPassword) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Cancelado',
                                text: 'Exclusão de usuário cancelada.'
                            });
                            return;
                        }

                        const credentials = firebase.auth.EmailAuthProvider.credential(currentEmail, currentPassword);
                        user.reauthenticateWithCredential(credentials)
                            .then(() => {
                                return apagarUserModel(user.uid);
                            })
                            .then(() => {
                                return user.delete();
                            })
                            .then(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Excluído!',
                                    text: 'Usuário excluído com sucesso.'
                                });
                                window.location.href = "../views/login.html";
                            })
                            .catch((error) => {
                                console.error("Erro ao excluir usuário:", error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erro',
                                    text: 'Erro ao excluir usuário: ' + error.message
                                });
                            });
                    });
                }
            }
        });
    }
    window.apagarUser = apagarUser;
});
