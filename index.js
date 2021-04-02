var express = require('express');

var app = express();

var expressHandlebar = require('express-handlebars');

//thiết lập thư viện handlebar
app.engine('handlebars',expressHandlebar({
    //thiết lập thư mục, tên file layout cha
    layoutsDir : __dirname + '/views/layouts',
    defaultLayout: 'main',
}))
app.set('view engine',"handlebars")

// lắng nghe http get
app.get('/',function (request,response){
    //var name = 'duyvu'
    //var arr = ['apple','banana','orange'];
    response.render('index',/*{title: name,date : '2021',arr : arr}*/)
});
app.use(express.static('assets'));

// lắng nghe http post:
app.post('/login',function (request,response){

});
app.listen(process.env.PORT || '2001');