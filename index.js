const express = require ('express');// module을 import 하는것과 같음.
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/key');

const port = 3000;//여러번 재사용할 상수는 선언해주면 좋음
const { User } = require('./models/User');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));// bodyParser 설정 https://www.npmjs.com/package/body-parser참고
//application/x-www-form-urlencoded 
app.use(bodyParser.json());
//application/json


mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifieldTopology:true, useCreateIndex:true,useFindAndModify:false
}).then(() => console.log("DB Connecting Successed"))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    const user = new User(req.body)
    user.save((err,doc) =>{
        if(err) return res.json({ sucess:false,err })
        return res.status(200).json({ sucess:true })
    })
    //회원 가입에 필요한 정보를 client에서 가져와서 DB에 저장
})

app.listen(port, () => {//포트를 기다린다? 라고 생각하면됨
    console.log(`Example app listening at http://localhost:${port}`)
}) 