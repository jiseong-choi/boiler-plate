const express = require ('express');// module을 import 하는것과 같음.
const mongoose = require('mongoose');//Mongoose is a JavaScript framework that is commonly used in a Node. js application with a MongoDB database.
const config = require('./config/key');//It can divide developer mod and prod mod
const cookieParser = require('cookie-parser');//요청된 쿠키를 쉽게 추출할 수 있도록 해주는 미들웨어. 웹 브라우저에서 데이터베이스로부터 데이터를 저장하거나 읽어올 수 있게 중간에 미들웨어가 존재하게 된다.
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const port = 5000;//여러번 재사용할 상수는 선언해주면 좋음


const app = express();
//app.METHOD(PATH, HANDLER)  method 는 소문자 로 된 HTTP 요청 메소드 입니다.https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods 
//PATH 서버의 경로입니다. HANDLER 경로가 일치 할 때 실행되는 함수입니다. ex)
app.get('/supersexy', (req, res) => res.send('U r supersexy'))
//application/x-www-form-urlencoded 


app.use(express.json()); // After  Express V4.16.0 app.use(bodyparser.json()) == app.use(express.json());
//application/json
app.use(cookieParser())
//using cookieparser

mongoose.connect(config.mongoURI,{//connect to MongoDB
    useNewUrlParser:true, useUnifieldTopology:true, useCreateIndex:true,useFindAndModify:false//mongodb config I dont know about this but people use like this
}).then(() => console.log("DB Connecting Successed"))
  .catch(err => console.log(err))//catch the error

app.get('/',(req, res) => res.send('Hello world!'))

app.get('/api/hello', (req, res) => {

    res.send('안녕하세요~')
})

app.post('/api/users/register', (req, res) => {//register 기능 구현 post methods
    const user = new User(req.body) // models.User 에서 가져온 user 새로운 유저를 받아와서 req.body 에 넣어서 유저에 넣음 User 로 새 인스턴스를 생성
    user.save((err,doc) =>{// 넣은 유저를 save method로 저장합니다.

        if(err) return res.json({ sucess:false,err })
        return res.status(200).json({ sucess:true })//save에 실패하면 에러를 뱉고 성공하면 성공을 뱉음
    })
    //회원 가입에 필요한 정보를 client에서 가져와서 DB에 저장 
})

app.post('/api/users/login',(req,res) => {//로그인 기능 구현 post methods

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email:req.body.email },(err,user) => {//findOne 은 이메일을 데이터 베이스에 있는지 찾는다.
        if(!user){
            return res.json({
                loginSucess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })//유저가 없으면 없다고 한다.
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch) return res.json({ loginSucess:false, message:"비밀번호가 틀렸네요 어휴 기억력이..." })
            user.generateToken((err, user) => {//토큰을 생성하는 메쏘드를 실행
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