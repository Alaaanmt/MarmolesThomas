import express from 'express';
import path from 'path';
import router from './routes';
import cors from 'cors';
import { uploadDir } from './utils/upload';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use(router);

app.listen(PORT, () => {
  console.log(`API ejecutándose en el puerto ${PORT}`);
});