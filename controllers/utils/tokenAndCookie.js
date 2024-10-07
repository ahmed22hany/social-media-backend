const jwt =require("jsonwebtoken")

const tokenAndCookie= (userId, res)=>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    return token;
}

module.exports = tokenAndCookie;    