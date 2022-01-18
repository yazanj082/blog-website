// importing express
const express = require('express');


//importing view engin hbs
const hbs = require('hbs');
//importing path library to help getting project directory
const path = require('path');
//importing mongo db model
const mongoModel = require('../models/mongoModel')
//importing api/weather
const weather = require('../api/weather');
//importing api/coin
const coin = require('../api/coin');
// setting directories paths
const viewsDir  = path.join(__dirname,'../views');
const publicDir = path.join(__dirname,'../public');
const partialsDir = path.join(__dirname,'../views/partials');
//initializing the router
const app = express();
//need that to get values from post request because body parser is deprecated
app.use(express.urlencoded({extended:false}));

//configuring our router with project
app.use(express.static(publicDir));
app.set('view engine','hbs');
app.set('views',viewsDir);
hbs.registerPartials(partialsDir);
//that function slice date instance and return a string yyyy-mm-dd h:m:s
function getDateTime(date) {

    

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}
// to make a function that i cant use in my hbs files
//this function if string is bigger than 500 char it slice it and add ... to it and return it
hbs.registerHelper('length', function(content) {
   if(content.length>500){
       let str=content;
       str=str.slice(0,500);
       str+="...";
       return (str);
   }
   return (content);
  });
  //this function take Date instance then return it sliced as string
  hbs.registerHelper('Ftime', function(date) {
    return getDateTime(date);
   });


//get request fire when requesting the page
app.get('/', async (req,res)=>{
    //getting nablus temp
    let temp = await weather.getWeather('Nablus');
    //getting gold to btc values
    let gold = await coin.getCoin();
    //return total number of pages
    let index = await mongoModel.countPages();
    //fill an array each index with its number 
    let arr=[];
    for(let i=1;i<=index;i++){arr.push(i);}
    //getting first page posts
    let list = await mongoModel.listPosts(0);
    //rendering the page
    res.render('index',{'list':list,'nums':arr,'temp':temp,'rate':gold.rate});

});
app.get('/number/:num', async (req,res)=>{
    //getting nablus temp
    let temp = await weather.getWeather('Nablus');
    //getting gold to btc values
    let gold = await coin.getCoin();
    //return total number of pages
    let index = await mongoModel.countPages();
    //fill an array each index with its number 
    let arr=[];
    for(let i=1;i<=index;i++){arr.push(i);}
    //getting page posts for requested page number
    index= 5*(req.params.num-1);
    let list = await mongoModel.listPosts(index);
     //rendering the page
    res.render('index',{'list':list,'nums':arr,'temp':temp,'rate':gold.rate});

});
app.get('/add', async (req,res)=>{
    //rendering the page
    res.render('add');

});
//post fire when supmitting a new post 
app.post('/add',(req,res)=>{
//getting post paramiters
   let title = req.body.title;
   let body = req.body.content;
   //adding the new post to mongo db
   mongoModel.addPost(title,body);
   //return to home
   res.redirect('/');
});
//when requesting an item details
app.get('/post/:id', async (req,res)=>{
    //get the post values from mongo db
    let post = await mongoModel.getById(req.params.id);
    //render the post page
    res.render('post',{'body':post.body,'date':post.date,'title':post.title});

});
//starting the server
app.listen(3000,()=>{
   console.log('Server started on port 3000'); 
});