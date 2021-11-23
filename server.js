const { response, query } = require('express')
var express = require('express')
var app = express()
const database = require('./database.json')
var formidable = require("formidable")
var bodyParser = require('body-parser');
var fs = require('fs')
var path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('client'))


app.get('/publish', function(req,resp){
    
    fs.readFile('./client/publish.html',function(err,data){
        if (err){
            resp.writeHead(404,{'Content-Type':'text/html'})
        }
        else{
            resp.writeHead(200,{'Content-Type':'text/html'})
            resp.write(data.toString())
        }
    resp.end()
    })
})

app.post('/upload',async(req,resp)=>{
    var form = new formidable.IncomingForm();
    form.uploadDir='./songs';
    form.keepExtensions = true;
    form.parse(req,function(err,fields,files){
        // console.log(files)
        // console.log(files.file)
        

        var tmpPath=files.file.path;

        var fileName = files.file.name;
        if (fileName==""){
            resp.send("Unsuccessful upload. Please do not upload an file without filename")
        }
        else{
            database.push({song:fileName})

            let result = JSON.stringify(database);
            fs.writeFile("./database.json",result,"utf8",function (err,data){
                if (err){
                    console.error(err)
                }
                else{
                    console.log("Successfully updated json file")
                    console.log(database)
                }
            })

            console.log(database)

            fs.rename(tmpPath,path.resolve(form.uploadDir,fileName),function(err){
                if (err){
                    console.log("Unsuccessful upload")
                    resp.send("Unsuccessful upload. Please do not upload an empty file")
                }
                else{
                    console.log("Successful upload")
                    resp.writeHead(200,{'content-type':'text/html'})
                    resp.write('Successful upload');
                    resp.write('<button href="http://127.0.0.1:8090/publish">Continue to fill in other info</button>')
                }
                resp.end()
            })
        }
        
    })

})



app.get('/main',function(req,resp){
    
    for (let i=0;i<database.length;i++){
        var message = ""
        message += '<div id="player_preview">'
        message += '<br><p class="publisher_name">'+database[i].username+'</p>'
        message += '<p class="song_name">'+database[i].song_name+'</p>'
        message += '<audio controls><source src="./songs/'+database[i].song+'" type="audio/mp3"></audio>'
        message += '</div>'
        
        // message += '<script>document.getElementById("player_preview").style = "background-image:url("'
        // message += database[i].player_background
        // message += +'")"</script>'
        
        resp.write(message)
    }
    console.log(database)
    console.log("message=",message)
    resp.end()
})

app.get('/songs/:song',function(req,resp){
    var file_path = path.join(__dirname,"./songs",decodeURI(req.params.song))
    console.log(file_path)
    resp.sendFile(file_path)
})


app.get('/search',function(req,resp){
    var keyword =req.query.keyword.toLowerCase() 
    for (let i=0;i<database.length;i++){
        
        // console.log(req.query.keyword)
        // console.log(database[i].song_name.toLowerCase())
        
        if ((keyword==database[i].username.toLowerCase()) || (keyword==database[i].song_name.toLowerCase())){
            // console.log(database[i].song_name.toLowerCase())
            // if (req.query.keyword.toLowerCase() == database[i].song_name.toLowerCase()){
            //     console.log("match")
            // }
            var message = ""
            message += '<div id="player_preview">'
            message += '<br><p class="publisher_name">'+database[i].username+'</p>'
            message += '<p class="song_name">'+database[i].song_name+'</p>'
            console.log(database[i].song)
            message += '<audio controls><source src="./songs/'+decodeURI(database[i].song)+'" type="audio/mp3"></audio>'
            
            message += '</div>'
        
        // message += '<script>document.getElementById("player_preview").style = "background-image:url("'
        // message += database[i].player_background
        // message += +'")"</script>'

            
            resp.write(message)
        }
        
    }
    console.log(database)
    console.log("message=",message)
    resp.end()
})

// app.post('/new',function(req,resp){
//     recipes.push({
//         title: req.body.title,
//         href: req.body.href,
//         ingredients:req.body.ingredients,
//         thumbnails: req.body.thumbnails
//     })
//     console.log(recipes)
//     resp.send("success")
// })

app.post('/new',function(req,resp){
    for (let i=0;i<database.length;i++){
        if ((database[i].username)==undefined){
            var exist=true
            database[i].username = req.body.username,
            database[i].song_name = req.body.song_name,
            database[i].player_background = req.body.player_background
            break
        }
    }
    if (exist){
        resp.send("Success")
        console.log("Successful upload of information")
        console.log(database)
        let result = JSON.stringify(database);
        fs.writeFile("./database.json",result,"utf8",function (err,data){
            if (err){
                console.error(err)
            }
            else{
                console.log("Successfully updated json file")
                console.log(database)
                }
            })
    }
    else{
        resp.send("Please upload an audio file before this step")
    }
    
        
})



app.listen(8090)