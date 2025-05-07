import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Componente de Logout.
 * Permite al usuario cerrar sesión y redirige a la página de inicio.
 *
 * @component
 * @returns {JSX.Element} Botón de logout que, al ser presionado, cierra sesión y redirige al inicio.
 */
function Logout() {
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    /**
     * Maneja el evento de cierre de sesión.
     * Intenta cerrar sesión con Firebase y redirige al usuario a la página principal.
     * Si ocurre un error, establece un mensaje de error.
     *
     * @async
     * @param {React.FormEvent} event - Evento de clic en el botón de logout.
     * @returns {Promise<void>}
     */
    const btnLogout = async (event) => {
        event.preventDefault()
        signOut(auth).then(() => {
            // Si el cierre de sesión es exitoso, redirigimos al usuario a la página de inicio.
            navigate("/")
        }).catch((error) => {
            // Manejo de errores si no hay usuario actual o si ocurre otro error.
            const errorMessage = error.message
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