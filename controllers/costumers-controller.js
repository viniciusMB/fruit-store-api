const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");


exports.getCostumers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM costumers`,
             (error, result, fields) => {
                 if(error) { return res.status(500).send({error: error})}
                 const response = {
                     totalCostumers: result.length,
                     costumers: result.map(costumer => {
                         return {
                             costumer_id: costumer.costumer_id,
                             name: costumer.name,
                             cpf: costumer.cpf,
                             phone: costumer.phone,
                             order_id: costumer.order_id,
                             request: {
                                 tipo: 'GET',
                                 description: 'Returns a specifc costumer',
                                 url: proces.env.URL_API +'costumers/' + costumer.costumer_id
                                }
                            }
                        })
 
                    }
                 return res.status(200).send({response});
                }
            )
    })
};

exports.getCostumerById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM costumers WHERE costumer_id = ?`,
             [req.costumer.costumer_id],
             (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                
                if (result.length == 0){
                    return res.status(404).send({
                        message: 'Costumer Id not found'
                    })
                }                
                const response = {
                    
                    costumers: {
                        costumer_id: result[0].costumer_id,
                        name: result[0].name,
                        cpf: result[0].cpf,
                        request: {
                            type: 'GET',
                            description: 'Returns this costumer details',
                            url: proces.env.URL_API +'costumers/details/' + result[0].costumer_id
                        }

                    }
                }

                return res.status(200).send(response);
            }
         )
    })
};

exports.postCostumer = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM costumers WHERE email = ?', [req.body.email],(error, results) => {
            if (error) { return res.status(500).send({ error: error}) }
            if (results.length > 0){
                return res.status(409).send({message: 'Costumer already exists' })
            }
            if (validator.validate(req.body.email)) {
                return res.status(409).send({ message: 'Invalid email'})
            }
            else{
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({error: errBcrypt})}
                    conn.query(
                        'INSERT INTO costumers (name, cpf, phone, email, password) VALUES (?,?,?,?,?)',
                        [req.body.name, req.body.cpf, req.body.phone, req.body.email, hash],
                        (error, result, field) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error}) }
                            const response = {
                                message: 'Costumer added sucessfully',
                                clienteNovo: {
                                    costumer_id: result.costumer_id,
                                    name: req.body.name,
                                    cpf: req.body.cpf,
                                    phone: req.body.phone,
                                    request: {
                                        type: 'GET',
                                        description: 'Returns a specific costumer',
                                        url: proces.env.URL_API +'costumers/' + result.costumer_id
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


exports.updateCostumer = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE costumers SET name = ?, cpf = ?, phone = ? WHERE costumer_id = ?`,
            [req.body.name, req.body.cpf, req.body.phone, req.costumer.costumer_id],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    message: 'Costumer updated sucessfully',
                    ProductUpdated: {
                        costumer_id: req.body.costumer_id,
                        name: req.body.name,
                        cpf: req.body.cpf,
                        phone: req.body.phone,
                        request: {
                            type: 'GET',
                            description: 'Returns a specific costumer',
                            url: proces.env.URL_API +'costumers' + req.body.costumer_id
                        }

                    }
                }

                return res.status(202).send({response});
            }
        )
    });
};

exports.deleteCostumer = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            "DELETE FROM costumers WHERE costumer_id = ?", [req.params.costumer_id],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                const response = {
                    message: 'Costumer removed sucessfully',
                    request: {
                        type: 'POST',
                        description: 'Post a costumer',
                        url: proces.env.URL_API +'costumers',
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

exports.getCostumerDetails = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM costumers 
         INNER JOIN orders ON ? = costumer 
         INNER JOIN order_details ON order_id = orderd_id 
         INNER JOIN fruits ON product = product_id WHERE 1=1 AND costumer_id = ?;`, 
         [req.costumer.costumer_id, req.costumer.costumer_id],
             (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }                
                if (result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Costumer details not found'
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
                var costumerobj = new Object;

                const response = {
                    
                    costumer: {
                        costumer_id: result[0].costumer_id,
                        name: result[0].name,
                        cpf: result[0].cpf,
                        phone: result[0].phone,
                        orders: result.map(costumer => {
                            
                            costumerobj = orderMap.get(costumer.detailsId);
                            return {
                                orderID:costumerobj.orderID,
                                productName: costumerobj.productName,
                                quantity: costumerobj.quantity,
                                price: costumerobj.price,
                                totalPrice: costumerobj.price * costumerobj.quantity,

                                request: {
                                    tipo: 'GET',
                                    descriçao: 'Returns all costumers',
                                    url: proces.env.URL_API +'costumers'
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