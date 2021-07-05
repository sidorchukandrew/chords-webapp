import { useEffect } from "react";
import { Link } from "react-router-dom";
import CenteredPage from "../components/CenteredPage";
import Button from "../components/Button";

export default function EmailConfirmationSuccess() {
	useEffect(() => {
		document.title = "Email confirmed";
	}, []);

	return (
		<CenteredPage>
			<div className="bg-gray-100 rounded-md p-4 max-w-md w-4/5 mx-auto">
				Thanks for confirming your email! You can login to your account now.
				<Link to="/login" className="flex-center mt-6">
					<Button full>Login</Button>
				</Link>
			</div>
		</CenteredPage>
	);
}