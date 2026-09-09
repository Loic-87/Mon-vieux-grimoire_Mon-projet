const http = require('http');
const app = require('./app');

// Le front appelle le back sur le port 4000
const port = process.env.PORT || 4000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log('Serveur en ecoute sur le port ' + port);
});
