"use strict";
var express     = require('express'),
    bodyParser  = require('body-parser'),
    fs          = require('fs'),
    app         = express(),
    customers   = JSON.parse(fs.readFileSync('data/customers.json', 'utf-8')),
    states      = JSON.parse(fs.readFileSync('data/states.json', 'utf-8')),
    items       = JSON.parse(fs.readFileSync('data/items.json', 'utf-8'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Would normally copy necessary scripts into src folder (via grunt/gulp) but serving
//node_modules directly to keep everything as simple as possible
app.use('/node_modules', express.static(__dirname + '/node_modules')); 

//The src folder has our static resources (index.html, css, images)
app.use(express.static(__dirname + '/src')); 

/************************
 * /api/customers
 ************************/
app.get('/api/customers/page/:skip/:top', (req, res) => {
    const topVal = req.params.top,
          skipVal = req.params.skip,
          skip = (isNaN(skipVal)) ? 0 : +skipVal;  
    let top = (isNaN(topVal)) ? 10 : skip + (+topVal);

    if (top > customers.length) {
        top = skip + (customers.length - skip);
    }

    console.log(`Skip: ${skip} Top: ${top}`);

    var pagedCustomers = customers.slice(skip, top);
    res.setHeader('X-InlineCount', customers.length);
    res.json(pagedCustomers);
});

app.get('/api/customers', (req, res) => {
    res.json(customers);
});

app.get('/api/customers/:id', (req, res) => {
    let customerId = +req.params.id;
    let selectedCustomer = {};
    for (let customer of customers) {
        if (customer.id === customerId) {
           selectedCustomer = customer;
           break;
        }
    }  
    res.json(selectedCustomer);
});

app.post('/api/customers', (req, res) => {
    let postedCustomer = req.body;
    let maxId = Math.max.apply(Math,customers.map((cust) => cust.id));
    postedCustomer.id = ++maxId;
    postedCustomer.gender = (postedCustomer.id % 2 === 0) ? 'female' : 'male';
    customers.push(postedCustomer);
    res.json(postedCustomer);
});

app.put('/api/customers/:id', (req, res) => {
    let putCustomer = req.body;
    let id = +req.params.id;
    let status = false;

    //Ensure state name is in sync with state abbreviation 
    const filteredStates = states.filter((state) => state.abbreviation === putCustomer.state.abbreviation);
    if (filteredStates && filteredStates.length) {
        putCustomer.state.name = filteredStates[0].name;
        console.log('Updated putCustomer state to ' + putCustomer.state.name);
    }

    for (let i=0,len=customers.length;i<len;i++) {
        if (customers[i].id === id) {
            customers[i] = putCustomer;
            status = true;
            break;
        }
    }
    res.json({ status: status });
});

app.delete('/api/customers/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let i=0,len=customers.length;i<len;i++) {
        if (customers[i].id === customerId) {
           customers.splice(i,1);
           break;
        }
    }  
    res.json({ status: true });
});

app.get('/api/orders/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let cust of customers) {
        if (cust.customerId === customerId) {
            return res.json(cust);
        }
    }
    res.json([]);
});

/************************
 * /api/states
 ************************/
app.get('/api/states', (req, res) => {
    res.json(states);
});

/************************
 * /api/auth
 ************************/
app.post('/api/auth/login', (req, res) => {
    var userLogin = req.body;
    //Add "real" auth here. Simulating it by returning a simple boolean.
    res.json(true);
});

app.post('/api/auth/logout', (req, res) => {
    res.json(true);
});

/************************
 * /api/items
 ************************/
app.get('/api/items/page/:skip/:top', (req, res) => {
    const topVal = req.params.top,
          skipVal = req.params.skip,
          skip = (isNaN(skipVal)) ? 0 : +skipVal;  
    let top = (isNaN(topVal)) ? 10 : skip + (+topVal);

    if (top > items.length) {
        top = skip + (items.length - skip);
    }

    console.log(`Skip: ${skip} Top: ${top}`);

    const pagedItems = items.slice(skip, top);
    res.setHeader('X-InlineCount', items.length);
    res.json(pagedItems);
});

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.get('/api/items/:id', (req, res) => {
    let itemId = +req.params.id;
    let selectedItem = {};
    for (let item of items) {
        if (item.id === itemId) {
           selectedItem = item;
           break;
        }
    }  
    res.json(selectedItem);
});

app.post('/api/items', (req, res) => {
    let postedItem = req.body;
    let maxId = Math.max.apply(Math,items.map((itm) => itm.id));
    postedItem.id = ++maxId;
    items.push(postedItem);
    res.json(postedItem);
});

app.put('/api/items/:id', (req, res) => {
    let putItem = req.body;
    let id = +req.params.id;
    let status = false;

    for (let i=0,len=items.length;i<len;i++) {
        if (items[i].id === id) {
            items[i] = putItem;
            status = true;
            break;
        }
    }
    res.json({ status: status });
});

app.delete('/api/items/:id', function(req, res) {
    let itemId = +req.params.id;
    for (let i=0,len=items.length;i<len;i++) {
        if (items[i].id === itemId) {
           items.splice(i,1);
           break;
        }
    }  
    res.json({ status: true });
});

/************************
 * /api/orders
 ************************/
app.get('/api/orders/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let cust of customers) {
        if (cust.customerId === customerId) {
            return res.json(cust);
        }
    }
    res.json([]);
});

/************************
 * /
 ************************/
// redirect all others to the index (HTML5 history)
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

app.listen(3000);

console.log('Express listening on port 3000.');

//Open browser
var opn = require('opn');

opn('http://localhost:3000').then(() => {
    console.log('Browser closed.');
});