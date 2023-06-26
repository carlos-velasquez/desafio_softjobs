const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { registrarUsuario, verificarCredenciales, datosUsuario } = require('./consultas');
const app = express();

app.use(express.json());
app.use(cors());

app.listen(3000, console.log("server up"));

const reportarConsultas = async (req, res, next) => {
    const params = req.params;
    const url = req.url;
    const body = req.body
    console.log(`Hoy ${new Date()} recibimos una consulta en ${url} del usuario ${body.email} con los parametros:`, params);
    next();
}

app.get("/usuarios",reportarConsultas, async (req, res) => {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, "secreto")
    const { email } = jwt.decode(token);
    const datos = await datosUsuario(email);
    res.json(datos)

    /*const usuarios = await datosUsuario();
    res.json(usuarios);*/
})

app.post("/usuarios",reportarConsultas, async (req, res) => {
    try {
        const usuarios = req.body;
        await registrarUsuario(usuarios);
        res.send('usuario registrado con exito');
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

})

app.post("/login",reportarConsultas, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, "secreto");
        res.send(token);
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

})