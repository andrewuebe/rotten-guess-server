import http from 'http';
import App from '../app';
import config from '../config';
import { initSocket } from '../socket';
import logger from '../config/logger';

const app = new App();
const { expressApp } = app;

const port = ((val) => {
  if (Number.isNaN(val)) {
    return val;
  }
  return val;
})(config.port);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

expressApp.set('port', port);

app.on('ready', async () => {
  // Create HTTP server..
  const server = http.createServer(expressApp);

  // Create Socket.IO server
  const io = initSocket(server);

  // Listen on provided port, on all network interfaces.
  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string'
      ? `pipe ${address}`
      : `port ${address?.port}`;
    logger.info(`The server started, listening on port ${bind}`);
  });
});

((async () => {
  await app.init();
})());
