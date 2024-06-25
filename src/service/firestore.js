const firebaseConfig = {
    apiKey: "AIzaSyBPlhIlvJV45Q0MYEPeD39w7Yfumor2aas",
    authDomain: "integrador-34f24.firebaseapp.com",
    projectId: "integrador-34f24",
    storageBucket: "integrador-34f24.appspot.com",
    messagingSenderId: "172090242497",
    appId: "1:172090242497:web:f8a358455abec8f2c36b40"
};

firebase.initializeApp(firebaseConfig);

senha
const db = firebase.firestore();



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
  
  function cancelarCadastro() {
    var confirmacao = confirm("Tem certeza que deseja cancelar o cadastro? Ao cancelar esse cadastro, todas as pendências relacionadas a ela serão excluídas e não será possível desfazer o processo.");

    if (confirmacao) {
        window.location.href = "inicial.html";
    } 
}





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