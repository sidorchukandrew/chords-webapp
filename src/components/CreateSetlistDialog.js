import { useEffect, useRef, useState } from "react";

import AddCancelActions from "./buttons/AddCancelActions";
import OutlinedInput from "./inputs/OutlinedInput";
import PropTypes from "prop-types";
import SetlistApi from "../api/SetlistApi";
import StyledDialog from "./StyledDialog";
import { reportError } from "../utils/error";

export default function CreateSetlistDialog({ open, onCloseDialog, onCreated }) {
	const [name, setName] = useState("");
	const [scheduledDate, setScheduledDate] = useState("");
	const [loading, setLoading] = useState(false);
	const inputRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			if (open) {
				inputRef.current?.focus();
			}
		}, 100);
	}, [open]);

	const isDateValid = () => {
		let dateToValidate = new Date(scheduledDate);
		return !isNaN(dateToValidate);
	};

	const canCreate = name && isDateValid();

	const handleCreateSetlist = async () => {
		setLoading(true);
		try {
			let isoScheduledDate = new Date(scheduledDate).toISOString();
			let { data } = await SetlistApi.createOne({ name, scheduledDate: isoScheduledDate });
			onCreated(data);
			handleCloseDialog();
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	};

	const clearFields = () => {
		setLoading(false);
		setName("");
		setScheduledDate("");
	};

	const handleCloseDialog = () => {
		clearFields();
		onCloseDialog();
	};

	return (
		<StyledDialog title="Create a set" open={open} onCloseDialog={handleCloseDialog}>
			<div className="mb-4">
				<OutlinedInput
					label="Name"
					placeholder="Give your set a name"
					value={name}
					onChange={setName}
					ref={inputRef}
				/>
			</div>

			<div className="mb-4">
				<OutlinedInput
					type="date"
					onChange={setScheduledDate}
					value={scheduledDate}
					label="Scheduled date"
					className="h-10"
				/>
			</div>
			<AddCancelActions
				onCancel={handleCloseDialog}
				addText="Create"
				addDisabled={!canCreate}
				onAdd={handleCreateSetlist}
				loadingAdd={loading}
			/>
		</StyledDialog>
	);
}

CreateSetlistDialog.propTypes = {
	onCreated: PropTypes.func.isRequired,
};
