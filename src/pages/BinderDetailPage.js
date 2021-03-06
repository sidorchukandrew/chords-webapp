import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import BinderApi from "../api/BinderApi";
import BinderColor from "../components/BinderColor";
import BinderOptionsPopover from "../components/BinderOptionsPopover";
import BinderSongsList from "../components/BinderSongsList";
import Button from "../components/Button";
import ColorDialog from "../components/ColorDialog";
import { EDIT_BINDERS } from "../utils/constants";
import EditableData from "../components/inputs/EditableData";
import PageTitle from "../components/PageTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { isEmpty } from "../utils/ObjectUtils";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function BinderDetailPage() {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [binder, setBinder] = useState();
	const [pendingUpdates, setPendingUpdates] = useState({});
	const [saving, setSaving] = useState(false);
	const [songIdsBeingRemoved, setSongIdsBeingRemoved] = useState([]);
	const { id } = useParams();
	const router = useHistory();
	const currentMember = useSelector(selectCurrentMember);

	useEffect(() => {
		async function fetchBinder() {
			try {
				let { data } = await BinderApi.getOneById(id);
				setBinder(data);
			} catch (error) {
				reportError(error);
				if (error?.response?.status === 401) {
					router.push("/login");
				}
			}
		}

		fetchBinder();
	}, [id, router]);

	const handleUpdate = (field, value) => {
		let updates = { ...pendingUpdates };
		updates[field] = value;
		setPendingUpdates(updates);

		let updatedBinder = { ...binder };
		updatedBinder[field] = value;
		setBinder(updatedBinder);
	};

	const handleSaveChanges = async () => {
		setSaving(true);
		try {
			if (!isEmpty(pendingUpdates)) {
				let { data } = await BinderApi.updateOneById(id, pendingUpdates);
				setBinder(data);
				setPendingUpdates({});
			}
		} catch (error) {
			reportError(error);
			if (error?.response?.status === 401) {
				router.push("/login");
			}
		} finally {
			setSaving(false);
		}
	};

	const handleAddSongs = (addedSongs) => {
		setBinder({
			...binder,
			songs: binder.songs.concat(addedSongs),
		});
	};

	const handleRemoveSong = async (songToRemove) => {
		setSongIdsBeingRemoved([...songIdsBeingRemoved, songToRemove.id]);
		try {
			await BinderApi.removeSongs(binder.id, [songToRemove.id]);
			let updatedSongsList = binder.songs?.filter((song) => song.id !== songToRemove.id);
			setBinder({ ...binder, songs: updatedSongsList });

			let updatedIdsBeingRemoved = songIdsBeingRemoved.filter(
				(beingRemoved) => beingRemoved !== songToRemove.id
			);
			setSongIdsBeingRemoved(updatedIdsBeingRemoved);
		} catch (error) {
			reportError(error);
			if (error?.response?.status === 401) {
				router.push("/login");
			}
		}
	};

	if (!binder) {
		return (
			<div className="text-center py-4">
				<PulseLoader color="#1f6feb" />
			</div>
		);
	}

	return (
		<div className="mb-10">
			<div className="flex-center">
				<span className="mr-2 cursor-pointer">
					<BinderColor
						color={binder.color}
						onClick={() => setShowColorPicker(true)}
						editable={currentMember.can(EDIT_BINDERS)}
					/>
					<ColorDialog
						open={showColorPicker}
						onCloseDialog={() => setShowColorPicker(false)}
						binderColor={binder.color}
						onChange={(editedColor) => handleUpdate("color", editedColor)}
					/>
				</span>
				<PageTitle
					title={binder.name}
					editable={currentMember.can(EDIT_BINDERS)}
					onChange={(editedName) => handleUpdate("name", editedName)}
				/>
				{currentMember.can(EDIT_BINDERS) && (
					<BinderOptionsPopover onChangeColorClick={() => setShowColorPicker(true)} />
				)}
			</div>
			<div>
				<EditableData
					placeholder="Add a description for this binder"
					value={binder.description}
					onChange={(editedDescription) => handleUpdate("description", editedDescription)}
					editable={currentMember.can(EDIT_BINDERS)}
				/>
			</div>
			<BinderSongsList
				boundSongs={binder.songs}
				onAdd={handleAddSongs}
				onRemoveSong={handleRemoveSong}
				songsBeingRemoved={songIdsBeingRemoved}
			/>

			{currentMember.can(EDIT_BINDERS) && !isEmpty(pendingUpdates) && (
				<div className="fixed bottom-8 right-8 shadow-md">
					<Button onClick={handleSaveChanges} loading={saving}>
						Save Changes
					</Button>
				</div>
			)}
		</div>
	);
}
