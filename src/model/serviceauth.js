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

function loginModel(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user;
        });
}

function registerModel(email, password, additionalData) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set(additionalData);
        });
}

function logoutModel() {
    return firebase.auth().signOut()
        .then(() => {
            console.log("Usuário deslogado com sucesso.");
        });
}

function RedefinirSenhaModel(email) {
    return firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            console.log('E-mail de redefinição de senha enviado.');
        });
}
//////////////////////////////////////////////////// edição

function salvarEdicaoUserModel(novoNome, cpf, novoEmail, novaSenha, userId) {
    const userRef = firebase.firestore().collection('users').doc(userId);

    return userRef.update({
        nome: novoNome,
        cpf: cpf
    }).then(() => {
        const user = firebase.auth().currentUser;

        if (user.email !== novoEmail) {
            return user.updateEmail(novoEmail);
        }
    }).then(() => {
        if (novaSenha) {
            const user = firebase.auth().currentUser;
            return user.updatePassword(novaSenha);
        }
    });
}

function cancelarEdicaoUserModel() {
    window.location.href = "../views/inicial.html";
}

function apagarUserModel(userId) {
    const userRef = firebase.firestore().collection('users').doc(userId);
    const fichasRef = firebase.firestore().collection('fichas').where('userId', '==', userId);
    const animaisRef = firebase.firestore().collection('animais').where('userId', '==', userId);

    return firebase.firestore().runTransaction(async (transaction) => {
        const fichasSnapshot = await fichasRef.get();
        fichasSnapshot.forEach((doc) => {
            transaction.delete(doc.ref);
        });

        const animaisSnapshot = await animaisRef.get();
        animaisSnapshot.forEach((doc) => {
            transaction.delete(doc.ref);
        });

        transaction.delete(userRef);
    });
}

export { loginModel, registerModel, logoutModel, RedefinirSenhaModel, salvarEdicaoUserModel, cancelarEdicaoUserModel, apagarUserModel};
