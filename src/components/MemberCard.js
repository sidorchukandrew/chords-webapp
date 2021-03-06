import Button from "./Button";
import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import EditableData from "./inputs/EditableData";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import UserApi from "../api/UserApi";
import _ from "lodash";
import { reportError } from "../utils/error";
import { useCallback } from "react";

export default function MemberCard({ member, isCurrentUser, onPositionChanged, onShowMemberMenu }) {
	const handlePositionChange = (newPosition) => {
		onPositionChanged(newPosition);
		debounce(newPosition);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce((newPosition) => {
			try {
				UserApi.updateMembership(member.id, { position: newPosition });
			} catch (error) {
				reportError(error);
			}
		}, 1000),
		[]
	);

	if (member) {
		let currentUserBubble;
		if (isCurrentUser) {
			currentUserBubble = (
				<span className="rounded-full px-3 py-0.5 bg-purple-600 text-white text-xs mb-1 inline">
					Me
				</span>
			);
		}

		let teamPosition = null;
		if (isCurrentUser) {
			teamPosition = (
				<EditableData
					value={member.position || ""}
					placeholder="What's your position on the team?"
					centered
					onChange={handlePositionChange}
				/>
			);
		} else {
			teamPosition = <div className="text-sm">{member.position}</div>;
		}
		return (
			<div className="rounded-md bg-gray-50 dark:bg-dark-gray-800 py-3 px-5 text-center flex flex-col relative z-10">
				<Button variant="open" className="absolute right-2 top-2" onClick={onShowMemberMenu}>
					<DotsVerticalIcon className="text-gray-600 h-5" />
				</Button>
				<div className="m-auto w-20 h-20 flex-center">
					<ProfilePicture url={member.image_url} />
				</div>
				<div>{currentUserBubble}</div>
				<div className="font-semibold">
					{member.first_name ? member.first_name + " " + member.last_name : member.email}
				</div>
				{teamPosition}
				<div className="flex-grow"></div>
				<Link to={`/members/${member.id}`}>
					<Button variant="outlined" size="xs" full className="mt-2">
						View profile
					</Button>
				</Link>
			</div>
		);
	} else {
		return null;
	}
}
