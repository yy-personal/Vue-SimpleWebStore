const catalogueService = require('./CatalogueService.js');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Health Checking
app.get('/health', (req, res) => {
    res.json("This is the health check for catalogue");
});

app.post('/transaction', async (req, res) => {
    const response = await axios.put(
    'https://aike43sz0a.execute-api.ap-southeast-2.amazonaws.com/record',
    // '{"transaction_id": "123", "price": 12345, "name": "myitem"}',
    {
        'transaction_id': req.body.transaction_id,
        'price': req.body.price,
        'name': req.body.name,
    },
    {
        headers: {
        'Content-Type': 'application/json'
        }
    }
    ).then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
})


//curl -X "PUT" -H "Content-Type: application/json" -d "{\"transaction_id\": \"123\", \"price\": 12345, \"name\": \"myitem\"}" https://aike43sz0a.execute-api.ap-southeast-2.amazonaws.com/record

app.get('/api/health2', (req, res) => {
    res.json({ message: "Health Check 2: Catalogue service is up and running." });
});

// ADD CATALOGUE ITEM
app.post('/catalogue', (req, res) => {
    try {
        console.log(req.body);
        const { product_name, gender, type, price, stock, image_path } = req.body;
        catalogueService.addCatalogueItem(product_name, gender, type, price, stock, image_path);
        res.json({ message: 'Added catalogue item successfully' });
    } catch (err) {
        res.json({ message: 'Something went wrong', error: err.message });
    }
});

// GET ALL CATALOGUE ITEMS
app.get('/catalogue', (req, res) => {
    try {
        catalogueService.getAllCatalogueItems(function(results) {
            console.log("Retrieving all catalogue items:");
            res.json({"result": results});
        });
    } catch (err) {
        res.json({message: "Could not get all catalogue items", error: err.message});
    }
});

// DELETE ALL CATALOGUE ITEMS
app.delete('/catalogue', (req, res) => {
    try {
        catalogueService.deleteAllCatalogueItems(function(result) {
            res.json({message: "All catalogue items deleted successfully."})
        });
    } catch (err) {
        res.json({message: "Deleting all catalogue items may have failed.", error: err.message});
    }
});

// DELETE ONE CATALOGUE ITEM
app.delete('/catalogue/:id', (req, res) => {
    try {
        const { id } = req.params;
        catalogueService.deleteCatalogueItemById(id, function(result) {
            res.json({message: `Catalogue item with id ${id} deleted successfully.`});
        });
    } catch (err) {
        res.json({message: "Error deleting catalogue item", error: err.message});
    }
});

// GET SINGLE CATALOGUE ITEM
app.get('/catalogue/:id', (req, res) => {
    try {
        const { id } = req.params;
        catalogueService.findCatalogueItemById(id, function(result) {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.json({message: "No catalogue item found with given id"});
            }
        });
    } catch (err) {
        res.json({message: "Error retrieving catalogue item", error: err.message});
    }
});

app.listen(port, () => {
    console.log(`Catalogue app listening at http://localhost:${port}`)
});
