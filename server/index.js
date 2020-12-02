const express = require ('express');// module을 import 하는것과 같음.
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const port = 3000;//여러번 재사용할 상수는 선언해주면 좋음

const app = express();

app.use(bodyParser.urlencoded({extended: true}));// bodyParser 설정 https://www.npmjs.com/package/body-parser참고
//application/x-www-form-urlencoded 
app.use(bodyParser.json());
//application/json
app.use(cookieParser())
//using cookieparser

mongoose.connect(config.mongoURI,{//connect to MongoDB
    useNewUrlParser:true, useUnifieldTopology:true, useCreateIndex:true,useFindAndModify:false//mongodb config
}).then(() => console.log("DB Connecting Successed"))
  .catch(err => console.log(err))//catch the error

app.get('/',(req, res) => res.send('Hello world!'))

app.post('/api/users/register', (req, res) => {//register 기능 구현
    const user = new User(req.body)
    user.save((err,doc) =>{
        if(err) return res.json({ sucess:false,err })
        return res.status(200).json({ sucess:true })
    })
    //회원 가입에 필요한 정보를 client에서 가져와서 DB에 저장
})

app.post('/api/users/login',(req,res) => {

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email:req.body.email },(err,user) => {
        if(!user){
            return res.json({
                loginSucess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch) return res.json({ loginSucess:false, message:"비밀번호가 틀렸네요 어휴 기억력이..." })
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                //save the token storage : cookie, local, session i will save on cookie
                res.cookie("x_auth",user.token)
                    .status(200)
                    .json({ loginSucess:true,userId:user._id })
            })
        })
    })
})

app.get('/api/users/auth',auth,(req,res) => {
    // 여기까지 미들웨어를 통과했다는거는 Authentication 이 True라는 확인한다
    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role === 0? false : true,
        isAuth : true, 
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
      { token: "" }
      , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
    })
})


app.listen(port, () => {//포트를 기다린다? 라고 생각하면됨
    console.log(`Example app listening at http://localhost:${port}`)
}) 