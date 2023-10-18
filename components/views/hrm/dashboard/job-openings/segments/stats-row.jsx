import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';

function HorizontalOverflow({children}) {
	const refWrapper = useRef();
	const refContent = useRef();
	
	const [state, setState] = useState({
		slide_left: 0,
		show_left: null,
		show_right: null,
	});

	const [showControl, setControl] = useState(false);

	const determineControl=()=>{
		setState({
			...state,
			slide_left: 0,
			show_right: refContent.current.offsetWidth > refWrapper.current.offsetWidth
		});
	}

	const slide=(go_next)=>{
		let left = state.slide_left;

		if ( go_next ) {
			let available = refContent.current.offsetWidth-left;
			let remaining = available - refWrapper.current.offsetWidth;

			if ( remaining <= 0  ) {
				remaining = 0;
			}
			
			remaining = remaining > refWrapper.current.offsetWidth ? refWrapper.current.offsetWidth : refWrapper.current.offsetWidth - (refWrapper.current.offsetWidth - remaining);
			left = left + remaining;

		} else {
			if ( left > refWrapper.current.offsetWidth ) {
				left = left - refWrapper.current.offsetWidth;
			} else {
				left = 0;
			}
		}

		setState({
			...state,
			slide_left: left,
			show_left: left>0,
			show_right: (refContent.current.offsetWidth - left)>refWrapper.current.offsetWidth
		});
	}
	
	useEffect(()=>{
		determineControl();
		window.addEventListener('resize', determineControl);
		return ()=>window.removeEventListener('resize', determineControl);
	}, [refWrapper, refContent]);

	function Control({left}) {
		return <Conditional show={showControl && ((left && state.show_left) || (!left && state.show_right))}>
			<div
				className={`position-absolute d-flex align-items-center cursor-pointer padding-horizontal-8 top-0 bottom-0 ${left ? 'left-0' : 'right-0'}`.classNames()}
				onClick={()=>slide(left ? false : true)}
				style={{
					zIndex: 1,
					backgroundImage: `linear-gradient(to ${left ? 'left' : 'right'}, transparent, lightgray)`
				}}
			>
				<i className={`ch-icon ${left ? 'ch-icon-arrow-left-2' : 'ch-icon-arrow-right-2'} font-size-17`.classNames()}></i>
			</div>
		</Conditional>
	}

	return <div
		onMouseOver={()=>setControl(true)} 
		onMouseOut={()=>setControl(false)}
		className={'overflow-hidden w-full position-relative'.classNames()}
		ref={refWrapper}
	>
		<Control left={true}/>
		<div 
			className={'position-relative'.classNames()} 
			style={{
				width:'3000px', 
				left: -(state.slide_left)+'px', 
				transition: 'left 0.3s' 
			}} 
		>
			<div className={'d-inline-block'.classNames()} ref={refContent}>
				{children}
			</div>
		</div>
		<Control left={false}/>
	</div>
}

export function StatsRow({ stats }) {

    return <HorizontalOverflow>
		<div 
			className={'d-flex align-items-center column-gap-27 justify-content-space-between padding-vertical-15 padding-horizontal-20'.classNames()}
		>
			{stats.map(({ key, label, content }, index) => {
				let is_last = index == stats.length - 1;
				return [
					<div key={key} style={!is_last ? {} : { paddingRight: '20px' }}>
						<div>
							<span
								className={'d-block color-text-light font-size-14 font-weight-400 margin-bottom-7 white-space-nowrap'.classNames()}
							>
								{label}
							</span>
							<span className={'d-block color-text font-size-17 font-weight-600'}>
								{content}
							</span>
						</div>
					</div>,
					!is_last ? <Line key={key + '_separator'} orientation="vertical" /> : null
				];
			})}
		</div>
	</HorizontalOverflow> 
}
