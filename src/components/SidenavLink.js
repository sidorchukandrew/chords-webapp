import { Link, useRouteMatch } from "react-router-dom";

import PropTypes from "prop-types";

export default function SidenavLink({ text, to, icon, exact }) {
	let isCurrentRoute = useRouteMatch({
		path: to,
		exact: exact,
	});

	return (
		<Link
			to={to}
			className={`flex items-center rounded py-2 px-3 w-full my-0.5 font-semibold transition-all ${
				isCurrentRoute ? "bg-gray-200 text-gray-700 rounded" : "text-gray-500"
			}`}
		>
			<span className="mr-3">{icon}</span> {text}
		</Link>
	);
}

SidenavLink.propTypes = {
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};

SidenavLink.defaultProps = {
	exact: false,
};
