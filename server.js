const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer();

server.on("request", (req, res)=>{
    
    readable = fs.createReadStream(path.join(__dirname, "./file.txt"));
    readable.setEncoding("utf8");
    
    readable.on("error", (err)=>{
        console.error(err);
        res.end();
    });
    readable.on("end", ()=>{
        res.end();
    });
    
    readable.pipe(res);

});

if(process.env.PORT == undefined) {
    process.env.PORT = 3000;
}

server.listen(process.env.PORT, (err) => {
    
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening on port: ${process.env.PORT}`);

});