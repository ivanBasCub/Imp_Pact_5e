import { auth, db } from "../../firebase/config"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'

/**
 * Componente de Signup.
 * Permite al usuario registrarse proporcionando un nombre de usuario, correo electrónico y contraseña.
 * Después de registrarse, envía un correo de verificación y guarda la información en la base de datos.
 * 
 * @component
 * @returns {JSX.Element} Formulario de registro con campos para el nombre de usuario, correo y contraseña.
 */
export default function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    /**
     * Maneja el evento de registro.
     * Intenta crear una cuenta con el correo y la contraseña proporcionados, y luego guarda la información del usuario.
     * Si ocurre un error, muestra el mensaje correspondiente.
     *
     * @async
     * @param {React.FormEvent} event - Evento de clic en el botón de registro.
     * @returns {Promise<void>}
     */
    const btnSignup = async (event) => {
        event.preventDefault()
        if (username && email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Usuario registrado exitosamente
                    const user = userCredential.user
                    await sendEmailVerification(user);
                    alert("Email verification sent! Please check your inbox.")
                    await setDoc(doc(db, "Users", user.uid), {
                        username: username,
                        email: email
                    })
                    navigate("/login")
                    return auth.signOut(); // Cerrar sesión después de registrarse
                })
                .catch((error) => {
                    const errorMessage = error.message
                    console.log(errorMessage)
                    if (errorMessage.includes("auth/email-already-in-use")) {
                        setError("Email already in use. Please use another email.")
                    }
                })
        }
    }

    return (
        <>
            <main className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 className="text-center mb-4">Signup</h1>
                    <form method="post">
                        <div className="mb-3">
                            <label htmlFor="user_name" className="form-label">Username</label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                className="form-control"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

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

                        <button type="submit" className="btn btn-primary w-100" onClick={btnSignup}>
                            Register
                        </button>
                    </form>

                    <p className="text-center mt-3">
                        Already have an account? <a href="/login">Login</a>
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