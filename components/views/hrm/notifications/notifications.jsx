import React, {useState} from "react";
import { DropDownUnmanaged } from "../../../materials/dropdown/dropdown.jsx";
import { IconNotification } from "../../../materials/dynamic-svg/icon-notification.jsx";
import { IconNotificationHasUpdate } from "../../../materials/dynamic-svg/icon-notification-has-update.jsx";
import { IconEmail } from "../../../materials/dynamic-svg/icon-email.jsx";
import { IconEmailHasUpdate } from "../../../materials/dynamic-svg/icon-email-has-update.jsx";

export function NotificationsEmail() {
	const [state, setState] = useState({
		emails: []
	});

	const renderModal=()=>{

	}

	const unopened_count = 1; // state.emails.filter(n=>!c.opened_at).length;
	const unread_count   = state.emails.filter(n=>!c.read_at).length;

	return <DropDownUnmanaged rendered={renderModal()}>
		<div className={'d-flex align-items-center cursor-pointer'.classNames()}>
			{unopened_count && <IconEmailHasUpdate/> || <IconEmail/>}
			<span className={'d-inline-block margin-left-5 font-size-14 font-weight-500 letter-spacing--3 color-text-light'.classNames()}>
				({!unopened_count ? 0 : unopened_count.toString().padStart(2, '0')})
			</span>
		</div>
	</DropDownUnmanaged>
}

export function NotificationsOnSite() {
	const [state, setState] = useState({
		notifications: []
	});

	const renderModal=()=>{

	}

	const unopened_count = 1; // state.notifications.filter(n=>!c.opened_at).length;
	const unread_count   = state.notifications.filter(n=>!c.read_at).length;

	return <DropDownUnmanaged rendered={renderModal()}>
		<div className={'d-flex align-items-center cursor-pointer'.classNames()}>
			{unopened_count && <IconNotificationHasUpdate/> || <IconNotification/>}
			<span className={'d-inline-block margin-left-5 font-size-14 font-weight-500 letter-spacing--3 color-text-light'.classNames()}>
				({!unopened_count ? 0 : unopened_count.toString().padStart(2, '0')})
			</span>
		</div>
	</DropDownUnmanaged>
}
