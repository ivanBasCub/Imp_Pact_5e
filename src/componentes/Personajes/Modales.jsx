import { useEffect, useState } from "react";

export default function Modales() {
    const [showModal, setShowModal] = useState(false);
    const [showRaceModal, setShowRaceModal] = useState(false);
    return(
    <>
        <button onClick={() => setShowModal(true)}>Clase</button>
        <button onClick={() => setShowRaceModal(true)}>Raza</button>

        {/* Modal */}
        {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Selecciona una clase</h2>
                <ul>
                {classes.map((clase) => (
                    <li
                    key={clase.index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setSelectedClass(clase.index);
                        setShowModal(false);
                    }}
                    >
                    {clase.name}
                    </li>
                ))}
                </ul>
                <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
            </div>
        )}

        {showRaceModal && (
            <div className="modal-overlay" onClick={() => setShowRaceModal(false)}>
            <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Selecciona una raza</h2>
                <ul>
                {races.map((race) => (
                    <li
                    key={race.index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setSelectedRace(race.index);
                        setShowRaceModal(false);
                    }}
                    >
                    {race.name}
                    </li>
                ))}
                </ul>
                <button onClick={() => setShowRaceModal(false)}>Cerrar</button>
            </div>
            </div>
        )}
    </>
);
}
