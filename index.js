const express = require ('express');// module을 import 하는것과 같음.
const mongoose = require('mongoose');

const app = express();

const port = 3000;//여러번 재사용할 상수는 선언해주면 좋음

mongoose.connect("mongodb+srv://boiler-plate:wltjd2002@cluster0.wp9ly.mongodb.net/boiler-plate?retryWrites=true&w=majority",{
    useNewUrlParser:true, useUnifieldTopology:true, useCreateIndex:true,useFindAndModify:false
}).then(() => console.log("DB Connecting Successed"))
  .catch(err => console.log(err))

    app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
  app.listen(port, () => {//포트를 기다린다? 라고 생각하면됨
    console.log(`Example app listening at http://localhost:${port}`)
}) 