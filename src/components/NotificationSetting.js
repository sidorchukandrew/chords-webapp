import ChatIcon from "@heroicons/react/outline/ChatIcon";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import MailIcon from "@heroicons/react/outline/MailIcon";
import Toggle from "./Toggle";
import { noop } from "../utils/constants";
import settingsApi from "../api/settingsApi";
import { useState } from "react";

export default function NotificationSetting({ onChange, setting, icon }) {
	const [open, setOpen] = useState(false);

	function handleToggleOpen() {
		setOpen((currentValue) => !currentValue);
	}

	function handleToggleSms() {
		let newValue = !setting.sms_enabled;
		onChange({ ...setting, sms_enabled: newValue });
		sendUpdateRequest({ sms_enabled: newValue });
	}

	function handleToggleEmail() {
		let newValue = !setting.email_enabled;
		onChange({ ...setting, email_enabled: newValue });
		sendUpdateRequest({ email_enabled: newValue });
	}

	async function sendUpdateRequest(updates) {
		try {
			await settingsApi.updateNotificationSetting(setting.id, updates);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<div
				className="hover:bg-gray-100 transition-colors rounded-md p-2 cursor-pointer"
				onClick={handleToggleOpen}
			>
				<div className="flex-between">
					<div className="font-semibold text-xl flex items-center gap-2">
						{icon} {setting?.notification_type}
					</div>
					<ChevronDownIcon
						className={
							`w-4 h-4 text-gray-600 transition-transform transform ` +
							` ${open ? "rotate-180" : ""}`
						}
					/>
				</div>
			</div>
			<div className={`mt-2 transition-all ${open ? "block" : "hidden"}`}>
				<div
					className="hover:bg-gray-100 transition-colors rounded-sm cursor-pointer p-2 flex-between border-b"
					onClick={handleToggleEmail}
				>
					<div className="flex items-center gap-2">
						<MailIcon className="w-5 h-5 text-gray-700" />
						Email
					</div>
					<Toggle enabled={setting?.email_enabled} onChange={noop} />
				</div>
				<div
					className="hover:bg-gray-100 transition-colors rounded-sm cursor-pointer p-2 flex-between"
					onClick={handleToggleSms}
				>
					<div className="flex items-center gap-2">
						<ChatIcon className="w-5 h-5 text-gray-700" /> Text message
					</div>
					<Toggle enabled={setting?.sms_enabled} onChange={noop} />
				</div>
			</div>
		</div>
	);
}