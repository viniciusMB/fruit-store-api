const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");


exports.getCustomers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM customers`,
             (error, result, fields) => {
                 if(error) { return res.status(500).send({error: error})}
                 const response = {
                     totalCustomers: result.length,
                     customers: result.map(customer => {
                         return {
                             customer_id: customer.customer_id,
                             name: customer.name,
                             cpf: customer.cpf,
                             phone: customer.phone,
                             order_id: customer.order_id,
                             request: {
                                 tipo: 'GET',
                                 description: 'Returns a specifc customer',
                                 url: process.env.URL_API +'customers/' + customer.customer_id
                                }
                            }
                        })
 
                    }
                 return res.status(200).send({response});
                }
            )
    })
};

exports.getCustomerById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM customers WHERE customer_id = ?`,
             [req.customer.customer_id],
             (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                
                if (result.length == 0){
                    return res.status(404).send({
                        message: 'Customer Id not found'
                    })
                }                
                const response = {
                    
                    customers: {
                        customer_id: result[0].customer_id,
                        name: result[0].name,
                        cpf: result[0].cpf,
                        request: {
                            type: 'GET',
                            description: 'Returns this customer details',
                            url: process.env.URL_API +'customers/details/' + result[0].customer_id
                        }

                    }
                }

                return res.status(200).send(response);
            }
         )
    })
};

exports.postCustomer = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM customers WHERE email = ?', [req.body.email],(error, results) => {
            if (error) { return res.status(500).send({ error: error}) }
            if (results.length > 0){
                return res.status(409).send({message: 'Customer already exists' })
            }
            if (validator.validate(req.body.email)) {
                return res.status(409).send({ message: 'Invalid email'})
            }
            else{
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({error: errBcrypt})}
                    conn.query(
                        'INSERT INTO customers (name, cpf, phone, email, password) VALUES (?,?,?,?,?)',
                        [req.body.name, req.body.cpf, req.body.phone, req.body.email, hash],
                        (error, result, field) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error}) }
                            const response = {
                                message: 'Customer added sucessfully',
                                clienteNovo: {
                                    customer_id: result.customer_id,
                                    name: req.body.name,
                                    cpf: req.body.cpf,
                                    phone: req.body.phone,
                                    request: {
                                        type: 'GET',
                                        description: 'Returns a specific customer',
                                        url: process.env.URL_API +'customers/' + result.customer_id
                                    }
            
                                }
                            }
            
                            return res.status(201).send(response);
                        }
                    )
                })
            }
        })
        
    });

};


exports.updateCustomer = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE customers SET name = ?, cpf = ?, phone = ? WHERE customer_id = ?`,
            [req.body.name, req.body.cpf, req.body.phone, req.customer.customer_id],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    message: 'Customer updated sucessfully',
                    ProductUpdated: {
                        customer_id: req.body.customer_id,
                        name: req.body.name,
                        cpf: req.body.cpf,
                        phone: req.body.phone,
                        request: {
                            type: 'GET',
                            description: 'Returns a specific customer',
                            url: process.env.URL_API +'customers' + req.body.customer_id
                        }

                    }
                }

                return res.status(202).send({response});
            }
        )
    });
};

exports.deleteCustomer = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            "DELETE FROM customers WHERE customer_id = ?", [req.params.customer_id],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                const response = {
                    message: 'Customer removed sucessfully',
                    request: {
                        type: 'POST',
                        description: 'Post a customer',
                        url: process.env.URL_API +'customers',
                        body: {
                            name: 'String',
                            cpf: 'Number',
                            phone: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
};

exports.getCustomerDetails = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM customers 
         INNER JOIN orders ON ? = customer 
         INNER JOIN order_details ON order_id = orderd_id 
         INNER JOIN fruits ON product = product_id WHERE 1=1 AND customer_id = ?;`, 
         [req.customer.customer_id, req.customer.customer_id],
             (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }                
                if (result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Customer details not found'
                    })
                }
                var orderMap = new Map;
                for (i=0; i < result.length; i++){
                                        
                    orderMap.set(result[i].detailsId, {
                        orderID: result[i].order_id,
                        productName: result[i].fruit_name,
                        quantity: result[i].quantity,
                        price: result[i].price
                    });
                }
                var customerobj = new Object;

                const response = {
                    
                    customer: {
                        customer_id: result[0].customer_id,
                        name: result[0].name,
                        cpf: result[0].cpf,
                        phone: result[0].phone,
                        orders: result.map(customer => {
                            
                            customerobj = orderMap.get(customer.detailsId);
                            return {
                                orderID:customerobj.orderID,
                                productName: customerobj.productName,
                                quantity: customerobj.quantity,
                                price: customerobj.price,
                                totalPrice: customerobj.price * customerobj.quantity,

                                request: {
                                    tipo: 'GET',
                                    descriçao: 'Returns all customers',
                                    url: process.env.URL_API +'customers'
                                }
                            }
                            
                        })                        

                    }
                }

                return res.status(200).send(response);
            }
         )
    })
};