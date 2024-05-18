import React from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import CrewHrmLogo from 'crewhrm-materials/static/images/crew-hrm-logo.png';
import Congrats from 'crewhrm-materials/static/images/thank-you.png';

import AddEmployeeCss from './AddManually.module.scss';

export default function CongratsAddEmployee() {
	return (
		<div style={{ backgroundColor: '#fff', height: '110vh', padding: '40px 0px 40px', marginTop: '-40px' }}>
			<div
				className={
					'container'.classNames(AddEmployeeCss) +
					'd-flex justify-content-space-between margin-top-40'.classNames()
				}
			>
				<div className={'font-size-24 font-weight-600 color-text'.classNames()}>
					<img src={CrewHrmLogo} alt="" />
				</div>
				<div
					className={
						'complete-progressbar'.classNames(AddEmployeeCss) +
						'd-flex align-items-center font-size-15 line-height-20 font-weight-500 color-text'.classNames()
					}
				>
					<span>5</span>/<span>5</span>
					<span className={'margin-left-4'.classNames()}>completed</span>
					<span
						className={
							'complete-progressbar-bar'.classNames(AddEmployeeCss) + 'margin-left-10'.classNames()
						}
					>
						<span
							style={{ width: `${(60 / 5) * (4 + 1)}px` }}
							className={`upgradeable-progressbar-bar ${4}`.classNames(AddEmployeeCss)}
						></span>
					</span>
				</div>
			</div>
			<div
				className={'d-flex flex-direction-column align-items-center margin-top-40'.classNames()}
				style={{ maxWidth: '500px', paddingTop: '124px', margin: '0 auto' }}
			>
				<img src={Congrats} alt="" />
				<div
					className={'color-text line-height-40 font-weight-600 margin-top-30 text-align-center'.classNames()}
					style={{ fontSize: '36px' }}
				>
					{__('Congratulations! A new employee has been added successfully.')}
				</div>
				<div
					className={'font-size-17 line-height-28 font-weight-400 margin-top-8'.classNames()}
					style={{ color: '#72777B' }}
				>
					{__('You can manage information later.')}
				</div>

				<div
					className={'font-size-15 line-height-20 font-weight-400 margin-top-20'.classNames()}
					style={{ color: '#72777B' }}
				>
					{__('Waiting for a moment as we redirect your request..')}
				</div>
			</div>
		</div>
	);
}
