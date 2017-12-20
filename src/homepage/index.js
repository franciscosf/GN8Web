var page = require('page')
var empty = require('empty-element')
var template = require('./template')
var title = require('title')
var request = require('superagent')
var header = require('../header')
var axios = require('axios')

page('/', header, asyncLoadPictures, function (context, next){
    title('Platzigram')
    var main = document.getElementById('main-container')
    var array = [1,1,1]
    
    empty(main).appendChild(template(context.pictures))
})

function loadPictures(context, next){
    request
        .get('/api/pictures')
        .end(function (err, res) {
            if(err) return console.log(err)
            context.pictures = res.body
            next()
        })    
}

function loadPicturesAxios(context, next){
    axios.get('/api/pictures')
        .then(function (response){
            context.pictures = response.data
            next()
        })
        .catch(function (err){
            console.log(err)
        })
}

function loadPicturesFetch(ctx, next){
    fetch('/api/pictures')
        .then(function (res) {
            return res.json()
        })
        .then(function (pictures) {
            ctx.pictures = pictures
            next()
        })
        .catch(function (err) {
            console.log(err)
        })
}

async function asyncLoadPictures(ctx, next){
    try {
        ctx.pictures = await fetch('api/pictures').then((res) => res.json())
        next()
    } catch(err) {
        console.log(err)
    }
}