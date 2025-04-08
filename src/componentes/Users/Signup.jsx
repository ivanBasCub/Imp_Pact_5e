import { auth, db } from "../../firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"


export default function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const btnSignup = async (event) => {
        event.preventDefault()
        if (username && email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in 
                    const user = userCredential.user
                    console.log(user)
                    await setDoc(doc(db, "Users", user.uid), {
                        username: username,
                        email: email
                    })
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

    return(
        <div>
            <h1>Signup</h1>
            <form method="post">
                <label from="user_name">Username</label>
                <input type="text" id="user_name" name="user_name" required onChange={((e) => setUsername(e.target.value))}/><br />
                <label from="user_email">Email</label>
                <input type="email" id="user_email" name="user_email" required onChange={((e) => setEmail(e.target.value))}/><br />
                <label from="user_password">Password</label>
                <input type="password" name="user_password" id="user_password" required onChange={((e) => setPassword(e.target.value))}/><br />
                {error ? (<div className="error">{error}</div>) : ""}
                <button type="submit" onClick={btnSignup}>Register</button>
            </form>
            <p>Already have an account?<a href="/login">Login</a></p>
        </div>
    )
}