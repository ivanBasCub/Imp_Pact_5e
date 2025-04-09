import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Creamos una evento para cuando inserte el email y la contraseña no rompa
    const btnLogin = async (event) => {
        event.preventDefault();
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user);
                    navigate("/SRD  ");

                })
                .catch((error) => {
                    const errorMessage = error.message;

                    if(errorMessage.includes("auth/user-not-found")) {
                        setError("User not found. Please check your email or sign up.");
                    }
                    if(errorMessage.includes("auth/invalid-credential")){
                        setError("Invalid credentials. Please check your email and password.");
                    }
                });
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form method="post">
                <label from="user_email">Email</label>
                <input type="email" id="user_email" name="user_email" required onChange={(e) => setEmail(e.target.value)} /><br />
                <label from="user_password">Password</label>
                <input type="password" name="user_password" id="user_password" required onChange={(e) => setPassword(e.target.value)} /><br />
                {error ? (<div className="error">{error}</div>) : ""}
                <button type="submit" onClick={btnLogin}>Login</button>
            </form>
            <p>Don't have an account? <a href="/signup">Register</a></p>
            <Logout />
        </div>
    )
}

export default Login;