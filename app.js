const http = require('http');
const fs = require('fs');
const path = require('path');
//const mysql = require('mysql');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

//MYSQL------------------
/*var mysqlCon = mysql.createConnection({
    host: "localhost",
    user: "bruh",
    password: "securePassword"
});

mysqlCon.connect(function(error) {
    if(error) throw error;
    console.log("Connect to mysql");
})*/

//HTML/JS/CSS fetch--------
const server = http.createServer((req, res) => {
    console.log("request made: " + req.url);
    if(req.url === "/") {
        fs.readFile('./Client/index.html', null, function (error, data) {
            if (error) {
                res.writeHead(404);
                res.write('File not found');
            } else {
                res.writeHead(200, {'Content-type': 'text/html'});
                res.write(data);
            }
            res.end();
        });
    } else if (req.url.match("\.css$")) {
        var cssPath = path.join('./Client', req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-type": "text/css"});
        fileStream.pipe(res);
    } else if (req.url.match("\.js$")) {
        var jsPath = path.join('./Client', req.url);
        var fileStream = fs.createReadStream(jsPath, "UTF-8");
        res.writeHead(200, {"Content-type": "text/js"});
        fileStream.pipe(res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})