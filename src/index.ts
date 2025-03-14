import { startServer } from './server.js';

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Iniciar el servidor
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
