const express = require("express");
const router=express.Router();
const bcrypt = require("bcrypt");
let pool;
router.post('/register',async (req, res)=>{
    const{email,username,password}=req.body;
    try{
        const hashed = await bcrypt.hash(password,10);
        await pool.query(
            'Insert into users (email, username, password) values ($1, $2, $3)',[email, username, hashed]
        );
    }catch (err){
        console.error(err);
        res.send('Error: not vaild');
    }
});
router.post('/login', async (req, res)=>{
    const {email,password}=req.body;
    try{
        const result = await pool.query('select *  from users where email=$1',[email]);
        if (result.rows.length===0)return res.send('no user found');
        const user=result.rows[0];
        const match=await bcrypt.compare(password,user.password);
        if(!match) return res.send('Incorrect password');
        req.session.user = {id: user.id, username: user.username};
        res.redirect('/download');
    }catch (err) {
        console.error(err);
        res.send("Login Error");
    }
});
module.exports = {
    router,
    setPool: (p) => {pool=p;}
}