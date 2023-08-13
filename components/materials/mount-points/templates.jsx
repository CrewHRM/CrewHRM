import React from "react";

import { DoAction } from "../../utilities/hooks.jsx";

export function MountPoint(props){
	return <div className={'root'.classNames()}>
		{props.children}
	</div>
}

export function Slot(props) {
	const {children, name} = props;

	return <>
		<DoAction position="before" action={name}/>
		{children}
		<DoAction position="after" action={name}/>
	</>
}
