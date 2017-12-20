//hacemos un require de gulp 
var gulp = require('gulp')
//hacemos un require de gulp-sass para procesar el archivo sass a un css
var sass = require('gulp-sass')
//hacemos un require de gulp-rename para renombrar el archivo sass
var rename = require('gulp-rename')
//hacemos un require de babelify para poder transformar el codigo
var babel = require('babelify')
//hacemos un require de browserify para hacer el package bundle
var browserify = require('browserify')
//hacemos un require de source para ayudar a gulp 
var source = require('vinyl-source-stream')
//hacemos un require de watchify
var watchify = require('watchify')

//le damos un nueva tarea para gulp un gulp.task
//el primer parametro es el nombre de la tarea y la segunda es la funcion que realizara
gulp.task('styles', function(){
    //empezamos a darle tareas de manera consecutiva
    gulp
        //rescata el archivo sass
        .src('index.scss')
        //hacemos un pipe para transformar el archivo a un css
        //hacemos uso de gulp-sass
        .pipe(sass())
        //le cambiamos el nombre a app.css
        //hacemos uso de gulp-rename
        .pipe(rename('app.css'))
        //le damos el destino de donde guardara el archvo
        .pipe(gulp.dest('public'))
})

//tarea para llevar los assets a la carpeta publica 
gulp.task('assets', function (){
    gulp
        //seleccionamos todo los archivos de la carpeta assets
        .src('assets/*')
        //copiamos todo a la carpeta public
        .pipe(gulp.dest('public'))
})

//tarea para generar nuestro archivo app.js
//esta tarea sera incluida en nuestro build
/*gulp.task('scripts', function (){
    //usamos browserify para juntar el archivo index.js del src
    browserify('./src/index.js')
        //usamos babel para transformar nuestro codigo al estandar es2015
        .transform(babel, {presets: ["es2015"]})
        //hacemos un bundle para tener el archivo
        .bundle()
        //decimos con source que el archivo q daba el bundle lo transforme
        //en un archivo q entienda gulp
        .pipe(source('index.js'))
        //renombramos el archivo
        .pipe(rename('app.js'))
        //mandamos el archivo a la carpeta public
        .pipe(gulp.dest('public'))
})*/
function compile(watch){
    /*aqui declaramos la variable bundle que recibira lo q le devuelve browserify 
    q le pasamos como parametro el archivo sobre el q se hara el bundle
    */
    var bundle = browserify('./src/index.js')

    //aqui definimos la funcion rebundel que lo unico q hara sera hacer el bundle
    //de nuestro archivo index.js como lo hacia nuestra tarea de scripts
    function rebundle(){
        //ahora usando la propiedad de javascipt hacemos uso de los clousures para
        //referenciar a la variable bundle de afuera de esta funcion y le hacemos lo mismo
        //q le haciamos al archivo que nos devolvia browserify('./src/index.js')
        //debido a q tiene todas las mismas propiedades
        bundle
            //usamos babel para transformar nuestro codigo al estandar es2015
            .transform(babel, {presets: ["es2015"]})
            //hacemos un bundle para tener el archivo
            .bundle()
            //aqui catcheamos el error con el segundo parametro siendo un callback 
            //q hara algo cuando encuentre un error o hay el evento de error
            .on('error',function (err){
                //mostramos el error en console
                console.log(err) 
                //y le decimos a este q haga un emir end
                this.emit('end')
            })
            //decimos con source que el archivo q daba el bundle lo transforme
            //en un archivo q entienda gulp
            .pipe(source('index.js'))
            //renombramos el archivo
            .pipe(rename('app.js'))
            //mandamos el archivo a la carpeta public
            .pipe(gulp.dest('public'))
    }

    //ahora hacemos un if para revisar la condicion del parametro si tenemos q hacer
    //la funcion de watch o la del build solamente
    if(watch){
        /*le decimos a bundle q ahora sea lo q nos devueve watchify del bundle que 
        es el archivo osea ahora el bundle tendra la capacidad de hacer watch al
        archivo*/
        bundle = watchify(bundle)
        //ahora si es que watch era true significa q tenemos q ponernos a escuchar un event
        //para ello usamos bundle.on para como abrir un evento osea estar constantemente
        //escuchando el evento q para nosotros sera el evento 'update' q exactamente sera
        //el de una actualizacion osea q cuando se actualize nuestro archivo se correra una
        //accion que sera exactamente la funcion q le pasamos como segundo parametro 
        bundle.on('update',function() {
            //aqui primero imprimira en consola q esta haciendo el bundling
            console.log('--> Bundling')
            //y luego llamara a la funcion q hace el bundle
            rebundle()
        })
    }
    //ahora en caso de q no sea watch osea estemos llamando desde el build solo haremos
    //un buil y no escucharemos nada de lo anteriormente dicho
    rebundle()
}
gulp.task('build',function (){
    //aki le decimos que haga el complie pero solo el bundle no el watch
    return compile()
})

gulp.task('watch', function (){
    //aki le decimos que haga el compile pero que ahora si haga el watch
    return compile(true)
})

//le damos la tarea por default
//el primer parametro es la tarea por default y el segundo es un arreglo 
//con las tareas que se ejecutaran al llamar por default
gulp.task('default',['styles','assets','build'])