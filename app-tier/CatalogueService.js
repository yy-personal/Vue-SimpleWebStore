const dbcreds = require('./DbConfig');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: dbcreds.DB_HOST,
    user: dbcreds.DB_USER,
    password: dbcreds.DB_PWD,
    database: dbcreds.DB_DATABASE
});

function addCatalogueItem(product_name, gender, type, price, stock, image_path) {
    var sql = `INSERT INTO catalogue (product_name, gender, type, price, stock, image_path) VALUES (?, ?, ?, ?, ?, ?)`;
    con.query(sql, [product_name, gender, type, price, stock, image_path], function(err, result) {
        if (err) throw err;
        console.log("1 item added to the catalogue");
    });
    return 200; // Note: Returning HTTP status like this won't work in async operations
}

function getAllCatalogueItems(callback) {
    var sql = "SELECT * FROM catalogue";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Retrieving all catalogue items...");
        return callback(result);
    });
}

function findCatalogueItemById(id, callback) {
    var sql = `SELECT * FROM catalogue WHERE id = ?`;
    con.query(sql, [id], function(err, result) {
        if (err) throw err;
        console.log(`Retrieving catalogue item with id ${id}`);
        return callback(result);
    });
}

function deleteAllCatalogueItems(callback) {
    var sql = "DELETE FROM catalogue";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Deleting all catalogue items...");
        return callback(result);
    });
}

function deleteCatalogueItemById(id, callback) {
    var sql = `DELETE FROM catalogue WHERE id = ?`;
    con.query(sql, [id], function(err, result) {
        if (err) throw err;
        console.log(`Deleting catalogue item with id ${id}`);
        return callback(result);
    });
}

module.exports = {
    addCatalogueItem,
    getAllCatalogueItems,
    findCatalogueItemById,
    deleteAllCatalogueItems,
    deleteCatalogueItemById
};
