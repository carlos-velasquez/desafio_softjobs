const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'asterisco',
    database: 'softjobs',
    allowExitOnIdle: true
});



const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol, lenguage];
    const consulta = "INSERT INTO usuarios VALUES(DEFAULT, $1, $2, $3, $4)";
    await pool.query(consulta, values);

    /*const { email, password, rol, lenguage } = usuario;
    const consulta = "INSERT INTO usuarios VALUES(DEFAULT, $1, $2, $3, $4)";
    const values = [email, password, rol, lenguage];
    await pool.query(consulta, values);*/
}

const verificarCredenciales = async (email, password) => {
    /*const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2";
    const values = [email, password];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount)
        throw { code: 404, message: "no se encontro usuarios con estas crdenciales"};*/

    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";

    const { rows: [usuarios], rowCount } = await pool.query(consulta, values);

    const { password: passwordEncriptada } = usuarios;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta || !rowCount)
        throw { code:401, message: "email o contraseña incorrecta"};
}

const datosUsuario = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows: [usuario] } = await pool.query(consulta, values);
    return usuario;

    /*const { rows: usuario } = await pool.query("SELECT * FROM usuarios");
    return usuario;*/
}

module.exports = { registrarUsuario, verificarCredenciales, datosUsuario }