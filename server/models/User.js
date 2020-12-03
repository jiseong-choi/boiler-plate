const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({// Schema declares type of its value.
    name:{
        type:String,
        maxLength:50,
    },
    email:{
        type:String,
        trim:true,
        unique:1,
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxLength:50,
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String,
    },
    tokenExp:{
        type:Number
    }
});

userSchema.pre('save', function( next ){//before function 'save' 
    let user = this
     // 비밀번호를 암호화 시킨다
     if(user.isModified('password')){//if password is change
        bcrypt.genSalt( saltRounds,function(err,salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt,function(err,hash){
                //store hash in your password DB.
                if(err) return next(err);
                user.password = hash;//password 를 hash 값으로 업데이트
                next();
            })
        });
    }
    else{
        next();//isModified password 가 아닐때
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {//make methods

    //plainPassword password === hashpassword
    bcrypt.compare(plainPassword, this.password, function (err, isMath) {
        if(err) return cb(err);
        cb(null, isMath)
    })
}

userSchema.methods.generateToken = function(cb){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
    //jsonwebtoken 으로 token 생성
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User',userSchema);

module.exports = { User };