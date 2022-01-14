import express from 'express';
import { testMain } from './main';

testMain();

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
	res.json({ x: 5 });
});

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`);
});