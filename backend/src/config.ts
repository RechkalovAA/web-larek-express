const parsedPort = Number(process.env.PORT);

export const PORT = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

export const MONGODB_URI = process.env.DB_ADDRESS ?? 'mongodb://127.0.0.1:27017/weblarek';
