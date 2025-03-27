import { use, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function RaceList(){

}

function Race(){
    const { id } = useParams();
    const [ race, setRace ] = useState({});

    useEffect(() => {
        async function fetchRace(){
            const res = await fetch(`${URL}/api/2014/races/${id}`);
            const data = await res.json();
            setRace(data);
        }
        fetchRace();
    }, []);

    // Comprobación que se haya recogido la información de la API. Para que no nos de errores las comprobaciones en el return y no carge el componente
    if (Object.keys(race).length === 0) {
        return <div>Loading...</div>
    }
    
    return(
        <div key={race.index}>
            <h2>{race.name}</h2>
            <p><b>Alignment:</b> {race.alignment}</p>
            <p><b>Age:</b> {race.age}</p>
            <p><b>Size:</b> {race.size_description}</p>
            <p><b>Langauges:</b> {race.language_desc}</p>
        </div>
    )
}

export { RaceList, Race }