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
    const [raceTraits, setRaceTraits] = useState([]);

    useEffect(() => {
        const nameCollection = "SRD_Races";
        async function fetchRace() {
            const raceRef = doc(db, nameCollection, id);
            const raceDoc = await getDoc(raceRef);
            setRace(raceDoc.data());
        }
        fetchRace();
    }, [id]);

    useEffect(() => {
        const fetchRaceTraits = async () => {
            if (race.race_traits) {
                const data = await Promise.all(race.race_traits.map(async race_trait => {
                    const nameCollection = "SRD_RaceTraits";
                    const ref = doc(db, nameCollection, race_trait);
                    const document = await getDoc(ref);
                    return document.data();
                }));
                setRaceTraits(data);
            }
        };
        fetchRaceTraits();
    }, [race]);

    if (Object.keys(race).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div key={race.index}>
            <h2>{race.name}</h2>
            <ul>
                <li><b>Alignment:</b> {race.alignment}</li>
                <li><b>Age:</b> {race.age}</li>
                <li><b>Size:</b> {race.size_description}</li>
                <li><b>Languages:</b> {race.language_desc}</li>
                {raceTraits.map((trait, index) => (
                    <li key={index}>
                        <b>{trait.name}</b>: {trait.desc}
                    </li>
                ))}
            </ul>
        </div>
    );
}   

export { RaceList, Race }