const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.login = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({error: error}) }
        const query = `SELECT * FROM costumers WHERE email=?`; 
        conn.query(query,[req.body.email],(error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({menssage: 'Autentication error'})
            }
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {
                    return res.status(401).send({menssage: 'Authentication error'})
                }
                if (result) {
                    const token = jwt.sign({
                        costumer_id: results[0].costumer_id,
                        email: results[0].email,
                        name: results[0].name

                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    });
                    
                    return res.status(200).send({
                        message: 'You are logged in', 
                        token: token
                    });
                }
                return res.status(401).send({menssage: 'Authentication error'})
            })

        })
    })
}
