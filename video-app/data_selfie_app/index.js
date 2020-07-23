const express = require('express');
const Datastore = require('nedb');
const multer = require('multer') //use multer to upload blob data
const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs'); //use the file system so we can save files


const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({
  limit: '10mb'
}));

const database = new Datastore('database.db');
database.loadDatabase();


app.post('/upload', upload.single('videoBlob'), function (req, res, next) {
  let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension

  // add the filename 
  const data = {
    filename: req.file.originalname,
    approved: false
  }
  database.insert(data);

  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok
  // Another option if you wanted to send a custom message back
  // res.json({
  //   status: "it worked!",
  //   filename: req.file.originalname
  // });
})

app.get('/list', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

// app.post('/api', (request, response) => {
//   const data = request.body;
//   const timestamp = Date.now();
//   data.timestamp = timestamp;
//   database.insert(data);
//   response.json(data);
// });