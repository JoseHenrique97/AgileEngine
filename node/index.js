const fs = require("fs");
const https = require('https');
var express = require('express');
var cors = require('cors')
var app = express();
var company = require('./controller/company.js');
var customer = require('./controller/customer.js');
var landingpage = require('./controller/landingpage.js');
var rateLimit = require('express-rate-limit');
var security = require('./security/auth.js');
var internal = require('./controller/internal.js');

const port = process.env.PORT || 3003;
const hostname = process.env.HOST || "0.0.0.0";

const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 40, // Limit each IP to 60 requests per `window` (here, per 60 minutes)
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors({origin: '*'}));
app.disable('x-powered-by');
app.use(express.static('public'));
app.use(express.json({limit:"512kb"}));
app.use('/company', apiLimiter);
app.use('/customer', apiLimiter);
app.use('/company', security.checkStaffToken);
app.use('/customer/profile_pic', security.checkStaffToken);
app.use('/internal', security.checkStaffToken);

app.set('trust proxy', 1);

app.get('/customer/track',function(req, res){
    customer.saveTrack(req, res);
});

app.post('/customer/nps',function(req, res){
    customer.saveNps(req, res);
});

app.post('/customer/sign',function(req, res){
    customer.saveSign(req, res);
});

app.get('/customer/mail/unsubscribe/:token',function(req, res){
    customer.unsubscribe(req, res);
});

//Start Internal endpoints
app.get('/customer/nps/scores',function(req, res){
    customer.getScores(req, res);
});

app.get('/customer/mail/unsubscribe_request',function(req, res){
    customer.listFiles(req, res);
});
//End Internal endpoints

app.post('/customer/prospect',function(req, res){
    customer.saveProspect(req, res);
});

app.post('/customer/profile_pic',function(req, res){
    customer.saveProfileImg(req, res);
});

app.get('/customer/profile_pic/:member_id',function(req, res){
    customer.getProfileImg(req, res);
});

// app.post('/customer/profile_pic',function(req, res){
//     customer.saveSelfProfileImg(req, res);
// });

// app.post('/customer/login',function(req, res){
//     customer.login(req, res);
// });

// app.post('/customer/release_turn_stile',function(req, res){
//     customer.releaseTurnStile(req, res);
// });

// app.post('/customer/book_class',function(req, res){
//     customer.bookClass(req, res);
// });

// app.post('/customer/cancel_class',function(req, res){
//     customer.cancelClass(req, res);
// });

app.post('/internal/profile_pic',function(req, res){
    customer.saveProfileImg(req, res);
}); //To be deleted when updated in CG Server

app.get('/internal/profile_pic/:member_id',function(req, res){
    customer.getProfileImg(req, res);
}); //To be deleted when updated in CG Server

app.post('/legacy/profile_pic',function(req, res){
    customer.saveProfileImg(req, res);
});

app.post('/internal/pre_sign',function(req, res){
    internal.preSign(req, res);
});

app.get('/internal/sign/:id',function(req, res){
    internal.getSign(req, res);
});

app.post('/company/sign',function(req, res){
    company.saveCompanySign(req, res);
});

app.get('/company/sign',function(req, res){
    company.getCompanySign(req, res);
}); //Waiting CG update to remove this function and enable the following

app.get('/internal/company/sign',function(req, res){
    company.getCompanySign(req, res);
});

app.post('/whatsapp_lp',function(req, res){
    landingpage.saveWpp(req, res);
});

// app.post('/customer/save_post',function(req, res){
//     customer.savePost(req, res);
// });

// app.get('/customer/get_post',function(req, res){
//     customer.getPost(req, res);
// });

https
.createServer(
{
    key: fs.readFileSync("certificates/key.pem"),
    cert: fs.readFileSync("certificates/cert.pem"),
},
app
)
.listen(port,hostname,function(){
    console.log("server is runing at port 3003");
});
