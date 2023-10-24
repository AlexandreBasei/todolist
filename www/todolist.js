const npxPlugins = Plugins.Capacitor();

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
        resultType: npxPlugins.CameraResultType.Uri
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

    if (imageUrl) {
        itemTemplate =
            '<li class="collection-item animate__bounceIn">' +
            '<div class="obj"><p>Nom : ' + todoItem + '<br/>Description : ' + todoItemDesc + '<br/>Date : ' + todoItemDate + '</p>' +
            '<div class="secondary-content obj2">' +
            '<label>' +
            '<input type="checkbox" class="valign-wrapper filled-in" onclick="moveItemDone(this);" />' +
            '<span></span>' +
            '</label>' +
            '<a class="btn-floating waves-effect waves-light red" onclick="deleteItem(this);"><i class="material-icons">delete</i></a>' +
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
            '<a class="btn-floating waves-effect waves-light red" onclick="deleteItem(this);"><i class="material-icons">delete</i></a>' +
            '</div>' +
            '</div>' +
            '</li>'
            ;
    }
    let date = new Date(todoItemDate);
    scheduleNotification(date, todoItem, todoItemDesc);
    $("#my-todo-list").append(itemTemplate);
    $("#todo-item").val('');
}

const moveItemDone = function (element) {
    var todoItem = $(element).attr("onclick", "moveItemTodo(this)").parents(".collection-item");
    $(todoItem).remove();
    $("#my-done-list").append(todoItem);

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
    if ($('#my-done-list .collection-item').length <= 0) {
        $("#my-done-list").hide();
    }
    else {
        $("#my-done-list").show();
    }
}

const deleteItem = function (element) {
    var deleteItem = $(element).attr("onclick", "moveItemDone(this)").parents(".collection-item");
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

// Fonction pour charger une préférence
const setPreference = async (text) => {

    // Utilisez la méthode `set` pour la stocker dans les préférences
    await npxPlugins.Preferences.set({
        key: "1",  // Clé sous laquelle vous souhaitez stocker la chaîne
        value: text
    }).then(() => {
        console.log('Chaîne de caractères stockée avec succès.');
    }).catch(error => {
        console.error('Erreur lors de la sauvegarde de la chaîne :', error);
    });
}

const getPreference = async (id) => {

    await npxPlugins.Preferences.get({
        key: id
      }).then(result => {
        if (result.value) {
          const maChaineRecuperee = result.value;
          console.log('Chaîne de caractères récupérée :', maChaineRecuperee);
        } else {
          console.log('Aucune chaîne de caractères trouvée pour cette clé.');
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération de la chaîne :', error);
      });

}

setPreference('LOLOLOLOLOLOLOL');
getPreference("1");