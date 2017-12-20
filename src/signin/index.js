var page = require('page')
var empty = require('empty-element')
var template = require('./template')
var title = require('title')

page('/signin', function (){
    title('Platzigram-Signin')
    var main = document.getElementById('main-container')
    var header = document.getElementById('header-container')
    empty(header)
    empty(main).appendChild(template)
})