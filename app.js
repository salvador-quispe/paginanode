const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

const ip = 'localhost';
const port = 3000;

// Configuración de la conexión a la base de datos (para ambas bases)
const pool = mysql.createPool({
    host: 'calendarioymas.cl4ameyi8vh6.us-east-1.rds.amazonaws.com', // El host sigue siendo el mismo
    user: 'admin',
    password: '15423803salvador',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'Inicio.html'));
});

// Ruta para el formulario de contacto
app.post('/submit-form', (req, res) => {
    const { nombre, apellidos, celular, gmail, descripcion } = req.body;

    // Cambiar a la base de datos 'consultas'
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener conexión:', err.stack);
            res.status(500).send('Ocurrió un error al procesar tu consulta.');
            return;
        }

        connection.changeUser({ database: 'consultas' }, (err) => {
            if (err) {
                console.error('Error al cambiar a la base de datos consultas:', err.stack);
                connection.release();
                res.status(500).send('Ocurrió un error al procesar tu consulta.');
                return;
            }

            const query = 'INSERT INTO Contactanos (nombre, apellidos, celular, gmail, descripcion) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [nombre, apellidos, celular, gmail, descripcion], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos en Contactanos: ' + err.stack);
                    res.status(500).send('Ocurrió un error al procesar tu consulta.');
                } else {
                    // Redirige a la página de inicio después de enviar el formulario
                    res.redirect('/');
                }
                connection.release();
            });
        });
    });
});

// Ruta para obtener el evento más cercano
app.get('/api/evento', (req, res) => {
    // Cambiar a la base de datos 'calendario'
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener conexión:', err.stack);
            res.status(500).send('Ocurrió un error al obtener el evento.');
            return;
        }

        connection.changeUser({ database: 'calendario' }, (err) => {
            if (err) {
                console.error('Error al cambiar a la base de datos calendario:', err.stack);
                connection.release();
                res.status(500).send('Ocurrió un error al obtener el evento.');
                return;
            }

            const query = 'SELECT * FROM Calendario ORDER BY fecha LIMIT 1';
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error al obtener el evento: ' + err.stack);
                    res.status(500).send('Ocurrió un error al obtener el evento.');
                } else {
                    if (results.length > 0) {
                        const evento = results[0];
                        const fechaEvento = new Date(evento.fecha);

                        if (isNaN(fechaEvento.getTime())) {
                            console.error('Fecha inválida:', evento.fecha);
                            res.status(400).send('Fecha del evento inválida.');
                        } else {
                            res.json({
                                ...evento,
                                fecha: fechaEvento.toISOString().split('T')[0],
                            });
                        }
                    } else {
                        res.json(null);
                    }
                }
                connection.release();
            });
        });
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});
