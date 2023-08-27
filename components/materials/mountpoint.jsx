import React, { createContext } from 'react';
import { DoAction } from '../utilities/hooks.jsx';
import { ToastWrapper } from './toast/toast.jsx';

export const ContextNonce = createContext();

export function MountPoint({children, nonce, nonceAction}) {
    return (
        <div data-crewhrm-selector="root" className={'root'.classNames()}>
			<ContextNonce.Provider value={{nonce, nonceAction}}>
	            <ToastWrapper>
					{children}
				</ToastWrapper>
			</ContextNonce.Provider>
        </div>
    );
}

export function Slot(props) {
    const { children, name } = props;

    return (
        <>
            <DoAction position="before" action={name} />
            {children}
            <DoAction position="after" action={name} />
        </>
    );
}
