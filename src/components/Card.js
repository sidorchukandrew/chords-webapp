export default function Card({ children, className, onClick }) {
	return (
		<div
			className={`rounded-md bg-gray-100 py-3 px-5 text-center relative ${className}`}
			onClick={onClick}
		>
			{children}
		</div>
	);
}

Card.defaultProps = {
	className: "",
};
