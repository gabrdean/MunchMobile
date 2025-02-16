import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useEffect } from 'react';
import './Footer.css';

export default function Footer() {
	// const navigate = useNavigate();
	// const user = useSelector((store) => store.session.user);

	// useEffect(() => {
	// 	if (!user) {
	// 		navigate('/');
	// 	}
	// }, [user, navigate]);

	return (
		<>
			<div id='footer'>
				<div id='footer-logo'>
					<Link exact to='/signup'>
						<div id='footer-logo-text'>NomNow</div>
					</Link>
				</div>

				<div className='footer-right'>
					<div className='footer-contact'>
						<div className='footer-name'>
							<a
								href='https://heykatie.github.io/'
								target='_blank'
								rel='noopener noreferrer'>
								<div>Gabriel Dean</div>
							</a>
							<div className='footer-links'>
								<a
									href='https://www.linkedin.com/in/gabriel-dean'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-linkedin'></i>
								</a>
								<a
									href='https://github.com/gabrdean'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-github'></i>
								</a>
							</div>
						</div>

						<div className='footer-name'>
							<a
								href='https://heykatie.github.io/'
								target='_blank'
								rel='noopener noreferrer'>
								<div>Burak Ozdemir</div>
							</a>
							<div className='footer-links'>
								<a
									href='https://www.linkedin.com/in/burak-%C3%B6zdemir-64a2a9317/'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-linkedin'></i>
								</a>
								<a
									href='https://github.com/burakoncuy'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-github'></i>
								</a>
							</div>
						</div>

						<div className='footer-name'>
							<a
								href='https://heykatie.github.io/'
								target='_blank'
								rel='noopener noreferrer'>
								<div>Samai Althiabat</div>
							</a>
							<div className='footer-links'>
								<a
									href='https://www.linkedin.com/in/samai-althiabat'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-linkedin'></i>
								</a>
								<a
									href='https://github.com/SamaAlt'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-github'></i>
								</a>
							</div>
						</div>

						<div className='footer-name'>
							<a
								href='https://heykatie.github.io/'
								target='_blank'
								rel='noopener noreferrer'>
								<div>Katie Leong</div>
							</a>
							<div className='footer-links'>
								<a
									href='https://www.linkedin.com/in/katieleonght/'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-linkedin'></i>
								</a>
								<a
									href='https://github.com/heykatie'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-github'></i>
								</a>
							</div>
						</div>

						<div className='footer-name'>
							<a
								href='https://mcode4.github.io/'
								target='_blank'
								rel='noopener noreferrer'>
								<div>Marcelle Armstrong</div>
							</a>
							<div className='footer-links'>
								<a
									href='https://www.linkedin.com/in/marcellies-armstrong/'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-linkedin'></i>
								</a>
								<a
									href='https://github.com/Mcode4'
									target='_blank'
									rel='noopener noreferrer'>
									<i className='fa-brands fa-github'></i>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id='footer-copyright'>@ 2025 NomNow</div>
		</>
	);
}
