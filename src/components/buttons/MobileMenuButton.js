import { TEXT_COLORS } from "../Button";

export default function MobileMenuButton({ children, onClick, full, color }) {
	let classes =
		" font-semibold outline-none focus:outline-none hover:bg-gray-100 focus:bg-gray-100 py-3 px-6 text-sm transition-colors ";
	let widthClasses = full ? " w-full " : "";
	let colorClasses = `${TEXT_COLORS[color]} `;

	classes += widthClasses;
	classes += colorClasses;
	return (
		<button onClick={onClick} className={classes}>
			{children}
		</button>
	);
}

MobileMenuButton.defaultProps = {
	color: "black",
};
