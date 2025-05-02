import { auth, db } from "../../firebase/config"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const btnSignup = async (event) => {
        event.preventDefault()
        if (username && email && password) {
            // Funcion para crear un nuevo usuario con el email y la contraseña
            // Si el usuario se crea correctamente, se envia un email de verificacion y se guarda el usuario en la base de datos
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user
                    // Enviamos un email de verificacion al usuario
                    // Si el usuario no esta verificado, no podra iniciar sesion
                    await sendEmailVerification(user);
                    alert("Email verification sent! Please check your inbox.")
                    // Guardamos el usuario en la base de datos
                    await setDoc(doc(db, "Users", user.uid), {
                        username: username,
                        email: email
                    })
                    // Cerramos la sesion del usuario y lo redirigimos a la pagina de login
                    // Esto es para que no pueda iniciar sesion sin verificar el email
                    auth.signOut()
                    navigate("/login")
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
                </div>
            </main>
        </>
    );

}