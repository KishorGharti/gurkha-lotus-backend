import express from 'express'
import router from './routes/auth.routes.js';
import { errorMiddleware } from './middllewares/error.middlewares.js';


const app = express();
app.use(express.json());

app.use('/api/auth', router)

app.use(errorMiddleware)

export default app