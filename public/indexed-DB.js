const DB_NAME = 'BudgetAppDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'BudgetAppStatement';

let db;
// Create Database with version #
var request = indexedDB.open(DB_NAME, DB_VERSION);
request.onerror = function(event) {
  console.log(`Error: ${event.target.error} was found!`);
};

request.onupgradeneeded = function(event) {
  db = event.target.result
  // Create Obj Store with autoIncrement which gives the store a key generator
  db.createObjectStore(DB_STORE_NAME,{ autoIncrement: true})
}

request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine){
    postRecords()
  }
};

function openTransaction() {
  // Tells IndexedDB to allow read/write access to the DB
  const transaction = db.transaction([DB_STORE_NAME],"readwrite");
  // Tells IndexedDB to access the object store to start transaction
  const dataStore = transaction.objectStore(DB_STORE_NAME)

  return dataStore
}

function postRecords() {
  var dataStore = openTransaction();
  // Makes a clone of records in DB
  const records = dataStore.getAll();
  // Post to api the records
  records.onsuccess = () => {
    if (records.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(records.result)
      })
      .then((response) => response.json())
      .then(() => {
       openTransaction().clear()  // Opens a transaction and clears the store
      });
  }}}

  function saveRecord(record) {
    var dataStore = openTransaction();
    
    dataStore.add(record);
    //return dataStore
  }

  window.addEventListener("online", postRecords);