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
        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/2014/races`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(race => fetch(`${URL}${race.url}`).then(res => res.json()));
            const listRaces = await Promise.all(listPromises);

            listRaces.forEach(async (race) => {
                const raceRef = doc(db, nameCollection, race.index);
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
                    var subraces = race.subraces?.map((subrace) => {
                        return {
                            index: subrace.index,
                            name: subrace.name
                        }
                    }) || [];

                    setDoc(raceRef, {
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

            if (races < total) {
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
            <RaceTraits />
            {listRaces.map(race => (
                <div>
                    <div>
                        <h5 >{race.name}</h5>
                        <Link to={`/SRD/race/${race.index}`}>More Info</Link>
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
    const [ draconicAscentry, setDraconicAscentry ] = useState([])

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

    useEffect(() => {
        async function fetchDraconicAscentry() {
            const nameCollection = "SRD_RaceTraits";
            const regex = /^draconic-ancestry-.+/;
    
            const ref = collection(db, nameCollection);
            const documents = await getDocs(ref);
            var list = documents.docs.map(docu => docu.data());
            var filterdata = list.filter(feat => regex.test(feat.index))
            setDraconicAscentry(filterdata);
            // Procesa los datos aquí, si es necesario, y guárdalos en un estado para usarlos después
        }
        fetchDraconicAscentry();
    },[])


    if (Object.keys(race).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div key={race.index}>
            <h2>{race.name}</h2>
            <ul>
                <li><b>Ability Bonuses:</b> {race.ability_bonuses.map(ab => (<>Increases by {ab.bonus} in {ab.index} stat. </>))}</li>
                <li><b>Alignment:</b> {race.alignment}</li>
                <li><b>Age:</b> {race.age}</li>
                <li><b>Size:</b> {race.size_description}</li>
                <li><b>Languages:</b> {race.language_desc}</li>
                {raceTraits.map((trait, index) => (
                    <>
                        <li key={index}>
                            <b>{trait.name}</b>: {trait.desc}
                        </li>
                        {trait.index === "draconic-ancestry" ? (
                            <>
                               <table>
                                    <thead>
                                        <tr>
                                            <th>Dragon Color</th>
                                            <th>Damage Type</th>
                                            <th>Breath Weapon</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {draconicAscentry.map(color => (
                                            <tr>
                                                <td>{color.index.split("-")[2]}</td>
                                                <td>{color.trait_specific.damage_type.name}</td>
                                                <td>{color.trait_specific.breath_weapon.area_of_effect.size}ft {color.trait_specific.breath_weapon.area_of_effect.type} ({color.trait_specific.breath_weapon.dc.dc_type.name} save) </td>
                                            </tr>
                                        ))}
                                    </tbody>
                               </table>
                            </>
                        ) : ""}
                    </>
                ))}
            </ul>
            {race.subraces.length != 0 ? (
                <>
                    <h4>Subraces</h4>
                    <p>{race.subraces.map(subrace => (<Link to={`/SRD/subrace/${subrace.index}`}>{subrace.name}</Link>))}</p>
                </>
            ) : ""}

        </div>
    );
}


export { RaceList, Race }