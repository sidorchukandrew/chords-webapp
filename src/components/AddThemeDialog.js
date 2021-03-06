import { useEffect, useState } from "react";

import AddCancelActions from "./buttons/AddCancelActions";
import FixedBottomMobile from "./FixedBottomMobile";
import Label from "./Label";
import NoDataMessage from "./NoDataMessage";
import OrDivider from "./OrDivider";
import OutlinedInput from "./inputs/OutlinedInput";
import SongApi from "../api/SongApi";
import StyledDialog from "./StyledDialog";
import ThemeApi from "../api/ThemeApi";
import ThemeOptions from "./ThemeOptions";
import { reportError } from "../utils/error";

export default function AddThemeDialog({ open, onCloseDialog, currentSong, onThemesAdded }) {
	const [availableThemes, setAvailableThemes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const [newTheme, setNewTheme] = useState("");
	const [themesToAdd, setThemesToAdd] = useState([]);
	const [savingAdditions, setSavingAdditions] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		async function fetchThemes() {
			setLoading(true);
			try {
				let { data } = await ThemeApi.getAll();

				let availableThemes = [];

				data?.forEach((possiblyAvailableTheme) => {
					let index = currentSong.themes?.findIndex(
						(alreadyBoundTheme) => alreadyBoundTheme.id === possiblyAvailableTheme.id
					);

					if (index === -1) {
						availableThemes.push(possiblyAvailableTheme);
					}
				});

				setAvailableThemes(availableThemes);
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		if (open) {
			fetchThemes();
		}
	}, [open, currentSong]);

	const handleCreateTheme = async () => {
		setCreating(true);
		try {
			let { data } = await ThemeApi.createOne({ name: newTheme });
			setNewTheme("");
			setAvailableThemes([...availableThemes, data]);
		} catch (error) {
			reportError(error);
		} finally {
			setCreating(false);
		}
	};

	const handleSaveThemes = async () => {
		setSavingAdditions(true);
		try {
			let idsToAdd = themesToAdd.map((theme) => theme.id);
			let result = await SongApi.addThemes(currentSong.id, idsToAdd);
			onThemesAdded(result.data);
			handleClose();
		} catch (error) {
			reportError(error);
		} finally {
			setSavingAdditions(false);
		}
	};

	const handleClose = () => {
		setNewTheme("");
		setAvailableThemes([]);
		setThemesToAdd([]);
		setCreating(false);
		setLoading(false);
		setSavingAdditions(false);
		setSearchTerm("");
		onCloseDialog();
	};

	const handleThemeToggled = (checked, theme) => {
		if (checked) {
			setThemesToAdd([...themesToAdd, theme]);
		} else {
			let updatedThemes = themesToAdd.filter((addedTheme) => addedTheme !== theme);
			setThemesToAdd(updatedThemes);
		}
	};

	const filterAvailableThemes = () => {
		return availableThemes.filter((theme) =>
			theme.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	return (
		<StyledDialog open={open} onCloseDialog={handleClose} title="Add themes" size="xl">
			<Label>Add an existing theme</Label>
			<OutlinedInput placeholder="Search" value={searchTerm} onChange={setSearchTerm} />
			{availableThemes.length === 0 ? (
				<div className="py-4">
					<NoDataMessage loading={loading}>You haven't created any themes yet</NoDataMessage>
				</div>
			) : (
				<ThemeOptions
					themes={filterAvailableThemes()}
					onToggle={handleThemeToggled}
					selectedThemes={themesToAdd}
				/>
			)}

			<OrDivider />
			<div className="pb-4">
				<OutlinedInput
					placeholder="Ex: love, loss, hope"
					onChange={setNewTheme}
					label="Add a new theme"
					button="Create"
					value={newTheme}
					buttonLoading={creating}
					onButtonClick={handleCreateTheme}
				/>
			</div>

			<FixedBottomMobile>
				<AddCancelActions
					onCancel={handleClose}
					onAdd={handleSaveThemes}
					loadingAdd={savingAdditions}
					addDisabled={themesToAdd?.length === 0}
				/>
			</FixedBottomMobile>
		</StyledDialog>
	);
}
