import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import FilledButton from "./buttons/FilledButton";
import { useState } from "react";
import SearchSongsDialog from "./SearchSongsDialog";
import { useHistory } from "react-router";

export default function BinderSongsList({ boundSongs, onAdd, onRemoveSong, songsBeingRemoved }) {
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const router = useHistory();

	const handleOpenSong = (songId) => {
		router.push(`/app/songs/${songId}`);
	};

	return (
		<>
			<div className="flex justify-between mb-4 items-end">
				<SectionTitle title="Songs in this binder" />
				<FilledButton onClick={() => setShowSearchDialog(true)}>Add Songs</FilledButton>
			</div>
			<table className="w-full">
				<TableHead columns={["NAME", ""]} />

				<tbody>
					{boundSongs?.map((song) => (
						<TableRow
							columns={[song.name]}
							key={song.id}
							onClick={() => handleOpenSong(song.id)}
							removable
							onRemove={() => onRemoveSong(song)}
							removing={songsBeingRemoved.includes(song.id)}
						/>
					))}
				</tbody>
			</table>

			<SearchSongsDialog
				open={showSearchDialog}
				onCloseDialog={() => setShowSearchDialog(false)}
				onAdd={onAdd}
				boundSongs={boundSongs}
			/>
		</>
	);
}