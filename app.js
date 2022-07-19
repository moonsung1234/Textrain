
let express = require("express");
let fs = require("fs");
let app = express();

function get_rank() {
    let rank = JSON.parse(fs.readFileSync("./rank.json"));
    let return_rank = [];

    for(let i in rank) {
        if(rank[i] != null && rank[i] != undefined)
            return_rank.push(rank[i]);
    }

    return return_rank;
}

function add_rank(user_info) {
    let rank = get_rank();
    let index = rank.map((e, i) => e[0]).indexOf(user_info[0]);

    if(index == -1) {
        rank.push(user_info);
    
    } else {
        if(user_info[1] >= rank[index][1]) {
            delete rank[index];

            rank.push(user_info);
        }
    }

    rank = rank.sort((a, b) => b[1] - a[1]);
    index = rank.map((e, i) => e[0]).indexOf(user_info[0]);

    fs.writeFileSync("./rank.json", JSON.stringify(rank));

    return [rank, index];
}

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/main.html");
    // res.sendFile(__dirname + "/rank.html");
});

app.get("/rank/:info", (req, res) => {
    let info = JSON.parse(req.params.info);
    let rank = add_rank([
        info.name,
        Number(info.point)
    ]);

    res.json(rank);
});

app.listen(80, () => {
    console.log("Server run!");
});