import { useEffect } from "react";
import FilledButton from "./buttons/FilledButton";
import { Link } from "react-router-dom";
import CenteredPage from "./CenteredPage";

export default function EmailConfirmationSuccess() {
    useEffect(() => {
        document.title = "Email confirmed";
    }, []);

    return <CenteredPage>
        <div className="bg-gray-100 rounded-md p-4 max-w-md w-4/5">
            Thanks for confirming your email! You can login to your account now.
                <Link to="/login" className="flex justify-center mt-6">
                <FilledButton bold full>Login</FilledButton>
            </Link>
        </div>
    </CenteredPage>
}