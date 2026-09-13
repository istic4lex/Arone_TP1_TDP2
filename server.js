const http = require('http');
const fs = require('fs');
const url = require('url');


let conceptos = [];
let nextId = 1;

const servidor = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile('web.html', (err, data) => {
            if (err) { res.writeHead(500); return res.end('Error cargando el formulario.'); }
            res.end(data);
        });
    } 

    else if (req.method === 'GET' && pathname === '/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.readFile('styles.css', (err, data) => {
            if (err) { res.writeHead(500); return res.end('Error cargando CSS.'); }
            res.end(data);
        });
    }

    else if (req.method === 'GET' && pathname === '/app.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        fs.readFile('app.js', (err, data) => {
            if (err) { res.writeHead(500); return res.end('Error cargando JS.'); }
            res.end(data);
        });
    }

    else if (req.method === 'GET' && pathname === '/api/conceptos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(conceptos));
    }

    else if (req.method === 'GET' && pathname.startsWith('/api/conceptos/')) {
        const id = parseInt(pathname.slice(16));
        if (!isNaN(id)) {
            const concepto = conceptos.find(item => item.id === id);
            if (concepto) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(concepto));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Concepto no encontrado.' }));
            }
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID inválido.' }));
        }
    }

    else if (req.method === 'POST' && pathname === '/api/conceptos') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        
        req.on('end', () => {
            try {
                const nuevoConcepto = JSON.parse(body);
                nuevoConcepto.id = nextId++; 
                conceptos.push(nuevoConcepto);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Concepto agregado', concepto: nuevoConcepto }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error en el formato JSON.' }));
            }
        });
    }

    else if (req.method === 'DELETE' && pathname === '/api/conceptos') {
        conceptos = [];
        nextId = 1; 
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Todos los conceptos fueron eliminados.' }));
    }

    else if (req.method === 'DELETE' && pathname.startsWith('/api/conceptos/')) {
        const id = parseInt(pathname.slice(16));
        const indice = conceptos.findIndex(c => c.id === id);

        if (indice !== -1) {
            const eliminado = conceptos.splice(indice, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Concepto eliminado', concepto: eliminado[0] }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Concepto no encontrado.' }));
        }
    }


    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada.');
    }
});

const PUERTO = 3000;
servidor.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});