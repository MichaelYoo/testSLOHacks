"use strict";

let express = require('express'),
    app = express(),
    path = require('path'),
    pg = require('pg');


// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')));
app.get('/subscribe', (req, res) => subscribeForm(req, res));

//Static Routes;
app.use(express.static('public'));
app.use('/static', express.static('app/static'));
app.use('/dist', express.static('app/dist'));

// Begin Listening
let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port' + port));


function subscribeForm(request, response) {
    let requestData = {
        name: request.query.name,
        email: request.query.email,
        query: request.query,
        fresh: request.fresh,
        ip: request.ip,
        forwardedIP: request.ips,
        headers: request.headers
    };
    if (validateEmail(requestData.email)) {
        pg.defaults.ssl = true;
        let DATABASE_URL = "postgres://bmhnmoxxlsymfi:07b1de28222829e961e3427c87fc73a0bc4cbc47f81238a29230a9413533944d@ec2-174-129-224-33.compute-1.amazonaws.com:5432/dasivabuerkae9";
        pg.connect(process.env.DATABASE_URL || DATABASE_URL, function(err, client, done) {
            // TODO: Check for duplicate email address
            client.query(
                `INSERT INTO subscribers (name, email, query, fresh, ip, forwarded_ip, headers)
                 
                 VALUES ('${requestData.name}', '${requestData.email}', '${JSON.stringify(requestData.query)}', '${requestData.fresh}', '${requestData.ip}', '{${requestData.forwardedIP}}', '${JSON.stringify(requestData.headers)}') RETURNING *;`,
            function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    response.json({
                        error: 1,
                        message: 'Internal Error. Could not add you to our mailing list.'
                    })
                }
                else {
                    console.log(result);
                    response.json({
                        error: 0,
                        message: 'You have subscribed to the SLO Hacks newsletter!'
                    })
                }
            });
        });

    }
    else {
        console.log("INVALID EMAIL!");
        response.json({
            error: 2,
            message: 'This is an invalid email address!'
        })
    }
}


function validateEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}