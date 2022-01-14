import { app } from './app';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import { testMain } from './main';

testMain();

const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({ origin: true }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// add all api routes
app.use('/api/v1', routes);

app.get('/', (req, res) => {
	res.json({ x: Math.random() });
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});