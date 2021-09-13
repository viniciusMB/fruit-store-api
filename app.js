const express = require('express');
const app = express();
const morgan = require('morgan');


const routeProducts = require('./routes/produtcs');
const routeOrders = require('./routes/orders');
const routeCustomers = require('./routes/customers');
const routeOrdersDetails = require('./routes/orders-details');
const routeAuthentication = require('./routes/authentication');

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res,next) => {
    res.header('Access-Control-Alow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, Content-Type, X-Requested-With, Accept, Authorization'
    );

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-methods', 'PUT', 'POST', 'DELETE', 'PATCH', 'GET');
        return res.status(200).send({});
    }

    next();
})

app.use('/products', routeProducts);
app.use('/orders', routeOrders);
app.use('/customers', routeCustomers);
app.use('/orderdetails', routeOrdersDetails);
app.use('/login', routeAuthentication);

module.exports = app;