var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var axios = require('axios');
var NodeCache = require( "node-cache" );
var cache = new NodeCache({stdTTL: 60})

var profileSchema = {
    "type": "object", "properties": {
        "img": {"type": "string"}
    }, "required": ["img"]
};
var leadSchema = {
    "type": "object", "properties": {
        "name": {"type": "string"},
        "email": {"type": "string"},
        "cellphone": {"type": "string"},
        "groupID": {"type": "bigint"},
        "clientID": {"type": "string", "minLength": 36, "maxLength": 36},
        "source": {"type": "string"},
        "unitID": {"type": "string"}
    }, "required": ["name","email","unitID"]
};
var signSchema = {
    "type": "object", "properties": {
        "img": {"type": "string"},
        "token": {"type": "string"}
    }, "required": ["img","token"]
};
var npsSchema = {
    "type": "object", "properties": {
        "score": {"type": "bigint", "minimum": 1, "maximum": 10},
        "text": {"type": "string", "maxLength": 256},
        "member_id": {"type": "bigint"},
        "client_id": {"type": "string", "minLength": 36, "maxLength": 36},
        "timestamp": {"type": "bigint"}
    }, "required": ["score","client_id","member_id", "timestamp"]
};
var loginSchema = {
    "type": "object", "properties": {
        "email": {"type": "string"},
        "passWD": {"type": "string"}
    }, "required": ["email","passWD"]
};

var releaseSchema = {
    "type": "object", "properties": {
        "email": {"type": "string"},
        "passWD": {"type": "string"},
        "token": {"type": "string"},
        "date": {"type": "bigint"},
        "time": {"type": "bigint"}
    }, "required": ["email","passWD","token","date","time"]
};

var bookClassSchema = {
    "type": "object", "properties": {
        "email": {"type": "string"},
        "passWD": {"type": "string"},
        "date": {"type": "bigint"},
        "classId": {"type": "bigint"},
        "position": {"type": "bigint"}
    }, "required": ["email","passWD","date","classId","position"]
};

var cancelClassSchema = {
    "type": "object", "properties": {
        "attendanceId": {"type": "bigint"}
    }, "required": ["attendanceId"]
};

var profileImgSchema = {
    "type": "object", "properties": {
        "img": {"type": "string"},
        "member_id": {"type": "bigint"},
        "type": {"type": "string"}
    }, "required": ["img", "member_id"]
};

function getCurrentTimestamp () {
    return Date.now()
}

exports.saveTrack = function(req, res){
    let obj = {};
    const path = `./track/${req.query.action_id}.json`;

    if (!fs.existsSync('./track')) {
        fs.mkdirSync('./track');
    }
    obj.id = req.query.id;
    obj.date = getCurrentTimestamp();
    if(cache.has(req.query.id)){
        return;
    }
    cache.set(req.query.id, "");
    if (!fs.existsSync(path)) {
        fs.writeFile(path, JSON.stringify(obj), 'utf8', function (err) {
            if (err){
                console.log(err);
            }
            res.status(200).send();
        });
    }else{
        fs.appendFile(path, `,${JSON.stringify(obj)}`, 'utf8', function (err) {
            if (err){
                console.log(err);
            }
            res.status(200).send();
        });
    }
}

exports.saveSelfProfileImg = function(req, res){
    let result = v.validate(req.body, profileSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    
    const path = `./public/profile_images/${req.body.group_id}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    newImg = req.body.img.replace("data:image/png;base64,", "");
    if(req.body.auth_type == "staff"){
        pathFull = `${path}/s${req.body.member_id}.png`
    }else{
        pathFull = `${path}/${req.body.member_id}.png`
    }

    fs.writeFile(pathFull, newImg, 'base64', function (err) {
        if (err){
            res.status(500).send(err);
        }else{
            res.status(200).send();
        }
    });
}

exports.saveProspect = function(req, res){
    let result = v.validate(req.body, leadSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    authToken = "Basic " + Buffer.from(`${req.body.clientID}:`).toString('base64');
    axios.post(`${process.env.API_CLOUDGYM_ENDPOINT}/internal/prospect`, {
        name: req.body.name,
        email: req.body.email,
        cellphonenumber: req.body.cellphone,
        groupid: req.body.groupID,
        clientid: req.body.clientID,
        source: req.body.source,
        unit: req.body.unitID
    },{
        headers: {
            Authorization: authToken
        }
    }).then(function (response) {
        res.status(200).send();
    }).catch(function (error) {
        res.status(500).send(error);
    });
}

exports.saveSign = function(req, res){
    let result = v.validate(req.body, signSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }

    const buff = Buffer.from(req.body.token, 'base64');
    const str = buff.toString('utf-8');

    let tokenData = str.split(":");
    let group_id = tokenData[0];
    let contract_id = tokenData[1];
    let client_id = tokenData[2];

    const path = `./signs/customer/${group_id}`;
    if(!fs.existsSync(`./signs/presign/${contract_id}.pre`)){
        res.status(401).send();
        return;
    }
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    newImg = req.body.img.replace("data:image/png;base64,", "");
    fs.writeFile(`${path}/${contract_id}.png`, newImg, 'base64', function (err) {
        if (err){
            res.status(500).send(err);
        }else{
            res.status(200).send();
            fs.unlink(`./signs/presign/${contract_id}.pre`, (err) => {
                if (err) throw err;
            });
            authToken = "Basic " + Buffer.from(`${client_id}:`).toString('base64');
            axios.post(`${process.env.API_CLOUDGYM_ENDPOINT}/internal/contract/tagassigned/${contract_id}`, {}, {
                headers: {
                    Authorization: authToken
                }
            }).then(function (response) {
            }).catch(function (err) {
                if (!fs.existsSync("./signs_error")) {
                    fs.mkdirSync("./signs_error");
                }
                console.log(err);
                //Gravar os erros em um diretório de erro para depois tentar a correção
            });
        }
    });
}

exports.saveProfileImg = function(req, res){
    let result = v.validate(req.body, profileImgSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    
    const path = './profile_images/' + req.body.group_id;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    newImg = req.body.img.replace("data:image/png;base64,", "");
    if(req.body.type == "staff"){
        pathFull = path + '/s' + req.body.member_id + '.png'
    }else{
        pathFull = path + '/' + req.body.member_id + '.png'
    }

    fs.writeFile(pathFull, newImg, 'base64', function (err) {
        if (err){
            res.status(500).send();
        }else{
            res.status(200).send();
        }
    });
}

exports.getProfileImg = function(req, res){
    let path = './profile_images/' + req.body.group_id + '/' + req.params.member_id + ".png";
    if (!fs.existsSync(path)) {
        res.status(404).send();
        return;
    }
    response = "data:image/png;base64," + Buffer.from(fs.readFileSync(path).toString('base64'));
    res.status(200).send(response);
}

exports.unsubscribe = function(req, res){
    const path = `./unsubscribe/${req.params.token}`;
    fs.writeFile(path, "", function (err) {
        if (err) throw err;
    });
    res.redirect("../../unsubscribe.html");
}

exports.listFiles = function(req, res){
    const path = "./unsubscribe/";
    if (!fs.existsSync(path)) {
        res.status(200).send(JSON.parse("[]"));
        return;
    }
    fs.readdir(path, function (err, files) {
        let response = "";
        auxComma = "";
        files.forEach(function (file) {
            const fileName = path + file;
            response += auxComma;
            response += file;
            auxComma = ";";

            fs.unlink(fileName, (err) => {
                if (err) throw err;
            });
        });
        res.status(200).send(response);
    });
}

exports.saveNps = function(req, res){
    let result = v.validate(req.body, npsSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }

    let dirpath = `./nps_scores/${req.body.client_id}_${req.body.member_id}.nps`;
    if (fs.existsSync(dirpath)) {
        res.status(409).send();
        return;
    }else if(!fs.existsSync("./nps_scores/")){
        fs.mkdirSync("./nps_scores/");
    }
    fs.writeFile(dirpath, JSON.stringify(req.body), function (err) {
        if (err) throw err;
    });
    res.status(200).send();
}

exports.getScores = function(req, res){
    const path = require('path');
    const dirpath = './nps_scores/';

    if (!fs.existsSync(dirpath)) {
        res.status(200).send(JSON.parse("[]"));
        return;
    }
    
    fs.readdir(dirpath, function (err, files) {
        const targetFiles = files.filter(file => {
            return path.extname(file).toLowerCase() === '.nps';
        });
        let response = "[";
        auxComma = "";
        targetFiles.forEach(function (file) {
            const fileName = dirpath + file;
            response += auxComma;
            response += fs.readFileSync(fileName, {encoding: 'utf-8'});
            auxComma = ",";

            fs.unlink(fileName, (err) => {
                if (err) throw err;
            });
        });
        response += "]";
        res.status(200).send(response);
    });
}

exports.login = function(req, res){
    let result = v.validate(req.body, loginSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    axios.post(`${process.env.APP_CLOUDGYM_ENDPOINT}/cloudgym/rest/member/loginAPP/${req.body.email}/${req.body.passWD}`)
    .then(resLogin => {
        res.status(200).send(resLogin.data);
    })
    .catch(err => {
        res.status(409).send(err.message);
    });
}

exports.releaseTurnStile = function(req, res){
    let result = v.validate(req.body, releaseSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    axios.post(`${process.env.APP_CLOUDGYM_ENDPOINT}/cloudgym/rest/member/releaseaccesstemp/${req.body.token}/${req.body.email}/${req.body.passWD}/${req.body.date}/${req.body.time}`)
    .then(resLogin => {
        res.status(200).send(resLogin.data.toString());
    })
    .catch(err => {
        res.status(409).send(err.message);
    });
}

exports.bookClass = function(req, res){
    let result = v.validate(req.body, bookClassSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    axios.post(`${process.env.APP_CLOUDGYM_ENDPOINT}/cloudgym/rest/workout/bookclass/${req.body.email}/${req.body.passWD}/${req.body.date}/${req.body.classId}/${req.body.position}`)
    .then(resLogin => {
        res.status(200).send(resLogin.data.toString());
    })
    .catch(err => {
        res.status(409).send(err.message);
    });
}

exports.cancelClass = function(req, res){
    let result = v.validate(req.body, cancelClassSchema);
    if(!result.valid){
        res.status(400).send();
        return;
    }
    axios.post(`${process.env.APP_CLOUDGYM_ENDPOINT}/cloudgym/rest/workout/removeclassattendence/${req.body.attendanceId}`)
    .then(resLogin => {
        res.status(200).send(resLogin.data.toString());
    })
    .catch(err => {
        res.status(409).send(err.message);
    });
}

// var timelineSchema = {
//     "type": "object", "properties": {
//         "group_id": {"type": "bigint"},
//         "unit_id": {"type": "string"},
//         "member_id": {"type": "bigint"},
//         "member_name": {"type": "string"},
//         "description": {"type": "string"},
//         "img": {"type": "string"}
//     }, "required": ["group_id","unit_id","member_id","member_name"]
// };

// exports.savePost = function(req, res){
//     let result = v.validate(req.body, timelineSchema);
//     if(!result.valid){
//         res.status(400).send();
//         return;
//     }

//     description = req.body.description.replace('"','\"');
//     description = description.replace('<','&lt;');
//     description = description.replace('>','&gt;');
//     description = '"description":"' + description + '"';

//     const path = './timeline/' + req.body.group_id + "/" + req.body.unit_id;
//     if (!fs.existsSync(path)) {
//         fs.mkdirSync(path, { recursive: true });
//     }

//     sequence = 1;
//     let sequenceFile = path + '/sequence';
//     if (!fs.existsSync(sequenceFile)) {
//         fs.mkdirSync(sequenceFile);
//     }

//     fs.readdir(sequenceFile, function(err, files) {
//         if (files.length) {
//             // directory appears to be populated
//             sequence = files.length;
//             sequence++;
//         }
//         sequenceFile = sequenceFile + "/" + sequence;

//         let file = path + "/" + sequence + "_" + id + ".json"

//         fs.writeFile(sequenceFile, sequence, function (err) {
//             if (err){
//                 res.status(500).send(err);
//             }else{
//                 res.status(200).send();
//             }
//         });
//     });
// }