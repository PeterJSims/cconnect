import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
	return (
		<section className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1 className="x-large">cConnect</h1>
					<p className="lead">
						Connect with fellow coders to share your work, see theirs, and help each other grow
					</p>
					<div className="buttons">
						<Link to="/register" className="btn btn-primary">
							Sign Up
						</Link>
						<Link to="/login" className="btn btn">
							Login
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Landing;
