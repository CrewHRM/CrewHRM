import React, { createContext } from "react";
import { Popup } from "../popup/index.jsx";

export const ContextModal = createContext();

export function Modal(props) {
	const {
		trigger,
		children,
		nested = false,
		open = true,
		closeOnDocumentClick=true,
		onClose = () => {},
		style: cssStyle={}
	} = props;

	return <Popup
		on={[]}
		open={open}
		darken={true}
		arrow={false}
		nested={nested}
		closeOnDocumentClick={closeOnDocumentClick}
		trigger={trigger}
		onClose={onClose}
		lockScroll={true}
		contentStyle={{...cssStyle}}>
			{close=><ContextModal.Provider value={{close: ()=>close()}}>
				{children}
			</ContextModal.Provider>}
    </Popup>	
}