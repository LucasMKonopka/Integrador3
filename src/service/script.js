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
           
            if(window.location.href.includes('login.html')){
                window.location.href = "./inicial.html";
            }
        } else {
            console.log("Usuário não autenticado.");
        }
    });
});


function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Usuário autenticado com sucesso:", userCredential.user);
            window.location.href = "./inicial.html"; 
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-login-credentials') {
                alert("Credenciais de login inválidas. Por favor, verifique seu e-mail e senha.");
            } else {
                alert("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
            }
        });
}







function Sair() {
    
    firebase.auth().signOut()
        .then(() => {
            console.log("Usuário deslogado com sucesso.");
            localStorage.removeItem('user'); 
            window.location.href = "login.html"; 
        })
        .catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
}





const db = firebase.firestore();


const formCadastroAnimal = document.getElementById('formCadastroAnimal');




function salvarAnimal() {
    
    const nome = formCadastroAnimal.nome.value.trim();
    const datanasc = formCadastroAnimal.datanasc.value.trim();
    const especie = formCadastroAnimal.especie.value.trim();
    const idade = formCadastroAnimal.idade.value.trim();
    const sexo = formCadastroAnimal.sexo.value.trim();
    const raca = formCadastroAnimal.raça.value.trim();
    const porte = formCadastroAnimal.porte.value.trim();
    const observacoes = formCadastroAnimal.observacoes.value.trim();
  
    
    if (!nome || !datanasc || !especie || !idade || !sexo || !raca || !porte || !observacoes) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    
    const animalData = {
      nome: nome,
      datanasc: datanasc,
      especie: especie,
      idade: idade,
      sexo: sexo,
      raca: raca,
      porte: porte,
      observacoes: observacoes,
      userId: firebase.auth().currentUser.uid 
    };
  
    db.collection('animais').add(animalData)
      .then(function(docRef) {
        console.log("Animal cadastrado com ID: ", docRef.id);
        
        formCadastroAnimal.reset();
       
        document.getElementById('mensagemCadastro').textContent = "Animal cadastrado com sucesso!";
        
        setTimeout(() => {
          window.location.href = "inicial.html";
        }, 1000); 
      })
      .catch(function(error) {
        console.error("Erro ao cadastrar animal: ", error);
        
        document.getElementById('mensagemCadastro').textContent = "Erro ao cadastrar animal. Por favor, tente novamente.";
      });
  }
  



function pesquisarAnimal() {
    var termoPesquisa = document.getElementById('pesquisaAnimal').value.toLowerCase();

    
    var animaisFiltrados = listaAnimais.filter(function(animal) {
        return animal.nome.toLowerCase().includes(termoPesquisa);
    });

    
    console.log(animaisFiltrados);

    
    if (animaisFiltrados.length > 0) {
        
        console.log('Animal encontrado:', animaisFiltrados[0]);
    } else {
        
        console.log('Animal não encontrado. Crie um novo cadastro ou verifique o nome inserido.');
       
        document.getElementById('mensagemCadastro').innerText = 'Animal não encontrado. Crie um novo cadastro ou verifique o nome inserido.';
    }
}



function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('especie').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('raça').value = '';
    document.getElementById('porte').value = '';
    document.getElementById('datanasc').value = '';
    document.getElementById('sexo').value = '';
}

   

function novaficha(){
    window.location.href = "novaficha.html";
}
function botaoHome() {
    window.location.href = "inicial.html";
}
function irParaHome(){
    window.location.href = "inicial.html";
}
function cadastraranimal(){
    window.location.href = "index.html";
}

function cancelarCadastro() {
    var confirmacao = confirm("Tem certeza que deseja cancelar o cadastro? Ao cancelar esse cadastro, todas as pendências relacionadas a ela serão excluídas e não será possível desfazer o processo.");

    if (confirmacao) {
        window.location.href = "inicial.html";
    } 
}

document.addEventListener('DOMContentLoaded', function() {
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Usuário já autenticado:", user);
            
            if(window.location.href.includes('login.html')){
                window.location.href = "./inicial.html";
            }
            
            if (window.location.href.includes('novaficha.html')) {
                carregarAnimais(); 
            }
        } else {
            console.log("Usuário não autenticado.");
        }
    });
});

function carregarAnimais() {
    const selectAnimal = document.getElementById('animal');
    
    if(!selectAnimal){
        console.error("Elemento 'animal' não encontrado na página. Esta pagina não requer o carregamento de animais.");
        return;
    }
    
    selectAnimal.innerHTML = "";

    
    const optionEmBranco = document.createElement('option');
    optionEmBranco.value = "";
    optionEmBranco.textContent = "Selecione um animal";
    selectAnimal.appendChild(optionEmBranco);

    
    const userId = firebase.auth().currentUser.uid;
    db.collection('animais').where('userId', '==', userId).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                
                const optionAnimal = document.createElement('option');
                optionAnimal.value = doc.id; 
                optionAnimal.textContent = doc.data().nome; 
                selectAnimal.appendChild(optionAnimal);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar animais:", error);
        });
}




function salvarFicha() {
    const animalId = document.getElementById('animal').value;
    const nomeVeterinario = document.getElementById('nomeveterinario').value;
    const dataAtendimento = document.getElementById('dataAtendimento').value;
    const procedimento = document.getElementById('atendimento').value;

    
    if (!animalId || !nomeVeterinario || !dataAtendimento || !procedimento) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const fichaAtendimentoData = {
        userId: firebase.auth().currentUser.uid,
        animalId: animalId,
        nomeVeterinario: nomeVeterinario,
        dataAtendimento: dataAtendimento,
        procedimento: procedimento
    };

    
    db.collection('fichas').add(fichaAtendimentoData)
        .then(function(docRef) {
            console.log("Ficha de atendimento cadastrada com ID: ", docRef.id);
            
            document.getElementById('formNovaFicha').reset();
            
            var mensagemFicha = document.getElementById('mensagemFicha');
            if (mensagemFicha) {
                mensagemFicha.textContent = "Ficha de atendimento cadastrada com sucesso!";
            }
            
            setTimeout(() => {
                window.location.href = "inicial.html";
            }, 1000);
        })
}
  

function cancelarFicha() {
    var confirmacao = confirm("Tem certeza que deseja cancelar a criação da nova ficha? Ao excluir a ficha, todas as pendências relacionadas a ela serão excluídas e não será possível desfazer o processo.");

    if (confirmacao) {
        window.location.href = "inicial.html";
    } 
}
function buscarficha(){
    window.location.href = "buscarficha.html";
}



function seCadastrar(){
    window.location.href = "cadastro.html";
}

function VoltarLogin(){
    window.location.href = "Login.html";
}
function voltarLogin(){
    window.location.href = "Login.html";
}



function RedefinirSenha(){
    const email = document.getElementById('email').value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert('E-mail enviado com sucesso para redefinição de senha.');
            window.location.href = "Login.html";
        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found') {
                alert('Não existe uma conta associada a este e-mail. Por favor, verifique o e-mail fornecido.');
            } else {
                alert('Ocorreu um erro ao enviar o e-mail de redefinição de senha. Por favor, tente novamente mais tarde.');
            }
        });
}



var registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        
        validateForm();
    });
} else {
    console.error("Elemento 'register-form' não encontrado.");
}

function validateForm() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("ConfirmarPassword").value;
    var passwordLengthMessage = document.getElementById("password-length-message");
    var passwordMessage = document.getElementById("password-message");

    if (password.length < 6) {
        passwordLengthMessage.textContent = "A senha deve ter pelo menos 6 caracteres.";
        return;
    } else {
        passwordLengthMessage.textContent = "";
    }

    if (password !== confirmPassword) {
        passwordMessage.textContent = "As senhas não coincidem.";
        return; 
    } else {
        passwordMessage.textContent = "";
    }
    register();
}


function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(
        email, password
    ).then(() => {
        window.location.href = "login.html"; 
    }).catch(error => {
        alert(getErrorMessage(error));
    })
}

function getErrorMessage(error) {
    if (error.code == "auth/email-already-in-use") {
        return "Email já está em uso";
    }
    return error.message;
}




function buscarAnimaisDoUsuario() {
    
    const userId = firebase.auth().currentUser.uid;

    
    const animaisRef = firebase.firestore().collection('animais').where('userId', '==', userId);

    
    animaisRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            
            const animal = doc.data();
            
            console.log('Animal encontrado:', animal);
        });
    }).catch((error) => {
        console.error('Erro ao buscar animais:', error);
    });
}


function exibirAnimaisDoUsuario() {
    
    const user = firebase.auth().currentUser;
    if (user) {
        
        const userId = user.uid;

        const animaisRef = firebase.firestore().collection('animais').where('userId', '==', userId);

        
        document.getElementById('animais').innerHTML = '';

        
        animaisRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
                const animal = doc.data();
                
                
                const button = document.createElement('button');
                button.classList.add('animal-button');
                button.textContent = `${animal.nome} - ${animal.raca} - ${animal.especie} - ${animal.idade}`;
                
                
                button.addEventListener('click', () => {
                    alert(`Detalhes do animal:\nNome: ${animal.nome}\nRaça: ${animal.raca}\nEspécie: ${animal.especie}\nIdade: ${animal.idade}`);
                });
                
                
                document.getElementById('animais').appendChild(button);
            });
        }).catch((error) => {
            console.error('Erro ao buscar animais:', error);
        });
    } else {
        console.log('Nenhum usuário autenticado.');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    exibirAnimaisDoUsuario();
    
    
});











document.addEventListener('DOMContentLoaded', function() {
   
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Usuário já autenticado:", user);
            
            if (window.location.href.includes('login.html')) {
                window.location.href = "./inicial.html";
            }
            
            if (window.location.href.includes('buscarficha.html')) {
               
                carregarAnimaisBuscar();
            }
        } else {
            console.log("Usuário não autenticado.");
        }
    });
});

function carregarAnimaisBuscar() {
    
    const userId = firebase.auth().currentUser.uid;
    const selectAnimal = document.getElementById('selectAnimalBuscar');
    selectAnimal.innerHTML = ""; 

    
    const optionEmBranco = document.createElement('option');
    optionEmBranco.value = "";
    optionEmBranco.textContent = "Selecione um animal";
    selectAnimal.appendChild(optionEmBranco);

    
    db.collection('animais').where('userId', '==', userId).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                
                const optionAnimal = document.createElement('option');
                optionAnimal.value = doc.id; 
                optionAnimal.textContent = doc.data().nome; 
                selectAnimal.appendChild(optionAnimal);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar animais:", error);
        });
}

function buscarFichasDoAnimal() {
    
    const animalId = document.getElementById('selectAnimalBuscar').value;

    
    if (!animalId) {
        console.error("Nenhum animal selecionado.");
        return;
    }

    
    const fichasDeAtendimentoList = document.getElementById('fichasDeAtendimento');
    
    
    fichasDeAtendimentoList.innerHTML = "";

    
    db.collection('fichas').where('animalId', '==', animalId).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                
                const noFichasMessage = document.createElement('tr');
                const noFichasDataCell = document.createElement('td');
                noFichasDataCell.colSpan = 4; 
                noFichasDataCell.textContent = "Nenhuma ficha de atendimento encontrada para este animal.";
                noFichasMessage.appendChild(noFichasDataCell);
                fichasDeAtendimentoList.appendChild(noFichasMessage);
            } else {
                
                querySnapshot.forEach(async doc => {
                    const ficha = doc.data();
                    
                    const nomeAnimal = await obterNomeAnimal(ficha.animalId);
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${ficha.dataAtendimento}</td>
                        <td>${nomeAnimal}</td>
                        <td>${ficha.nomeVeterinario}</td>
                        <td>${ficha.procedimento}</td>
                    `;
                    fichasDeAtendimentoList.appendChild(newRow);
                });
            }
        })
        .catch(error => {
            console.error("Erro ao buscar fichas de atendimento:", error);
        });
}


async function obterNomeAnimal(animalId) {
    try {
        const animalDoc = await db.collection('animais').doc(animalId).get();
        if (animalDoc.exists) {
            return animalDoc.data().nome;
        } else {
            console.error("Documento do animal não encontrado.");
            return "Animal não encontrado";
        }
    } catch (error) {
        console.error("Erro ao obter nome do animal:", error);
        return "Erro ao obter nome do animal";
    }
}



function editaranimal(){
    window.location.href = "editarAnimal.html";
}




function carregarAnimaisSelecionar() {
    const selectAnimal = document.getElementById('nomeSelecionar');

    
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("Nenhum usuário autenticado.");
        return;
    }

    
    selectAnimal.innerHTML = "";

    
    const optionEmBranco = document.createElement('option');
    optionEmBranco.value = "";
    optionEmBranco.textContent = "Selecione um animal";
    selectAnimal.appendChild(optionEmBranco);

    
    const userId = user.uid;

    
    db.collection('animais').where('userId', '==', userId).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                
                const optionAnimal = document.createElement('option');
                optionAnimal.value = doc.id;
                optionAnimal.textContent = doc.data().nome; 
                selectAnimal.appendChild(optionAnimal);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar animais:", error);
        });

    
    selectAnimal.addEventListener('change', function() {
        const animalId = selectAnimal.value;

        if (animalId) {
            
            db.collection('animais').doc(animalId).get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        document.getElementById('novoNome').value = data.nome || '';
                        document.getElementById('datanasc').value = data.datanasc || '';
                        document.getElementById('especie').value = data.especie || '';
                        document.getElementById('idade').value = data.idade || '';
                        document.getElementById('sexo').value = data.sexo || '';
                        document.getElementById('raca').value = data.raca || '';
                        document.getElementById('porte').value = data.porte || '';
                        document.getElementById('observacoes').value = data.observacoes || '';
                    } else {
                        console.error("Nenhum documento encontrado para o animal selecionado.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar animal:", error);
                });
        } else {
            
            document.getElementById('nome').value = '';
            document.getElementById('datanasc').value = '';
            document.getElementById('especie').value = '';
            document.getElementById('idade').value = '';
            document.getElementById('sexo').value = '';
            document.getElementById('raca').value = '';
            document.getElementById('porte').value = '';
            document.getElementById('observacoes').value = '';
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            console.log("Usuario ja autenticado:", user);
            if (window.location.pathname.includes('login.html')) {
                window.location.href = "./inicial.html";
            }
            if (window.location.pathname.includes('editarAnimal.html')) {
            
                carregarAnimaisSelecionar();
            }
        } else {
                    
            console.log("Nenhum usuário autenticado.");
                    
        }
    });
    
});




function cancelarEdicao() {
    if (confirm("Tem certeza de que deseja cancelar as alterações?")) {
        window.location.href = "inicial.html";
    }
}


function apagarAnimal() {
    const selectAnimal = document.getElementById('nomeSelecionar');
    const animalId = selectAnimal.value;

    if (!animalId) {
        alert("Por favor, selecione um animal para excluir.");
        return;
    }

    if (confirm("Tem certeza de que deseja excluir este animal?")) {
        
        db.collection('animais').doc(animalId).delete()
            .then(() => {
                alert("Animal excluído com sucesso.");
                
                carregarAnimaisSelecionar();
            })
            .catch(error => {
                console.error("Erro ao excluir animal:", error);
                alert("Erro ao excluir o animal. Por favor, tente novamente mais tarde.");
            });
    }
    limparCampos();
}


function salvarEdicao() {
    const selectAnimal = document.getElementById('nomeSelecionar');
    const animalId = selectAnimal.value;

    if (!animalId) {
        alert("Por favor, selecione um animal para salvar as alterações.");
        return;
    }

    const novoNome = document.getElementById('novoNome').value;

    const datanasc = document.getElementById('datanasc').value;
    const especie = document.getElementById('especie').value;
    const idade = document.getElementById('idade').value;
    const sexo = document.getElementById('sexo').value;
    const raca = document.getElementById('raca').value;
    const porte = document.getElementById('porte').value;
    const observacoes = document.getElementById('observacoes').value;

   
    db.collection('animais').doc(animalId).update({
        nome: novoNome, 
        datanasc: datanasc,
        especie: especie,
        idade: idade,
        sexo: sexo,
        raca: raca,
        porte: porte,
        observacoes: observacoes
    })
    .then(() => {
        alert("Alterações salvas com sucesso.");
        
        limparCampos();
        
        carregarAnimaisSelecionar();
    })
    .catch(error => {
        console.error("Erro ao salvar as alterações:", error);
        alert("Erro ao salvar as alterações. Por favor, tente novamente mais tarde.");
    });
}
function limparCampos() {
    document.getElementById('nomeSelecionar').value = '';
    document.getElementById('novoNome').value = '';
    document.getElementById('datanasc').value = '';
    document.getElementById('especie').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('raca').value = '';
    document.getElementById('porte').value = '';
    document.getElementById('observacoes').value = '';
}