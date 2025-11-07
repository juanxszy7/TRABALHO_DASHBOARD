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


//Modelo de vendas
const VendaSchema = new mongoose.Schema({
  produto: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  dataVenda: {
    type: Date,
    default: Date.now
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, { timestamps: true });

const Venda = mongoose.model('Venda', VendaSchema);


// ------------------------------------------------------------ Rotas Usuario ------------------------------------------------------

//Rota de cadastro
app.post('/cadastro', async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        const UsuarioExistente = await Usuario.findOne({email})

        if (UsuarioExistente) {
            return res.status(400).json({ message: "Usuário já cadastrado" })
        }

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

//Rota para listagem de usuarios
app.get('/usuarios', async (req, res) => {
    
    try {
        
        const usuarios = await Usuario.find();
        res.json(usuarios)

    } catch (err) {

        console.error("❌ Erro ao buscar usuários:", err)
        res.status(500).json({ message: "Erro no servidor ao buscar usuários" })
    
    }

});

//Rota de edição de usuarios
app.put('/editarUsuarios/:id', async (req, res) => {

    try {
        
        const { id } = req.params
        const { nome, email, senha } = req.body

        const atualizacoes = {};
        if (nome) atualizacoes.nome = nome;
        if (email) atualizacoes.email = email;
        if (senha) atualizacoes.senha = senha;

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, atualizacoes, {new: true})

        if (!usuarioAtualizado) {
            
            return res.status(404).json({message: "Usuario não encontrado"})

        }

        return res.json({message: "Usuario atualizado com sucesso!", usuarioAtualizado})

    } catch (err) {
        
        res.status(500).json({ error: "Erro ao atualizar o usuário." });

    }

});

//Rota de deletar usuario
app.delete('/usuarios/:id', async (req, res) => {
    
    try {
        
        const usuario = await Usuario.findByIdAndDelete(req.params.id)

        if (!usuario) {
            return res.status(404).json({message: "Usuario não encontrado"})
        }

        return res.json({ message: "Usuario deletado com sucesso" })

    } catch (err) {
        
        console.error("Erro ao deletar usuario", err)
        res.status(500).json({message: "Erro no servidor ao excluir"})

    }

});


// ----------------------------------------------------------------- Rotas Vendas -----------------------------------------------------------

//Cadastro de nova venda
app.post('/novaVenda', async (req, res) => {
  try {
    const { produto, valor, vendedor } = req.body;

    const novaVenda = new Venda({
      produto,
      valor,
      vendedor
    });

    await novaVenda.save();
    res.status(201).json({ message: "Venda registrada com sucesso!", novaVenda });

  } catch (err) {
    console.error("Erro ao registrar venda:", err);
    res.status(500).json({ message: "Erro ao registrar venda" });
  }
});

//Listagem de vendas
app.get('/vendas', async (req, res) => {
  try {
    const vendas = await Venda.find()
      .populate('vendedor', 'nome email');

    res.json(vendas);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ message: "Erro ao buscar vendas" });
  }
});

//Rota de edição de vendas
app.put('/vendas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { produto, valor, vendedor } = req.body;

    const atualizacoes = {};
    if (produto) atualizacoes.produto = produto;
    if (valor !== undefined) atualizacoes.valor = valor;
    if (vendedor) atualizacoes.vendedor = vendedor;

    const vendaAtualizada = await Venda.findByIdAndUpdate(id, atualizacoes, {
      new: true
    });

    if (!vendaAtualizada)
      return res.status(404).json({ message: "Venda não encontrada" });

    res.json({ message: "Venda atualizada com sucesso", vendaAtualizada });

  } catch (err) {
    console.error("Erro ao atualizar venda:", err);
    res.status(500).json({ message: "Erro ao atualizar venda" });
  }
});

//Rota de deletar vendas
app.delete('/vendas/:id', async (req, res) => {
  try {
    const venda = await Venda.findByIdAndDelete(req.params.id);

    if (!venda)
      return res.status(404).json({ message: "Venda não encontrada" });

    res.json({ message: "Venda deletada com sucesso" });

  } catch (err) {
    console.error("Erro ao deletar venda:", err);
    res.status(500).json({ message: "Erro ao deletar venda" });
  }
});


//-------------------------------------------------------- Dashboard -----------------------------------------------

//Rota de Faturamento mensal
app.get('/dashboard/faturamento-mensal', async (req, res) => {
  try {
    const resultados = await Venda.aggregate([
      {
        $group: {
          _id: { $month: "$dataVenda" },
          total: { $sum: "$valor" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ message: "Erro ao calcular faturamento" });
  }
});


const PORT = 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`) )
