const User = require("../models/User")
const bcrypt = require("bcrypt.js")

module.exports = class UserController{
    static login(req, res){
        res.render("auth/login")
    }

    static async loginPost(req, res){
        const {email, password} = req.body
        const user = await User.findOne({where: {email:email}})

        if(!user){
            res.render("auth/login", {message:"Usuário não encontrado."})
            return
        }

        const passwordMatch = bcryp.compareSync(password, user.password)

        if(!passwordMatch){
            res.render("auth/login", {message:"Senha incorreta."})
            return
        }
        req.session.userid = user.id

        req.flash("message", "Login realizado com sucesso!")
        req.session.save(() =>{
            res.redirect("/")
        })
    }

    static register(req, res){
        res.render("auth/register")
    }

    static async registerPost(req, res){
        const {nome, email, password, confirmPassword} = req.body
        if(password != confirmPassword){
            req.flash("message", "As senhas não conferem!")
            res.render("auth/register")
            return
        }

        const checkUserIfUserExists = await User.findOne({where: {email:email } })
    
        if(checkUserIfUserExists){
            req.flash("message", "Email já existe")
            res.render("auth/register")
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        
        const user = {
            name,
            email,
            password: hashedPassword
        }
        
        
        User.create(user).then((user) => {
            req.session.userid = user.id
            req.flash("message", "Cadastro realizado com sucesso!")
            req.session.save(() => {
                res.redirect("/")
            })
        })
        .catch((erro) => {
            console.log(erro);
        })
    }

    static logout(req, res){
        req.session.destroy()
    }
}