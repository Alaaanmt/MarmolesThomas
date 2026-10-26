import express from 'express';
import path from 'node:path';
import router from './routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const legacyUploadDir = path.resolve(__dirname, '../uploads');

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(legacyUploadDir));
app.use(router);

app.listen(PORT, () => {
  console.log(`API ejecutándose en el puerto ${PORT}`);
});