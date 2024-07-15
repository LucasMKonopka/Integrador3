//cadastrar animais

import { salvarAnimalModel, salvarFichaModel, carregarAnimalsModel} from '../../model/firestore.js';


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
    if (window.location.href.includes('novaficha.html') || window.location.href.includes('editarAnimal.html')) {
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