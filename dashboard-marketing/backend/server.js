//Dependencias
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//Inicialização
const app = express()
app.use(cors())
app.use(express.json())

//Conexão com banco de dados
mongoose.connect("mongodb://localhost:27017/dashboardMarketing", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado ao MongoDB"))
.catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err))

//Modelo de usuario
const UsuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
})
const Usuario = mongoose.model('Usuario', UsuarioSchema)

//Rotas
app.post('/cadastro', async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        //Verificar se usuario ja foi cadastrado pelo email
        const UsuarioExistente = await Usuario.findOne({email})

        if (UsuarioExistente) {
            return res.status(400).json({ message: "Usuário já cadastrado" })
        }

        //Criptografar Senha
        const senhaCriptografada = await bcrypt.hash(senha, 8)

        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaCriptografada
        })

        await novoUsuario.save() 
        res.status(201).json({ message: "Usuário cadastrado com sucesso" }) 

    } catch (erro) {
        
        console.error("❌ Erro ao cadastrar usuário:", erro)
        res.status(500).json({ message: "Erro no servidor ao cadastrar" })

    }
    
});

app.get('/usuarios', async (req, res) => {
    
    try {
        
        const usuarios = await Usuario.find();
        res.json(usuarios)

    } catch (err) {

        console.error("❌ Erro ao buscar usuários:", err)
        res.status(500).json({ message: "Erro no servidor ao buscar usuários" })
    
    }

});







const PORT = 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`) )