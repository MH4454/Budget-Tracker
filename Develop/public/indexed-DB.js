const DB_NAME = 'BudgetAppDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'BudgetAppStatement';

var db;
// Create Database with version #
var request = indexedDB.open(DB_NAME, DB_VERSION);
request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = function(event) {
  db = event.target.result;
};