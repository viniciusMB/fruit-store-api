const mysql = require('../mysql').pool;

exports.getOrders = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM orders
             LEFT JOIN order_details ON order_id = orderd_id 
             INNER JOIN fruits ON product = product_id;`,
             (error, result, fields) => {
                 if(error) { return res.status(500).send({error: error})}
                 const response = {
                     quantity: result.length,
                     orders: result.map(order => {
                         return {
                             order_id: order.order_id,
                             costumer: order.costumer,
                             product: {
                                 product_id: order.product_id,
                                 name: order.fruit_name,
                                 price: order.price,
                                 quantity: order.quantity
                             },
                             request: {
                                 type: 'GET',
                                 description: 'Returns a specifc order',
                                 url: proces.env.URL_API +'orders/' + order.order_id
                                }
                            }
                        })
 
                    }
                 return res.status(200).send({response});
                }
         )
    })
}

exports.getOrdersById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(`SELECT * FROM orders
          INNER JOIN order_details ON ? = orderd_id 
          INNER JOIN fruits ON product = product_id;`,
             [req.params.order_id],
             (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                if (result.length == 0){
                    return res.status(404).send({
                        message: 'Your order is empty or, no order with this ID was found'
                    })
                }
                
                const response = {
                    
                    order: {
                        order_id: result[0].order_id,
                        product: {
                            product_id: result[0].product_id,
                            name: result[0].fruit_name,
                            price: result[0].price,
                            quantity: result[0].quantity
                        },
                        request: {
                            type: 'GET',
                            description: 'Returns all orders',
                            url: proces.env.URL_API +'orders'
                        }

                    }
                }

                return res.status(200).send(response);
            }
         )
    })
};

exports.postOrder = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM costumers WHERE costumer_id = ?', 
        [req.costumer.costumer_id], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error: error}) }
            if (result.length == 0){
                return res.status(404).send({
                    message: 'Costumer not found'
                })
            }
            conn.query(
                'INSERT INTO orders (costumer) VALUES (?)',
                [req.costumer.costumer_id],
                (error, result, field) => {
                    conn.release();
                    if (error) { return res.status(500).send({ error: error}) }
                    const response = {
                        message: 'Order posted sucessfully',
                        newOrder: {
                            order_id: result.order_id,
                            costumer: req.body.costumer,
                            request: {
                                type: 'GET',
                                description: 'Returns all orders',
                                url: proces.env.URL_API +'orders'
                            }
    
                        }
                    }
    
                    return res.status(201).send(response);
                }
            )
        });
    })
};

exports.deleteOrder = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            "DELETE FROM orders WHERE order_id = ?", [req.params.order_id],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                const response = {
                    message: 'Order removed sucessfully',
                    request: {
                        type: 'POST',
                        descricao: 'Post an order',
                        url: proces.env.URL_API +'orders',
                        body: {
                            costumer: 'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }
        )
    });
};