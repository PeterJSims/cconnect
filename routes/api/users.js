const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
	'/',
	[
		check('name', 'Name is a required field').not().isEmpty(),
		check('email', 'Email is a required field').isEmail(),
		check('password', 'Password must be six or more characters').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			//Grab user by email
			let user = await User.findOne({ email });
			//Check if user already exists
			if (user) {
				return res.status(400).json({ errors: [ { msg: 'User already exists' } ] });
			}
			//Get user's gravatar
			const avatar = gravatar.url(email, {
				//size
				s: '200',
				//rating(g, pg, r,)
				r: 'pg',
				//use simple default blank picture
				d: 'mm'
			});
			user = new User({
				name,
				email,
				avatar,
				password
			});

			//Encrypt password
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			//Save new user to MongoDB
			await user.save();

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
