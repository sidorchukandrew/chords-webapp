import Button from "./Button";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import SearchSongsDialog from "./SearchSongsDialog";
import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { useHistory } from "react-router";
import { useState } from "react";

export default function BinderSongsList({ boundSongs, onAdd, onRemoveSong, songsBeingRemoved }) {
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const router = useHistory();

	const handleOpenSong = (songId) => {
		router.push(`/songs/${songId}`);
	};

	return (
		<>
			<div className="sm:block hidden">
				<div className="flex-between mb-2">
					<SectionTitle title="Songs in this binder" />
					<Button
						variant="open"
						size="xs"
						onClick={() => setShowSearchDialog(true)}
						bold
						color="blue"
					>
						Add Songs
					</Button>
				</div>
				{boundSongs?.length > 0 ? (
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
				) : (
					"No songs in this binder yet"
				)}
			</div>

			<div className="sm:hidden">
				<SectionTitle title="Songs in this binder" />
				{boundSongs?.length > 0
					? boundSongs.map((song) => (
							<div
								className="border-b py-2.5 flex-between px-2 last:border-0 cursor-pointer bg-white transition-colors hover:bg-gray-50 focus:bg-gray-50"
								key={song.id}
							>
								<div onClick={() => handleOpenSong(song.id)} className="flex-grow">
									<div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
										{song.name}
									</div>
								</div>
								<Button
									variant="open"
									color="black"
									size="xs"
									onClick={() => onRemoveSong(song)}
									removing={songsBeingRemoved.includes(song.id)}
								>
									<TrashIcon className="h-4 w-4" />
								</Button>
							</div>
					  ))
					: "No songs in this binder yet"}
			</div>

			<SearchSongsDialog
				open={showSearchDialog}
				onCloseDialog={() => setShowSearchDialog(false)}
				onAdd={onAdd}
				boundSongs={boundSongs}
			/>
			<Button
				variant="open"
				className="bg-white fixed bottom-12 left-0 rounded-none flex-center sm:hidden h-12"
				full
				style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
				onClick={() => setShowSearchDialog(true)}
			>
				<PlusCircleIcon className="h-4 w-4 mr-2 text-blue-700" />
				Add more songs
			</Button>
		</>
	);
}
