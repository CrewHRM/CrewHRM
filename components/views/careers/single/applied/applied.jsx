import React from 'react';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import img from 'crewhrm-materials/static/images/thank-you.png';

import style from './applied.module.scss';

export function Applied({ error_message }) {
    return (
        <div>
            <Conditional show={error_message}>
                <div className={'text-align-center color-error'.classNames()}>
					{error_message}
				</div>
            </Conditional>

            <Conditional show={!error_message}>
				<div className={'applied'.classNames(style)}>
					<div>
						<img src={img}/>
					</div>
					<div>
						<div>
							<strong className={'d-block margin-bottom-15 font-size-28 font-weight-600 line-height-34 color-text'.classNames()}>
								{__('Thank you for applying to the job!')}
							</strong>
							<span className={'d-block font-size-15 font-weight-400 line-height-20 color-text-light'.classNames()}>
								{__('You will receive a confirmation email as well. Should you have any inquiries or wish to include further details, please do not hesitate to reply to the email.')}
							</span>
						</div>
					</div>
				</div>
            </Conditional>
        </div>
    );
}
