if(!window.Intl) { 
    window.Intl = require('Intl')
} 
var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat') 
var IntlMessageFormat = require('intl-messageformat')

require('intl-relativeformat/dist/locale-data/en.js')
require('intl-relativeformat/dist/locale-data/es.js') 

var es = require('./es.js')
var en = require('./en-US')

var MESSAGES = {}

MESSAGES.es = es
MESSAGES['en-US'] = en 

localStorage.locale = localStorage.locale? localStorage.locale : 'es'
var locale = localStorage.locale

module.exports = {
    message : function (texto, opts){
        opts = opts || {}
        var msg = new IntlMessageFormat(MESSAGES[locale][texto] , locale)
        return msg.format(opts)
    },
    date : function (fecha){
        var rf = new IntlRelativeFormat(locale)
        return rf.format(fecha)
    }
}


