var express = require('express');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads')
  },
  filename: function(req, file, cb){
    cb(null, Date.now()+ "." + file.originalname);
  }
});

const upload = multer({storage: storage}).array('files', 12);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods',
          'GET, PUT, POST, PATCH, DELETE'
      );
      return res.status(200).json({});
  }
  next();
})

app.post('/upload', (req, res, next)=>{
  upload(req, res, function(err){
    if(err){
      return res.status(501).json({error: err})
    }    
    res.json({files: req.files})
  }) 
});

app.post('/download', function(req, res, next){
  console.log('body', req.body)
  filepath = path.resolve(__dirname, 'uploads', req.body.fileName);
  console.log(filepath);
  res.sendFile(filepath + '.jpg');
})

app.get('/defectlist', function(req, res, next){
  var data = JSON.parse(fs.readFileSync('./DB_Store/defectlist.json'));   
  res.json({defectList: data.DefectList, msg: 'get defect list is success'})
})

app.post('/defectlist', function(req, res, next){
  var defectList = JSON.parse(fs.readFileSync('./DB_Store/defectlist.json'));
  
  defectList.DefectList.push(req.body.newDefect);
  console.log(defectList)
  fs.writeFileSync('./DB_Store/defectlist.json', JSON.stringify(defectList))
  res.json({msg: 'Create new defect success'});
});

module.exports = app;
