var express = require('express');
var path = require('path');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');
var app = express();
var expressHandlebar = require('express-handlebars');
mongoose.set("useFindAndModify",false);
const port = 7921;

//thiết lập thư viện handlebar
app.engine('handlebars',expressHandlebar({
    //thiết lập thư mục, tên file layout cha
    layoutsDir : __dirname + '/views/layouts',
    defaultLayout: 'main',
}))
app.set('view engine',"handlebars")

// lắng nghe http get
app.get('/',function (request,response){
    response.render('index'/*,{title: name,date : '2021',arr : arr}*/);
});
app.get('/register',function (request,response){
    response.render('register'/*,{title: name,date : '2021',arr : arr}*/);
});
app.get('/login',function (request,response){
    response.render('login'/*,{title: name,date : '2021',arr : arr}*/);
});
app.get('/user',function (request,response){
    response.render('user'/*,{title: name,date : '2021',arr : arr}*/);
});
let id = "";
app.get('/update/:id',(req,res) =>{
    var userModel = db.model('users', user);
    userModel.findById(req.params.id,(err, user) =>{
        if(!err){
            id = req.params.id;
            res.render('update',{
                user:user.toJSON()
            })
        }
    })
})
app.get('/userManager',function (req,res){
    var connectUser = db.model('users',user);
    connectUser.find({})
        .then(userlist => {
            res.render('userManager',{
                user:userlist.map(user=>user.toJSON())
            });
        })
});

app.use(express.static('assets'));


//connect mongodb:
mongoose.connect('mongodb+srv://admin:admin@cluster0.gtp5q.mongodb.net/tinder?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("'connected")
});
var user = new mongoose.Schema({
    username : String,
    email: String,
    password : String,
    birthday: String,
    phonenumber: String,
    description :  String,
})
app.post('/register',upload.single('avatar'),function (req,res,next){
    var connectUser = db.model('users',user);
    connectUser({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        birthday: req.body.birthday,
        phonenumber: req.body.phonenumber,
        description: req.body.description,
    }).save(function (err){
        if(!err){
            res.render('index', {title : 'exxpress thanh cong'});
        }else{
            res.render('index', {title : 'express failed'});
        }
    })
})


app.post('/update',upload.single('avatar'),(req,res) =>{
    var userModel = db.model('users', user);
    console.log(req.body);
    console.log(("C4:"+id))

    userModel.findOneAndUpdate({_id:id},req.body,{new:true},(err,doc) =>{
        if(!err){
            res.redirect('userManager');
            console.log("ok");
        }else {
            console.log(err);
        }
    })
})

app.get('/delete/:id', async(req,res) =>{
    try {
        var userModel = db.model('users', user);
        const users = await userModel.findByIdAndDelete(req.params.id,req.body);
        if(!users){
            res.status(404).send('No item found');
        }
        else{
            res.redirect('/userManager')
        }
    }
    catch (err){
        res.status(500).send(err);
    }
})



app.listen(process.env.PORT || port);