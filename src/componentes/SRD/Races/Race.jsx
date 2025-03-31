import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import RaceTraits from "../Race_Traits/Race_Traits";


{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function RaceList() {
    const [listRaces, setListRaces] = useState([]);

    useEffect(() => {
        const nameCollection = "SRD_Races";
        // Comprobamos si existen los datos en la BBDD de Firebase
        async function updateDataBBDD(){
            const res = await fetch(`${URL}/api/2014/races`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(race  => fetch(`${URL}${race.url}`).then(res => res.json()));
            const listRaces = await Promise.all(listPromises);

            listRaces.forEach(async (race) =>{
                const raceRef = doc(db,nameCollection, race.index);
                const raceDoc = await getDoc(raceRef);

                if (!raceDoc.exists()) {
                    var ability_bonuses = race.ability_bonuses?.map((bonus) => {
                        return {
                            index: bonus.ability_score.index,
                            bonus: bonus.bonus
                        }
                    }) || [];

                    var languages = race.languages?.map((language) => language.index) || [];
                    var race_traits = race.traits?.map((trait) => trait.index) || [];
                    var subraces = race.subraces?.map((subrace) => subrace.index) || [];

                    setDoc(raceRef,{
                        index: race.index,
                        name: race.name,
                        speed: race.speed,
                        ability_bonuses: ability_bonuses,
                        alignment: race.alignment,
                        age: race.age,
                        size: race.size,
                        size_description: race.size_description,
                        languages: languages,
                        language_desc: race.language_desc,
                        race_traits: race_traits,
                        subraces: subraces
                    })
                }
            });
        }

        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/races`);
            const data = await res.json();
            const total = data.count;

            const raceRef = collection(db, nameCollection);
            const query = await getDocs(raceRef);
            const races = query.docs.length;

            if(races < total){
                updateDataBBDD();
            }
        }

        async function fetchRaces() {
            const raceRef = collection(db, nameCollection);
            const quert = await getDocs(raceRef);

            setListRaces(quert.docs.map((doc) => doc.data()));
        }

        checkDataBBDD();
        fetchRaces();
    }, []);

    return (
        <div>
            <RaceTraits/>
            {listRaces.map(race => (
                <div>
                    <div>
                        <h5 >{race.name}</h5>
                        <Link to={`/SRD/Race/${race.index}`}>More Info</Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

function Race() {
    const { id } = useParams();
    const [race, setRace] = useState({});

    useEffect(() => {
        async function fetchRace() {
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

    return (
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