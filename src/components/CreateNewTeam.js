import { useState } from "react";
import FilledButton from "./buttons/FilledButton";
import CenteredPage from "./CenteredPage";
import OutlinedInput from "./inputs/OutlinedInput";
import TeamApi from "../api/TeamApi";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { setTeamId } from "../store/authSlice";

export default function CreateNewTeam() {
	const [teamName, setTeamIdName] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useHistory();
	const dispatch = useDispatch();

	const handleCreate = async () => {
		setLoading(!loading);

		try {
			let newTeam = { name: teamName };
			let { data } = await TeamApi.createOne(newTeam);
			dispatch(setTeamId(data.id));
			router.push("/app");
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<CenteredPage>
			<div className="font-bold text-xl mb-6 text-center">Your New Team</div>

			<div className="mb-1 font-semibold text-left">Your team's name</div>
			<OutlinedInput
				placeholder="Name"
				value={teamName}
				onChange={(editedTeamName) => setTeamIdName(editedTeamName)}
			/>

			<div className="mt-6">
				<FilledButton full bold loading={loading} onClick={handleCreate}>
					Create
				</FilledButton>
			</div>
		</CenteredPage>
	);
}