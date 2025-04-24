import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Logout() {
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const btnLogout = async (event) => {
        event.preventDefault()
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign-out successful.")
            navigate("/")
        }).catch((error) => {
            // An error happened.
            const errorMessage = error.message
            console.log(errorMessage)
            if (errorMessage.includes("auth/no-current-user")) {
                setError("No user is currently signed in.")
            }
        })
    }

    return (
        <div>
            <button onClick={btnLogout} className="btn btn-outline-danger mx-md-2 my-sm-0">Logout</button>
        </div>
    )
}

export default Logout;