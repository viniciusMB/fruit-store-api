const mysql = require('../mysql').pool;

exports.getProducts = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(
             'SELECT * FROM fruits;',
             (error, result, fields) => {
                 if(error) { return res.status(500).send({error: error})}
                 const response = {
                     quantity: result.length,
                     products: result.map(prod => {
                         return {
                             product_id: prod.product_id,
                             name: prod.fruit_name,
                             price: prod.price,
                             request: {
                                 type: 'GET',
                                 description: 'Returns a specifc product',
                                 url: proces.env.URL_API +'products/' + prod.product_id
                             }
                         }
                     })
 
                 }
                 return res.status(200).send({response});
             }
         )
    })
};

exports.getProductsById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
         conn.query(
             'SELECT * FROM fruits WHERE product_id = ?;',
             [req.params.product_id],
             (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                
                if (result.length == 0){
                    return res.status(404).send({
                        mensagem: 'No product with this ID was found'
                    })
                }
                
                const response = {
                    
                    product: {
                        product_id: result[0].product_id,
                        fruit_name: result[0].fruit_name,
                        preco: result[0].price,
                        request: {
                            type: 'GET',
                            description: 'Returns all products',
                            url: proces.env.URL_API +'products'
                        }

                    }
                }

                return res.status(200).send(response);
            }
         )
    })
};

exports.postProduct = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO fruits (fruit_name, price) VALUES (?,?)',
            [req.body.fruit_name, req.body.price],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Product posted sucessfully',
                    frutaNova: {
                        product_id: result.product_id,
                        fruit_name: req.body.fruit_name,
                        preco: req.body.price,
                        request: {
                            type: 'GET',
                            description: 'Returns a specifc product',
                            url: proces.env.URL_API +'products/' + result.product_id
                        }

                    }
                }

                return res.status(201).send(response);
            }
        )
    });

};

exports.updateProduct = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            `UPDATE fruits SET fruit_name = ?, price = ? WHERE product_id = ?`,
            [req.body.fruit_name, req.body.price, req.body.product_id],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Product updated sucessfully',
                    frutaAtualizada: {
                        product_id: req.body.product_id,
                        fruit_name: req.body.fruit_name,
                        preco: req.body.price,
                        request: {
                            type: 'GET',
                            description: 'Returns a specifc product',
                            url: proces.env.URL_API +'products' + req.body.product_id
                        }

                    }
                }

                return res.status(202).send({response});
            }
        )
    });
};

exports.deleteProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error})}
        conn.query(
            "DELETE FROM fruits WHERE product_id = ?", [req.params.product_id],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Product removed sucessfully',
                    request: {
                        type: 'POST',
                        descricao: 'Post a product',
                        url: proces.env.URL_API +'products',
                        body: {
                            fruit_name: 'String',
                            price: 'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }
        )
    });
};