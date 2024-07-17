
import { salvarAnimalModel, salvarFichaModel, carregarAnimalsModel, buscarAnimais, buscarAnimalPorId, atualizarAnimal, deletarAnimal,
    carregarAnimais , buscarFichas, obterNomeAnimal,
    buscarFicha, atualizarFicha, deletarFicha } from '../../model/firestore.js';



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
    if (window.location.href.includes('novaficha.html')) {

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                CarregarAnimais();
                setDateToToday();
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
        cancelarButton.addEventListener('click', cancelar);
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

function setDateToToday() {
    const dataAtendimento = document.getElementById('dataAtendimento');
    const today = new Date().toISOString().split('T')[0];
    dataAtendimento.value = today;
    dataAtendimento.max = today;
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

function cancelar() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você deseja cancelar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, cancelar!',
        cancelButtonText: 'Não, continuar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "inicial.html";
        }
    });
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
        Swal.fire({
            title: 'Erro!',
            text: 'Por favor, selecione um animal para salvar as alterações.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
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
            Swal.fire({
                title: 'Sucesso!',
                text: 'Alterações salvas com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'inicial.html';
            });
        })
        .catch((error) => {
            console.error("Erro ao salvar as alterações:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao salvar as alterações. Por favor, tente novamente mais tarde.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}

function confirmarExcluirAnimal() {
    apagarAnimal();
}

function apagarAnimal() {
    const selectAnimal = document.getElementById('nomeSelecionar');
    const animalId = selectAnimal.value;

    if (!animalId) {
        Swal.fire({
            title: 'Erro!',
            text: 'Por favor, selecione um animal para excluir.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: 'Tem certeza?',
        text: "Você realmente deseja excluir este animal e todas as suas fichas?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            deletarAnimal(animalId)
                .then(() => {
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'Animal e suas fichas excluídos com sucesso.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = 'inicial.html';
                    });
                })
                .catch((error) => {
                    console.error("Erro ao excluir o animal e suas fichas:", error);
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao excluir o animal e suas fichas. Por favor, tente novamente mais tarde.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                });
        }
    });
}

function cancelarEdicao() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você deseja cancelar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, cancelar!',
        cancelButtonText: 'Não, continuar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "inicial.html";
        }
    });
}

function limparCampos() {
    document.getElementById('formCadastroAnimal').reset();
}



//Buscar ficha do animal


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

async function carregarAnimaisBuscar() {
    const userId = firebase.auth().currentUser.uid;
    const selectAnimal = document.getElementById('selectAnimalBuscar');
    selectAnimal.innerHTML = ""; 

    const optionEmBranco = document.createElement('option');
    optionEmBranco.value = "";
    optionEmBranco.textContent = "Selecione um animal";
    selectAnimal.appendChild(optionEmBranco);

    try {
        const animais = await carregarAnimais(userId);
        animais.forEach(animal => {
            const optionAnimal = document.createElement('option');
            optionAnimal.value = animal.id;
            optionAnimal.textContent = animal.nome;
            selectAnimal.appendChild(optionAnimal);
        });
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
    }
}

async function buscarFichasDoAnimal() {
    const animalId = document.getElementById('selectAnimalBuscar').value;

    if (!animalId) {
        console.error("Nenhum animal selecionado.");
        return;
    }

    const fichasDeAtendimentoList = document.getElementById('fichasDeAtendimento').getElementsByTagName('tbody')[0];
    fichasDeAtendimentoList.innerHTML = "";

    try {
        const fichas = await buscarFichas(animalId);
        if (fichas.length === 0) {
            const noFichasMessage = document.createElement('tr');
            const noFichasDataCell = document.createElement('td');
            noFichasDataCell.colSpan = 5; 
            noFichasDataCell.textContent = "Nenhuma ficha de atendimento encontrada para este animal.";
            noFichasMessage.appendChild(noFichasDataCell);
            fichasDeAtendimentoList.appendChild(noFichasMessage);
        } else {
            for (const ficha of fichas) {
                const nomeAnimal = await obterNomeAnimal(ficha.animalId);
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${ficha.dataAtendimento}</td>
                    <td>${nomeAnimal}</td>
                    <td>${ficha.nomeVeterinario}</td>
                    <td>${ficha.procedimento}</td>
                    <td><button onclick="editarFicha('${ficha.id}')">Editar</button></td>
                `;
                fichasDeAtendimentoList.appendChild(newRow);
            }
        }
    } catch (error) {
        console.error("Erro ao buscar fichas de atendimento:", error);
    }
}

function editarFicha(id) {
    window.location.href = `editarficha.html?id=${id}`;
}

window.carregarAnimaisBuscar = carregarAnimaisBuscar;
window.buscarFichasDoAnimal = buscarFichasDoAnimal;
window.editarFicha = editarFicha;



// Editar fichas de atendimento

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const fichaId = params.get('id');

    if (fichaId) {
        await preencherFormulario(fichaId);
    }
});

async function preencherFormulario(id) {
    try {
        const ficha = await buscarFicha(id);
        if (ficha) {
            document.getElementById('dataAtendimento').value = ficha.dataAtendimento || '';
            document.getElementById('nomeVeterinario').value = ficha.nomeVeterinario || '';
            document.getElementById('procedimento').value = ficha.procedimento || '';
        } else {
            console.error("Ficha não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao preencher formulário:", error);
    }
}

async function salvarEdicaoFicha() {
    const dataAtendimento = document.getElementById('dataAtendimento').value;
    const nomeVeterinario = document.getElementById('nomeVeterinario').value;
    const procedimento = document.getElementById('procedimento').value;

    const params = new URLSearchParams(window.location.search);
    const fichaId = params.get('id');

    try {
        await atualizarFicha(fichaId, {
            dataAtendimento,
            nomeVeterinario,
            procedimento
        });
        Swal.fire({
            title: 'Sucesso!',
            text: 'Ficha atualizada com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = "buscarficha.html";
        });
    } catch (error) {
        console.error("Erro ao atualizar ficha:", error);
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao atualizar ficha. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function apagarFicha() {
    const params = new URLSearchParams(window.location.search);
    const fichaId = params.get('id');

    Swal.fire({
        title: 'Tem certeza?',
        text: "Você deseja excluir esta ficha?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Não, cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deletarFicha(fichaId);
                Swal.fire(
                    'Excluída!',
                    'Ficha excluída com sucesso.',
                    'success'
                ).then(() => {
                    window.location.href = "buscarficha.html";
                });
            } catch (error) {
                console.error("Erro ao excluir ficha:", error);
                Swal.fire(
                    'Erro!',
                    'Erro ao excluir ficha. Tente novamente.',
                    'error'
                );
            }
        }
    });
}

window.preencherFormulario = preencherFormulario;
window.salvarEdicaoFicha = salvarEdicaoFicha;
window.apagarFicha = apagarFicha;

