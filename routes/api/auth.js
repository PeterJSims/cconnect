const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get('/', auth, async (req, res) => {
	try {
		//.select can help keep you from returning private things like passwords.
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
});

//@route    POST api/auth
//@desc     Authenticate user and get token
//@access   Public
router.post(
	'/',
	[
		check('email', 'Email is a required field').isEmail(),
		check('password', 'Password is a required field').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			//Grab user by email
			let user = await User.findOne({ email });
			//Check if user already exists
			if (!user) {
				return res.status(400).json({ errors: [ { msg: 'Invalid credentials' } ] });
			}

			//Does encrypted password match plaintext password when encrypted?
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [ { msg: 'Invalid credentials' } ] });
			}

			//Create and return jsonwebtoken
			const payload = {
				user: {
					//Below grabs the _id property from MongoDB via mongoose and simply replaces _id for id.
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				//ten hours below
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
