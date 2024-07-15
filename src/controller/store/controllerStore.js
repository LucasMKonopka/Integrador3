//cadastrar animais


import { salvarAnimalModel, salvarFichaModel, carregarAnimalsModel, buscarAnimais, buscarAnimalPorId, atualizarAnimal, deletarAnimal} from '../../model/firestore.js';



function salvarAnimal() {
    const nome = document.getElementById('nome').value.trim();
    const datanasc = document.getElementById('datanasc').value.trim();
    const especie = document.getElementById('especie').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const sexo = document.getElementById('sexo').value.trim();
    const raca = document.getElementById('raça').value.trim();
    const porte = document.getElementById('porte').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();
    
    if (!nome || !datanasc || !especie || !idade || !sexo || !raca || !porte) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    
    const animalData = {
        nome,
        datanasc,
        especie,
        idade,
        sexo,
        raca,
        porte,
        observacoes
    };
    
    salvarAnimalModel(animalData)
        .then(() => {
            document.getElementById('mensagemCadastro').textContent = "Animal cadastrado com sucesso!";
            formCadastroAnimal.reset();
            setTimeout(() => {
                window.location.href = "inicial.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("Erro ao cadastrar animal: ", error);
            document.getElementById('mensagemCadastro').textContent = "Erro ao cadastrar animal. Por favor, tente novamente.";
        });
}
window.salvarAnimal = salvarAnimal;



//criar ficha para o animal

document.addEventListener('DOMContentLoaded', function() {

    if (window.location.href.includes('novaficha.html') /*|| window.location.href.includes('editarAnimal.html')*/) {

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                CarregarAnimais();
            } else {
                console.log('Usuário não autenticado.');
            }
        });
    }

    const salvarButton = document.getElementById('salvar');
    if (salvarButton) {
        salvarButton.addEventListener('click', salvarFicha);
    }

    const cancelarButton = document.getElementById('cancelar');
    if (cancelarButton) {
        cancelarButton.addEventListener('click', cancelarFicha);
    }
});

function CarregarAnimais() {
    carregarAnimalsModel()
        .then((animais) => {
            const selectAnimal = document.getElementById('animal');
            animais.forEach(animal => {
                const option = document.createElement('option');
                option.value = animal.id;
                option.text = animal.nome;
                selectAnimal.add(option);
            });
        })
        .catch((error) => {
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

    salvarFichaModel(fichaAtendimentoData)
        .then(() => {
            document.getElementById('formNovaFicha').reset();
            document.getElementById('mensagemCadastro').textContent = "Ficha de atendimento cadastrada com sucesso!";
            setTimeout(() => {
                window.location.href = "inicial.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("Erro ao salvar ficha de atendimento:", error);
        });
}

function cancelarFicha() {
    const confirmacao = confirm("Tem certeza que deseja cancelar a criação da nova ficha?");
    if (confirmacao) {
        window.location.href = "inicial.html";
    }
}



//Editar animal


document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user && window.location.href.includes('editarAnimal.html')) {
            loadAnimais(user.uid);
        } else {
            console.log('Usuário não autenticado ou em página incorreta.');
        }
    });

    const salvarAlteracoesButton = document.getElementById('salvarAlteracoes');
    if (salvarAlteracoesButton) {
        salvarAlteracoesButton.addEventListener('click', salvarEdicao);
    }

    const excluirAnimalButton = document.getElementById('excluirAnimal');
    if (excluirAnimalButton) {
        excluirAnimalButton.addEventListener('click', confirmarExcluirAnimal);
    }

    const cancelarAlteracoesButton = document.getElementById('cancelarAlteracoes');
    if (cancelarAlteracoesButton) {
        cancelarAlteracoesButton.addEventListener('click', cancelarEdicao);
    }

    const selectAnimal = document.getElementById('nomeSelecionar');
    if (selectAnimal) {
        selectAnimal.addEventListener('change', carregarDadosAnimal);
    }
});

function loadAnimais(userId) {
    buscarAnimais(userId)
        .then((animais) => {
            console.log('Animais carregados:', animais);  // Debugging
            const selectAnimal = document.getElementById('nomeSelecionar');
            selectAnimal.innerHTML = '<option value="">Selecione um animal</option>';
            animais.forEach(animal => {
                const option = document.createElement('option');
                option.value = animal.id;
                option.text = animal.nome;
                selectAnimal.add(option);
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar animais:", error);
        });
}

function carregarDadosAnimal() {
    const selectAnimal = document.getElementById('nomeSelecionar');
    const animalId = selectAnimal.value;

    if (!animalId) {
        limparCampos();
        return;
    }

    buscarAnimalPorId(animalId)
        .then(animal => {
            document.getElementById('novoNome').value = animal.nome || '';
            document.getElementById('datanasc').value = animal.datanasc || '';
            document.getElementById('especie').value = animal.especie || '';
            document.getElementById('idade').value = animal.idade || '';
            document.getElementById('sexo').value = animal.sexo || '';
            document.getElementById('raca').value = animal.raca || '';
            document.getElementById('porte').value = animal.porte || '';
            document.getElementById('observacoes').value = animal.observacoes || '';
        })
        .catch((error) => {
            console.error("Erro ao carregar dados do animal:", error);
        });
}

function salvarEdicao() {
    const selectAnimal = document.getElementById('nomeSelecionar');
    const animalId = selectAnimal.value;

    if (!animalId) {
        alert("Por favor, selecione um animal para salvar as alterações.");
        return;
    }

    const animalData = {
        nome: document.getElementById('novoNome').value,
        datanasc: document.getElementById('datanasc').value,
        especie: document.getElementById('especie').value,
        idade: document.getElementById('idade').value,
        sexo: document.getElementById('sexo').value,
        raca: document.getElementById('raca').value,
        porte: document.getElementById('porte').value,
        observacoes: document.getElementById('observacoes').value
    };

    atualizarAnimal(animalId, animalData)
        .then(() => {
            alert("Alterações salvas com sucesso.");
            window.location.href = 'inicial.html';
        })
        .catch((error) => {
            console.error("Erro ao salvar as alterações:", error);
            alert("Erro ao salvar as alterações. Por favor, tente novamente mais tarde.");
        });
}

function confirmarExcluirAnimal() {
    const confirmation = confirm("Tem certeza que deseja excluir este animal?");
    if (confirmation) {
        apagarAnimal();
    }
}

function apagarAnimal() {
    const selectAnimal = document.getElementById('nomeSelecionar');
    const animalId = selectAnimal.value;

    if (!animalId) {
        alert("Por favor, selecione um animal para excluir.");
        return;
    }

    deletarAnimal(animalId)
        .then(() => {
            alert("Animal excluído com sucesso.");
            window.location.href = 'inicial.html';
        })
        .catch((error) => {
            console.error("Erro ao excluir o animal:", error);
            alert("Erro ao excluir o animal. Por favor, tente novamente mais tarde.");
        });
}

function cancelarEdicao() {
    var confirmacao = confirm("tem certeza que deseja cancelar alterações? Todos as informações não salvas serão perdidas!")
    
    if(confirmacao){
        window.location.href = 'inicial.html';
    }
    
}

function limparCampos() {
    document.getElementById('formCadastroAnimal').reset();
}

