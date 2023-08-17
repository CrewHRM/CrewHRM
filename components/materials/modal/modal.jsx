import React, { createContext } from "react";
import { Popup } from "../popup/index.jsx";

export const ContextModal = createContext();

export function Modal(props) {
	const {
		trigger,
		children,
		open = true,
		onClose = () => {},
		style: cssStyle={}
	} = props;

	return <Popup
		on={[]}
		open={open}
		darken={true}
		arrow={false}
		trigger={trigger}
		onClose={onClose}
		contentStyle={{...cssStyle}}>
			{close=><ContextModal.Provider value={{close}}>
				{children}
			</ContextModal.Provider>}
    </Popup>	
}