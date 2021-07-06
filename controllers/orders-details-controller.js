const mysql = require('../mysql').pool;

exports.postOrderDetails = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM orders WHERE order_id = ?', 
        [req.body.order_id], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error: error}) }
            if (result.length == 0){
                return res.status(404).send({
                    message: 'Order not found'
                })
            }
            conn.query(
                'INSERT INTO order_details (product, orderd_id, quantity) VALUES (?,?,?)',
                [req.body.product_id, req.body.order_id, req.body.quantity],
                (error, result, field) => {
                    conn.release();
                    if (error) { return res.status(500).send({ error: error}) }
                    const response = {
                        message: 'Order details posted sucessfully',
                        newProduct: {
                            product_id: req.body.product_id,
                            orderd_id: req.body.orderd_id,
                            quantity: req.body.quantity,
                            request: {
                                type: 'PATCH',
                                description: 'Updates an order details',
                                url: 'http://localhost:3000/ordersdetails'
                            }
    
                        }
                    }
    
                    return res.status(201).send(response);
                }
            )
        });
    })
};

exports.updateOrderDetails = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM orders WHERE order_id = ?', 
        [req.body.order_id], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error: error}) }
            if (result.length == 0){
                return res.status(404).send({
                    message: 'Order not found'
                })
            }
            conn.query(
                `UPDATE order_details SET product = ?, quantity = ? WHERE orderd_id = ?`,
                [req.body.product_id, req.body.quantity, req.body.order_id],
                (error, result, field) => {
                    conn.release();
                    if (error) { return res.status(500).send({ error: error}) }
                    const response = {
                        message: 'Order details updated sucessfully',
                        detalhesAtualizados: {
                            product: req.body.product,
                            orderd_id: req.body.orderd_id,
                            quantity: req.body.quantity,
                            request: {
                                type: 'POST',
                                description: 'Posts an order details',
                                url: 'http://localhost:3000/orderdetails' + req.body.orderd_id
                            }

                        }
                    }
    
                    return res.status(201).send(response);
                }
            )
        })    
        
    })
};