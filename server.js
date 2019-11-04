const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('Connected!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Connected on port ${PORT}`);
});
