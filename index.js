var express = require('express');
var mongoose = require('mongoose');
var Photo = require('./models/photo');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/library');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/photo', function(req, res) {
  var tagsString = req.body.tags;
  var tags = tagsString.split(',');
  tags.map(function(tag, index) {
    tags[index] = tag.trim();
  })

  Photo.create({ src: req.body.src, tags: tags }, function(err, photo) {
    if(err) {
      console.log(err);
    } else {
      res.send(photo);
    }
  })
})

app.get('/photo', function(req, res){
  Photo.find({}, function(err, photos){
    if(err){
      console.log(err);
    } else {
      photos.map(function(photo){
        res.write(photo.src + '\n');
        res.write('likes: '+ photo.likes +'\n');
      })
      res.end();
    }
  })
})

app.post('/photo/like', function (req, res){
  Photo.findOne({ src: req.body.src}, function(err, photo){
    if(err) {
      console.log(err);
    }else{
      photo.likes++;
      photo.save(function(err){
        if(err){
          res.send(err);
        } else {
          res.send('update');
        }
      })
    }
  })
})

app.post('/photo/unlike', function (req, res){
  Photo.findOne({ src: req.body.src}, function(err, photo){
    if(err) {
      console.log(err);
    }else{
      photo.likes--;
      photo.save(function(err){
        if(err){
          res.send(err);
        } else {
          res.send('update');
        }
      })
    }
  })
})


app.get('/', function(req, res) {
  res.send('Hello');
})
app.listen(3000, function() {
  console.log('Server is available on localhost:3000');
});
