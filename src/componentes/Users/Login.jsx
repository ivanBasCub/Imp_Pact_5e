import { useState } from "react";
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Creamos una evento para cuando inserte el email y la contraseña no rompa
    const btnLogin = async (event) => {
        event.preventDefault();
        if (email && password) {
            setPersistence(auth, browserSessionPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password)
                .then(() =>{
                    navigate("/")
                }).catch((error) =>{
                    const errorMessage = error.message;

                    if(errorMessage.includes("auth/user-not-found")) {
                        setError("User not found. Please check your email or sign up.");
                    }
                    if(errorMessage.includes("auth/invalid-credential")){
                        setError("Invalid credentials. Please check your email and password.");
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    };

    return (
        <>
            <main className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 className="text-center mb-4">Login</h1>
                    <form method="post">
                        <div className="mb-3">
                            <label htmlFor="user_email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="user_email"
                                name="user_email"
                                className="form-control"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
    
                        <div className="mb-3">
                            <label htmlFor="user_password" className="form-label">Password</label>
                            <input
                                type="password"
                                name="user_password"
                                id="user_password"
                                className="form-control"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
    
                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}
    
                        <button type="submit" className="btn btn-primary w-100" onClick={btnLogin}>
                            Login
                        </button>
                    </form>
    
                    <p className="text-center mt-3">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </p>

                    <div className="text-center mt-2">
                    <Link to="/" className="text-decoration-none">
                        <p className="nav-link">Return to home page</p>
                    </Link>
                    </div>
                </div>
            </main>
        </>
    );
    
}

export default Login;