// var app = require('../app');
var http = require('http');
const fs = require('fs');
var os = require("os");
const url = require("url")
const { parse } = require('querystring');

/**
 * Create HTTP server.
 */

let port  = process.env.PORT || '3030';
let filebasepath = "public"
let datafile={}
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
                res.end(JSON.stringify({success:false,status:false,message:"file already exist"}))
            }
            else{
                fs.writeFileSync(filepath,word,(err)=>{
                    if (err) throw new Error("error writing file "+err)
                })
                res.end(JSON.stringify({success:true,status:false,message:"note successfully created!!"}))
            }
            
            
        });
    }
    else if(req.method=="GET"){
        // console.log("get request made")
        fs.readdir(filebasepath,function(err, files) {
            if (err) {
                res.end (JSON.stringify({success:false,status:false,message:"no such directory"}))
            } 
            else {
                if (!files.length) {
                    res.end(JSON.stringify({success:true,status:false,message:"folder is empty"}))
                }
                else{
                    let totalfiles = files
                let counter=0;

                    for (let i=0;i<totalfiles.length;i++){
                        let data= fs.readFileSync(filebasepath+"/"+totalfiles[i], {encoding:'utf8', flag:'r'})
                        counter++;
                        datafile[`${totalfiles[i].substring(0,totalfiles[i].length - 4)}`] = data
                    }
                
                    // console.log(datafile)
                    res.end(JSON.stringify({status:true,count:counter,data:datafile}))
                }
                }
            })
    }
    else if(req.method == "DELETE"){
        var queryData = url.parse(req.url, true).query;
        if(queryData.nameid){
            console.log("delete operation",queryData.nameid)
            fs.readdir(filebasepath,function(err, files) {
                if (err) {
                    res.end (JSON.stringify({success:false,status:false,message:"no such directory"}))
                } else {
                    if (!files.length) {
                        res.end(JSON.stringify({success:true,status:false,message:"folder is empty"}))
                    }
                    else{
                        let filepath = filebasepath+"/"+queryData.nameid+".txt"
                        console.log(filepath)
                        fs.unlink(filepath,err=>{
                            if (err) throw new Error("error deleting file")

                        });
                        res.end(JSON.stringify({success:true,message:"file has been successfully deleted!!"}))
                    }
                 }
             })
        }
        else{
            res.end(JSON.stringify({success:false,status:false,message:"parameter is missing"}))
        }
    }
    else if (req.method =="PUT"){
        var queryData = url.parse(req.url, true).query;
        if(queryData.nameid && queryData.word){
            console.log("put request made")
            
            let filepath = filebasepath+"/"+queryData.nameid+".txt"
            // console.log(filepath)
            if(fs.existsSync(filepath)){
                fs.appendFileSync(filepath,queryData.word,(err)=>{
                    if (err) throw new Error("error appending to file "+err)
                    
                })
                res.end(JSON.stringify({success:true,message:"update successful"}))
            }else{
                res.end(JSON.stringify({success:false,status:false,message:"file does not exist"}))

            }
                
        }
        else{
            res.end(JSON.stringify({success:false,status:false,message:"parameters are missing"}))
        }

    }
    
  }).listen(port, () => console.log("Server running at port "+port));
