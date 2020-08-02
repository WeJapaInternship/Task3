// var app = require('../app');
var http = require('http');
const fs = require('fs');
var os = require("os");
const { parse } = require('querystring');

/**
 * Create HTTP server.
 */
let filebasepath = "public"
http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });

        req.on('end', () => {
            let filename = parse(body).name;
            let word = parse(body).word +os.EOL;
            // let buffer = new Buffer(word);
            let filepath = filebasepath+"/"+filename+".txt"
            console.log(filepath,word)
            if(fs.existsSync(filepath)){
                fs.appendFileSync(filepath,word,(err)=>{
                    if (err) throw new Error("error writing file "+err)
                })
            }
            else{
                fs.writeFileSync(filepath,word,(err)=>{
                    if (err) throw new Error("error writing file "+err)
                })
            }
            
            res.end(`successful!!`);
        });
    }
    
  }).listen(3030);
