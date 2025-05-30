import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://leads-tracker-app-93ee8-default-rtdb.asia-southeast1.firebasedatabase.app/"
    //databaseURL: process.env.DATABASE_URL
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "leads");

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulEl = document.getElementById("ul-el");

// store current leads globally to check for duplicates
let currentLeads = [];

onValue(referenceInDB, (snapshot) => {
    if (snapshot.exists()) {
        const snapshotValues = snapshot.val();
        currentLeads = Object.values(snapshotValues);
        render(currentLeads);
    } else {
        currentLeads = [];
        ulEl.innerHTML = "";
    }
})

deleteBtn.addEventListener("dblclick", () => {
    remove(referenceInDB)
    ulEl.innerHTML = "";
});

// save input when clicked on save button
inputBtn.addEventListener("click", saveInput);

// save input when `Enter` key is pressed
inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        saveInput();
    }
});

function saveInput() {
    // remove whitespace from input
    const inputValue = inputEl.value.trim();

    if (inputValue === "" || !inputValue.startsWith("http")) { // check if input is empty or doesn't start with http
        alert("Please enter a valid URL");
        return;
    } else if (currentLeads.includes(inputValue)) { // check for duplicate URL
        alert("This URL already exists.");
        return;
    } else { // if no duplicates, save to database
        push(referenceInDB, inputValue)
    }

    // clear input field
    inputEl.value = "";
}

function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        listItems += `
		<li>
		    <a href="${leads[i]}" target="_blank">${leads[i]}</a>
		</li>
		`
    }
    ulEl.innerHTML = listItems;
}
