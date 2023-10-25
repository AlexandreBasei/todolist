const npxPlugins = Plugins.Capacitor();

var config = {
    apiKey: "AIzaSyACQzKNlnkkPf5YMyfnFSEfWgdDCtzceus",
    authDomain: "todolist-72f3a.firebaseapp.com",
    databaseURL: "https://todolist-72f3a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "todolist-72f3a",
    storageBucket: "todolist-72f3a.appspot.com",
    messagingSenderId: "68012756560",
    appId: "1:68012756560:web:103f2ca483c5deeda1cb55",
    measurementId: "G-5KZ5RZZ595"
    };

firebase.initializeApp(config);
var database = firebase.database();

const signIn = function () {
    var mail = $("#mail").val();
    var logPassword = $("#logPassword").val();
    firebase.auth().createUserWithEmailAndPassword(mail, logPassword).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // une erreur est survenue
        }).then(function(){
        console.log("compte créé");
    });
}

const logIn = function () {
    var login = $("#login").val();
    var password = $("#password").val();
    firebase.auth().signInWithEmailAndPassword(login,password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // une erreur est survenue dans l’authentification
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
        return firebase.auth().signInWithEmailAndPassword(login,password);
        })
        .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // une erreur est survenue dans la persistence
        });
    });
}

var elems = document.querySelectorAll('.sidenav');
var instances = M.Sidenav.init(elems);

var elems = document.querySelectorAll('.modal');
var instances = M.Modal.init(elems, { endingTop: '20%' });

var elems = document.querySelector('#modal2');
var instances = M.Modal.init(elems);


var elems = document.querySelectorAll('select');
var instances = M.FormSelect.init(elems);

var categories = new Array();

var imageUrl;

const takePicture = async function () {
    var instance = M.Modal.getInstance($("#modal1"));
    instance.close();
    const image = await npxPlugins.Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: npxPlugins.CameraResultType.Base64
    });
    imageUrl = image.webPath;
    $("#imgvalid").val("Image ajoutée !");
    instance.open();
}

const scheduleNotification = async function (date, titre, msg) {
    await npxPlugins.LocalNotifications.requestPermissions();
    const notification = await npxPlugins.LocalNotifications.schedule({
        notifications: [{
            title: titre,
            body: msg,
            id: Math.floor(Math.random() * 10000 + 1),
            schedule: {
                at: date,
                allowWhileIdle: true
            }
        }]
    });
}

$("#my-done-list").hide();

const addItem = function () {
    var todoItem = $("#todo-item").val();
    var todoItemDesc = $("#todo-item-desc").val();
    var todoItemDate = $("#todo-item-date").val();
    var itemTemplate;
    let id = Date.now();

    if (imageUrl) {
        itemTemplate =
            '<li class="collection-item animate__bounceIn">' +
            '<div class="obj"><p>Nom : ' + todoItem + '<br/>Description : ' + todoItemDesc + '<br/>Date : ' + todoItemDate + '</p>' +
            '<div class="secondary-content obj2">' +
            '<label>' +
            '<input type="checkbox" class="valign-wrapper filled-in" onclick="moveItemDone(this);"/>' +
            '<span></span>' +
            '</label>' +
            '<a class="btn-floating waves-effect waves-light red poubelle" onclick="deleteItem(this);" id="task_'+ id + '"><i class="material-icons">delete</i></a>' +
            '</div>' +
            '</div>' +
            '<br><img src="' + imageUrl + '" class="todoimg">' +
            '</li>'
            ;
    }
    else {
        itemTemplate =
            '<li class="collection-item animate__bounceIn">' +
            '<div class="obj"><p>Nom : ' + todoItem + '<br/>Description : ' + todoItemDesc + '<br/>Date : ' + todoItemDate + '</p>' +
            '<div class="secondary-content obj2">' +
            '<label>' +
            '<input type="checkbox" class="valign-wrapper filled-in" onclick="moveItemDone(this);" />' +
            '<span></span>' +
            '</label>' +
            '<a class="btn-floating waves-effect waves-light red poubelle" onclick="deleteItem(this);" id="task_'+ id + '"><i class="material-icons">delete</i></a>' +
            '</div>' +
            '</div>' +
            '</li>'
            ;
    }
    let date = new Date(todoItemDate);
    scheduleNotification(date, todoItem, todoItemDesc);
    $("#my-todo-list").append(itemTemplate);
    setTask(itemTemplate, id);
    $("#todo-item").val('');
}

const moveItemDone = function (element) {
    var todoItem = $(element).attr("onclick", "moveItemTodo(this)").parents(".collection-item");
    $(todoItem).remove();
    $("#my-done-list").append(todoItem);
    let clef = $(element).parents(".collection-item").find(".poubelle").attr("id");
    firebase.database().ref("taches/" + clef).update({status: 1});
    

    if ($('#my-done-list .collection-item').length <= 0) {
        $("#my-done-list").hide();
    }
    else {
        $("#my-done-list").show();
    }
}

const moveItemTodo = function (element) {
    var todoItem = $(element).attr("onclick", "moveItemDone(this)").parents(".collection-item");
    $(todoItem).remove();
    $("#my-todo-list").append(todoItem);
    let clef = $(element).parents(".collection-item").find(".poubelle").attr("id");
    firebase.database().ref("taches/" + clef).update({status: 0});
    if ($('#my-done-list .collection-item').length <= 0) {
        $("#my-done-list").hide();
    }
    else {
        $("#my-done-list").show();
    }
}

const deleteItem = function (element) {
    var deleteItem = $(element).attr("onclick", "moveItemDone(this)").parents(".collection-item");
    let clef = element.getAttribute('id');
    delTask(clef);
    $(deleteItem).remove();
}

const addCat = function () {
    var cat = $("#add-categorie").val();
    categories.push(cat);

    // $('select').formSelect();

    // Ajouter une nouvelle option
    var nouvelleOption = document.createElement("option");
    nouvelleOption.value = cat;
    nouvelleOption.text = cat;
    $("#categories").add(nouvelleOption);

    // Mettre à jour le sélecteur Materialize pour refléter les changements
    M.FormSelect.init($("#categories"));
}

const setTask = async (text, id) => {
    firebase.database().ref("taches/task_" + id).set({
        html: text,
        status: 0
    })
}

const loadAllTask = async () => {
    // firstKeys = await npxPlugins.Preferences.keys();
    // allKeys = firstKeys.keys;
    // console.log(allKeys);
    // allKeys.forEach(keys => {
    //     npxPlugins.Preferences.get({
    //         key: keys
    //     }).then(result => {
    //         let res = result.value;
    //         console.log(JSON.stringify(res));
    //         // $("#my-todo-list").append()
    //     })
    // })
    firebase.database().ref("taches/").once('value').then(snapshot => {
        if (snapshot.exists()) {
          const allKeys = Object.keys(snapshot.val()); // Obtenez les noms de nœuds (clés)
          allKeys.forEach(clef => {
            firebase.database().ref("taches/" + clef).once('value', function(snapshot2) {
                let res = snapshot2.val();
                if (res.status == 0) {
                    $("#my-todo-list").append(res.html);
                }
                else {
                    $("#my-done-list").show();
                    $("#my-done-list").append(res.html);
                    $("#my-done-list").child(".")
                }
            })
          })
        } else {
          console.log('Aucune donnée dans la base de données.');
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des clés :', error);
    });
}

const getTask = async (clef) => {

    // await npxPlugins.Preferences.get({
    //     key: clef
    //   }).then(result => {
    //     if (result.value) {
    //       const res = result.value;
    //       return res;
    //     } else {
    //       console.log('Aucune chaîne de caractères trouvée pour cette clé.');
    //     }
    //   }).catch(error => {
    //     console.error('Erreur lors de la récupération de la chaîne :', error);
    //   });
    
    firebase.database().ref("taches/" + clef).once('value', function(snapshot) {
        return snapshot.value();
    })
    
}

function delTask(clef) {
    // npxPlugins.Preferences.remove({ key: clef })
    //   .then(() => {
    //     console.log(`Préférence avec la clé "${clef}" supprimée avec succès.`);
    //   })
    //   .catch(error => {
    //     console.error(`Erreur lors de la suppression de la préférence avec la clé "${clef}" :`, error);
    //   });
    firebase.database().ref("taches/").child(clef).remove()
  .then(() => {
    console.log(`La tâche "${clef}" a été supprimée avec succès.`);
  })
  .catch(error => {
    console.error(`Erreur lors de la suppression de la tâche "${clef}":`, error);
  });
}


document.addEventListener("DOMContentLoaded",async() => {
    await loadAllTask()
});