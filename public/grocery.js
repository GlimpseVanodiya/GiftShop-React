import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";


const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("gifts/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
       
        $$("#groceryList").html("");
        
        for(let n = 0; n < aKeys.length; n++){
            const card = document.createElement("div");
            card.classList.add("card");

            if(oItems[aKeys[n]].datePurchased) {
                card.innerHTML = `
            <div class="card-content card-content-padding" id="item1"><del>${oItems[aKeys[n]].item}</del></div>
            <div class="card-content card-content-padding">Price: $${oItems[aKeys[n]].store}</div>
            <img src="${oItems[aKeys[n]].imageUrl}" width="250" height="250">
            <button class="buy-button">I bought this</button>
            <button class="delete-button">I don't need this</button>
            `} 
            else{
            card.innerHTML = `
            <div class="card-content card-content-padding" id="item1">${oItems[aKeys[n]].item}</div>
            <div class="card-content card-content-padding">Price: $${oItems[aKeys[n]].store}</div>
            <img src="${oItems[aKeys[n]].imageUrl}" width="250" height="250">
            <button class="buy-button">I bought this</button>
            <button class="delete-button">I don't need this</button>
            `
            }

            // Add an event listener to the delete button
            const buyButton = card.querySelector(".buy-button");
            buyButton.addEventListener("click", function() {
              
              let idToFind = aKeys[n];
              const purchasedDate = new Date().toISOString();
              console.log(idToFind);
              console.log(purchasedDate);
              firebase.database().ref("gifts/" + sUser + "/" + idToFind).update({ datePurchased : purchasedDate });
            });

            const deleteButton = card.querySelector(".delete-button");
            deleteButton.addEventListener("click", function() {
              
              let idToFind = aKeys[n];
              firebase.database().ref("gifts/" + sUser + "/" + idToFind).remove()
              .then(function() {
                console.log('Record deleted successfully!');
              })
              .catch(function(error) {
                console.error('Error deleting record: ', error);
              });
            });

            $$("#groceryList").append(card);
        }
    });

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("gifts/" + sUser + "/" + sId).set(oData);
    
    app.sheet.close(".my-sheet", true);
});


