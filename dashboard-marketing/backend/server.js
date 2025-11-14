//Dependencias
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha:{
    type: String,
    required: true
  },
  origem:{
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});
const Usuario = mongoose.model('Usuario', UsuarioSchema)


//Modelo de Vendedores
const VendedorSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nome: String,
  email: String,
  criadoEm: {
    type: Date,
    default: Date.now
  }
});
const Vendedor = mongoose.model('Vendedor', VendedorSchema)

const ProdSchema = mongoose.Schema({
  produto:{
    type: String,
    required: true
  },
  valor:{
    type: Number,
    required: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  estoque:{
    type: Number,
    default: 0,
    min: 0
  }
})
const Produto = mongoose.model('Produto', ProdSchema)


//Modelo de vendas
const VendaSchema = new mongoose.Schema({
  cliente:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  produto: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true,
    min: 0
  },
  dataVenda: {
    type: Date,
    default: Date.now
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendedor',
    required: true
  },
  pagMetodo:{
    type: String,
    required: true
  }
}, { timestamps: true });

const Venda = mongoose.model('Venda', VendaSchema);


// -------------------------------------------------------- Rota de Origem ----------------------------------------------------------

app.get('/estatisticas', async (req, res) => {
  try {
    const resultado = await Usuario.aggregate([
      { $group: { _id: "$origem", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    res.json(resultado);

  } catch (erro) {
    console.error("❌ Erro ao buscar estatísticas:", erro);
    res.status(500).json({ message: "Erro no servidor ao buscar estatísticas" });
  }
});


// ----------------------------------------------------------- Rota Vendedor --------------------------------------------------------
app.get('/vendedores', async (req, res) => {

  try {

    const usuarios = await Vendedor.find();
    res.json(usuarios)

  } catch (err) {

      console.error("❌ Erro ao buscar vendedores:", err)
      res.status(500).json({ message: "Erro no servidor ao buscar vendedores" })
  
  }



})





// ------------------------------------------------------------ Rotas Clientes ------------------------------------------------------

//Rota de cadastro
app.post('/cadastro', async (req, res) => {

    try {

        const { nome, email, senha, origem } = req.body;

        const UsuarioExistente = await Usuario.findOne({email})

        if (UsuarioExistente) {
            return res.status(400).json({ message: "Usuário já cadastrado" })
        }

        senhaCriptografada = await bcrypt.hash(senha, 8)

        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaCriptografada,
            origem
        })

        await novoUsuario.save() 
        res.status(201).json({ message: "Usuário cadastrado com sucesso" }) 

    } catch (erro) {
        
        console.error("❌ Erro ao cadastrar usuário:", erro)
        res.status(500).json({ message: "Erro no servidor ao cadastrar" })

    }
    
});


app.post('/login', async (req, res) => {

  try {
    
    const { email, senha } = req.body

    const usuarioExistente = await Usuario.findOne({ email })

    if (!usuarioExistente) {
      
      return res.status(404).json({ message: "Usuario não encontrado" })

    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioExistente.senha )

    if (!senhaCorreta) {
      
      return res.status(401).json({ message: "Senha incorreta" })

    }

    const token = jwt.sign({ id: usuarioExistente._id }, "chaveSecreta")

    res.status(200).json({
      message: "Login realizado com sucesso!",
      userId: usuarioExistente.id,
      admin: usuarioExistente.admin,
      nome: usuarioExistente.nome,
      tokenLogin: token
    })

  } catch (err) {
    
    return res.status(500).json({message: "Erro ao fazer login"})

  }

});



//Rota para listagem de usuarios
app.get('/clientes', async (req, res) => {
    
    try {

      const usuarios = await Usuario.find({admin: {$ne: true}});
      res.json(usuarios)

    } catch (err) {

        console.error("❌ Erro ao buscar usuários:", err)
        res.status(500).json({ message: "Erro no servidor ao buscar usuários" })
    
    }

});

//Puxar dados de um cliente expecifico
app.get('/clientes/:id', async (req, res) => {
    
  const { id } = req.params;
  console.log("🧩 ID recebido:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  try {
    const usuario = await Usuario.findById(id).select('-senha');
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: err.message });
  }


});

//Rota de edição de usuarios

app.put('/editarUsuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, admin, origem } = req.body;

    const atualizacoes = {};

    if (nome) atualizacoes.nome = nome;
    if (email) atualizacoes.email = email;
    if (admin !== undefined) atualizacoes.admin = admin;
    if (origem !== undefined) atualizacoes.origem = origem;

    if (senha) {
      const senhaCriptografada = await bcrypt.hash(senha, 8);
      atualizacoes.senha = senhaCriptografada;
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, atualizacoes, { new: true });

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // ⚡ SE o admin virar TRUE, cria ou atualiza o vendedor
    if (usuarioAtualizado.admin === true) {
      const vendedorExistente = await Vendedor.findOne({ usuarioId: id });

      if (!vendedorExistente) {
        await Vendedor.create({
          usuarioId: id,
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email
        });
      } else {
        // Atualiza nome/email caso mudem
        await Vendedor.updateOne(
          { usuarioId: id },
          { nome: usuarioAtualizado.nome, email: usuarioAtualizado.email }
        );
      }
    } else {
      await Vendedor.deleteOne({ usuarioId: id });
    }

    res.json({
      message: "Usuário atualizado com sucesso!",
      usuarioAtualizado
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar o usuário." });
  }
});



//Rota de deletar usuario
app.delete('/clientes/:id', async (req, res) => {
    
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

// ---------------------------------------------------------- Rotas de produto --------------------------------------------------------

app.post('/novoProduto', async (req, res) => {

  try {
    
    const { produto, valor, estoque } = req.body;

    //Busca Produtos com o mesmo nome
    const produtoExistente = await Produto.findOne({ produto });
    if (produtoExistente) {

      produtoExistente.estoque += estoque;
      await produtoExistente.save();
      return res.status(200).json({ message: "Estoque atualizado com sucesso", produto: produtoExistente })

    };

    const novoProduto = new Produto({
      produto,
      valor,
      estoque
    });
    await novoProduto.save();

    return res.status(201).json({ message: "Produto cadastrado com sucesso", produto: novoProduto })

  } catch (err) {
    return res.status(500).json({ message: "Erro ao cadastrar novo produto"})    
  }

});

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find()
    res.json(produtos)
  } catch (err) {
    return res.status(500).json({message: "Erro ao buscar produtos"})
}

})


app.get('/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findById(id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.json({ produto });

  } catch (err) {
    return res.status(500).json({ message: "Erro ao buscar produto", erro: err.message });
  }
});


app.delete('/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const produtoDeletado = await Produto.findByIdAndDelete(id);

    if (!produtoDeletado) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.json({ message: "Produto deletado com sucesso", produtoDeletado });

  } catch (err) {
    return res.status(500).json({ message: "Erro ao deletar produto", erro: err.message });
  }
});






app.put('/editarProduto/:id', async (req, res) => {

  try {

    const { id } = req.params
    const { produto, valor, estoque} = req.body

    const atualizacoes = {}
    
    if (produto) atualizacoes.produto = produto
    if (valor) atualizacoes.valor = valor
    if (estoque) atualizacoes.estoque = estoque

    const produtoAtualizado = await Produto.findByIdAndUpdate(id, atualizacoes, {new: true})

    if (!produtoAtualizado){
      return res.status(404).json({message: "Produto não econtrado", produtoAtualizado})
    }

    res.json({ message: "Produto atualizado com sucesso", produtoAtualizado });

  } catch (err) {
    
    return res.status(500).json({message: "Erro ao atualizar produto"})

  }

  


})



















// ----------------------------------------------------------------- Rotas Vendas -----------------------------------------------------------

//Cadastro de nova venda
app.post('/novaVenda', async (req, res) => {
  try {
    const { cliente, produto, valor, vendedor, pagMetodo } = req.body;

    const novaVenda = new Venda({
      cliente,
      produto,
      valor,
      vendedor,
      pagMetodo
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
    .populate('vendedor', 'nome email')
    .populate('cliente', 'nome email');

    res.json(vendas);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    res.status(500).json({ message: "Erro ao buscar vendas" });
  }
});

app.get('/vendas/:id', async (req, res) => {
  
  const { id } = req.params;
  console.log("🧩 ID recebido:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  try {
    const venda = await Venda.findById(id);
    if (!venda) return res.status(404).json({ mensagem: 'Venda não encontrado' });
    res.json(venda);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar venda', erro: err.message });
  }

});

//Rota de edição de vendas
app.put('/vendas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, produto, valor, vendedor } = req.body;

    const atualizacoes = {};
    if (produto) atualizacoes.produto = produto;
    if (valor !== undefined) atualizacoes.valor = valor;
    if (vendedor) atualizacoes.vendedor = vendedor;
    if (cliente) atualizacoes.cliente = cliente

    const vendaAtualizada = await Venda.findByIdAndUpdate(id, atualizacoes, {
      new: true
    });

    if (!vendaAtualizada){
      return res.status(404).json({ message: "Venda não encontrada" });
    }

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
app.get('/faturamento-mensal', async (req, res) => {
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
