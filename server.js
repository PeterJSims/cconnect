const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect MongoDB
connectDB();

//Initialize Middleware

//This is the new way of doing bodyParser import and app.use(bodyParser.json())
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
	res.send('Connected!');
});

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Connected on port ${PORT}`);
});
