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

//cadastrar animais
function salvarAnimalModel(animalData) {
    const userId = firebase.auth().currentUser.uid;
    animalData.userId = userId;

    return db.collection('animais').add(animalData)
        .then((docRef) => {
            console.log("Animal cadastrado com ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Erro ao cadastrar animal: ", error);
            throw error;
        });
}



//criar ficha para o animal


function carregarAnimalsModel() {
    const userId = firebase.auth().currentUser.uid;
    return db.collection('animais')
        .where('userId', '==', userId)
        .get()
        .then(snapshot => {
            const animals = [];
            snapshot.forEach(doc => {
                animals.push({ id: doc.id, ...doc.data() });
            });
            return animals;
        });
}

function salvarFichaModel(fichaAtendimentoData) {
    return db.collection('fichas').add(fichaAtendimentoData);
}



//Editar animal 

function buscarAnimais(userId) {
    return db.collection('animais').where('userId', '==', userId).get().then((querySnapshot) => {
        let animais = [];
        querySnapshot.forEach((doc) => {
            animais.push({ id: doc.id, ...doc.data() });
        });
        console.log('Animais buscados:', animais);  // Debugging
        return animais;
    }).catch((error) => {
        console.error("Erro ao buscar animais:", error);
        throw error;
    });
}

function buscarAnimalPorId(id) {
    return db.collection('animais').doc(id).get().then((doc) => {
        if (!doc.exists) {
            throw new Error('Animal não encontrado.');
        }
        return { id: doc.id, ...doc.data() };
    });
}

function atualizarAnimal(id, dados) {
    return db.collection('animais').doc(id).update(dados);
}

function deletarAnimal(id) {
    const batch = db.batch();

    const animalRef = db.collection('animais').doc(id);
    batch.delete(animalRef);

    return db.collection('fichas').where('animalId', '==', id).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            return batch.commit();
        })
        .then(() => {
            console.log(`Animal e suas fichas excluídos com sucesso (ID: ${id}).`);
        })
        .catch(error => {
            console.error("Erro ao excluir animal e fichas:", error);
            throw error;
        });
}


//Buscar ficha do animal

async function carregarAnimais(userId) {
    try {
        const querySnapshot = await db.collection('animais').where('userId', '==', userId).get();
        const animais = [];
        querySnapshot.forEach(doc => {
            animais.push({ id: doc.id, nome: doc.data().nome });
        });
        return animais;
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        throw error;
    }
}

async function buscarFichas(animalId) {
    try {
        const querySnapshot = await db.collection('fichas').where('animalId', '==', animalId).get();
        const fichas = [];
        querySnapshot.forEach(doc => {
            fichas.push({ id: doc.id, ...doc.data() });
        });
        return fichas;
    } catch (error) {
        console.error("Erro ao buscar fichas de atendimento:", error);
        throw error;
    }
}

async function obterNomeAnimal(animalId) {
    try {
        const doc = await db.collection('animais').doc(animalId).get();
        return doc.exists ? doc.data().nome : "Desconhecido";
    } catch (error) {
        console.error("Erro ao obter nome do animal:", error);
        throw error;
    }
}


// Edição da ficha de atendimento




async function buscarFicha(id) {
    try {
        const doc = await db.collection('fichas').doc(id).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error("Erro ao buscar ficha:", error);
        throw error;
    }
}

async function atualizarFicha(id, dados) {
    try {
        await db.collection('fichas').doc(id).update(dados);
    } catch (error) {
        console.error("Erro ao atualizar ficha:", error);
        throw error;
    }
}

async function deletarFicha(id) {
    try {
        await db.collection('fichas').doc(id).delete();
    } catch (error) {
        console.error("Erro ao excluir ficha:", error);
        throw error;
    }
}

export {salvarAnimalModel, salvarFichaModel, carregarAnimalsModel, buscarAnimais, buscarAnimalPorId, atualizarAnimal, deletarAnimal,
    carregarAnimais, buscarFichas, obterNomeAnimal,
    buscarFicha, atualizarFicha, deletarFicha}
