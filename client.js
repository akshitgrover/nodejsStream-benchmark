const http = require("http");

let stats = {
    [Symbol.iterator]() {
        let curProp = -1;
        return {
            next() {
                if(++curProp >= Object.keys(stats["data"]).length) {
                    return {value: undefined, done: true};
                }
                delete stats["data"][curProp]["interval"];
                return {value: stats["data"][curProp], done: false};
            }
        }
    },
    "data": {}
};

let avgConcurrentWrites = 0;
let totalConcurrentSets = 0;
let concurrentWrites = 0;
let counter = 0;

let writeInterval = setInterval(() => {
    
    if(concurrentWrites === 0) {
        return;
    }
    avgConcurrentWrites = (totalConcurrentSets * avgConcurrentWrites + concurrentWrites) / (totalConcurrentSets + 1);
    concurrentWrites = 0;
    totalConcurrentSets++;

}, 10);

let startInterval = (idx) => {
    
    stats["data"][idx] = {"interval":null, "time": 0, "bytes": 0};
    stats["data"][idx]["interval"] = setInterval(()=>{
        stats["data"][idx]["time"]++;
    }, 1);

}

let cb = () => {

    if(++counter == 1024) {
        clearTimeout(writeInterval);
        for(prop of stats) {
            console.log(prop);
        }
    }

};

for(let i = 0; i < 1024; i++) {
    
    let clientRequest = http.request("http://localhost:3000");
    
    clientRequest.on("response", (res) => {

        res.on("end", () => {
            clearInterval(stats["data"][i]["interval"]);
            cb();
        });
        res.on("data", (chunk) => {
            concurrentWrites++;
            stats["data"][i]["bytes"] += chunk.length;
        });

    });

    clientRequest.end();
    startInterval(i);

}

