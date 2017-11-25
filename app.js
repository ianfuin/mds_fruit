/*const Koa = require('koa');
const serve = require('koa-static');*/
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:pass@ianfuin.com:27017/test', {
    useMongoClient: true
});
let db = mongoose.connection;

db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {

    console.log('连接成功');
    let kittySchema = mongoose.Schema({
        name: String
    });

    console.log(kittySchema);

    kittySchema.methods.speak = function () {

        let greeting = this.name ?
            "Meow name is " + this.name :
            "I don't have a name";
        console.log(greeting);
    };

    let Kitten = mongoose.model('kitten', kittySchema);

    let fluffy = new Kitten({
        name: 'fluffy'
    });

    /*  fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
        fluffy.speak();
      });*/

    Kitten.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
    })

});


const app = new Koa();
let staticFiles = require('./static-files');

const port = 80;//端口号
const hostname = '192.168.1.146';//私有ip


app.use(serve(__dirname + '/static'));
// app.use(staticFiles( __dirname + '/static'));
app.listen(port,hostname)
console.log('app started at port '+hostname+':'+port);