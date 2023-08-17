import React, { createContext } from "react";
import { DoAction } from "../../utilities/hooks.jsx";
import { ToastWrapper } from "../toast/toast.jsx";

export function MountPoint(props){
	return <div className={'root'.classNames()}>
		<ToastWrapper>
			{props.children}
		</ToastWrapper>
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
