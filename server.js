var express = require('express')
var multer = require('multer')
var ext = require('file-extension')
var aws = require('aws-sdk')
var multerS3=require('multer-s3')
var config = require('./config')

var s3=new aws.S3({
    accessKeyId:config.aws.accessKey,
    secretAccessKey:config.aws.secretKey
})
var storage=multerS3({
    s3:s3,
    bucket:'gn8images',
    acl:'public-read',
    metadata:function(req,file,cb){
        cb(null,{fieldName:file.fieldname})
    },
    key:function(req,file,cb){
        cb(null,Date.now()+'.'+ext(file.originalname))
    }
})

/*var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, + Date.now() + '.' + ext(file.originalname))
    }
  })*/
  
var upload = multer({ storage: storage }).single('picture')
var app = express()

app.set('view engine','pug')

app.use(express.static('public'))

app.get(['/','/signup','/signin'], (request, response) => {
    response.render('index')
})

app.get('/api/pictures', (request, response) => {
    var pictures = [
        {
            user:{
                username: 'franciscosf',
                avatar: 'avatar1.jpg'
            },
            url: 'office.jpg',
            likes: 0,
            liked: false,
            createdAt: new Date().getTime()
        },
        {
            user:{
                username: 'franciscosf',
                avatar: 'avatar1.jpg'
            },
            url: 'office.jpg',
            likes: 1,
            liked: false,
            createdAt: new Date().setDate(new Date().getDate() - 5) 
        }
    ]

    setTimeout(() => {
        response.send(pictures)
    },2000)
})

app.post('/api/pictures', function (req, res){
    upload(req, res, function (err){
        if(err){
            return res.send(500, 'Error uploading file')
        }
        res.send('File uploaded')
    })
})

app.listen(3000, (error) =>{
    if(error) return console.log('Hubo un error') ,process.exit(1) 
    
    console.log('Escuchando en el puerto 3000')
})