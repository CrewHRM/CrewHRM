import React from 'react';
import { __, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import img from 'crewhrm-materials/static/images/thank-you.png';

import style from './applied.module.scss';

export function Applied({ error_message, social_links=[] }) {
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

							{
								isEmpty(social_links) ? null : 
								<div className={'margin-top-20 d-flex align-items-center column-gap-20'.classNames()}>
									{
										social_links.map(link=>{

											const {url, icon} = link;

											return <a 
												key={url} 
												href={url} 
												target='_blank'
												className={'font-size-16 cursor-pointer'.classNames()}
											>
												<i className={icon.classNames()}></i>
											</a>
										})
									}
								</div>
							}
						</div>
					</div>
				</div>
            </Conditional>
        </div>
    );
}
