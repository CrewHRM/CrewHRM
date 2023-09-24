import React from 'react';
import { DoAction } from '../utilities/hooks.jsx';
import { ToastWrapper } from './toast/toast.jsx';
import { WarningWrapper } from './warning/warning.jsx';

export function MountPoint({ children }) {
	return (
		<div data-crewhrm-selector="root" className={'root margin-bottom-15'.classNames()}>
			<ToastWrapper>
				<WarningWrapper>{children}</WarningWrapper>
			</ToastWrapper>
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
