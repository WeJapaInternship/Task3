var http = require('http');
const { parse } = require('querystring');

/**
 * Create HTTP server.
 */

const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;

const server = http.createServer(function (req,res){
    res.statusCode=200
    res.setHeader('Content-Type','application/json')
    let body={}
    body['statusCode'] = res.statusCode;
    body['Content-Type'] =res.getHeader('Content-Type');
    body['success'] = true
    // console.log(body)
    res.end(JSON.stringify(body));
})

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`)
})