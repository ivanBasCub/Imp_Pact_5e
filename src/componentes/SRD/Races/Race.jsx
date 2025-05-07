import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import RaceTraits from "../Race_Traits/Race_Traits";
import Header from "../../Header";
import Footer from "../../Footer";

/**
 * URL base para obtener los datos de la API de D&D 5e.
 * @constant {string}
 */ 
const URL = "https://www.dnd5eapi.co";

/**
 * Componente que muestra la lista de razas disponibles.
 * Obtiene los datos de las razas desde la API de D&D y actualiza Firebase con los datos obtenidos.
 * 
 * @return {JSX.Element} Componente RaceList renderizado con la lista de razas.
 */
function RaceList() {
    const [listRaces, setListRaces] = useState([]);

    useEffect(() => {
        const nameCollection = "SRD_Races";

         /**
         * Obtiene los datos de las razas desde la API de D&D y actualiza Firebase con los datos obtenidos.
         * 
         * @async
         * @function
         */
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

        /**
         * Verifica si el número de razas en Firebase coincide con el número total de razas en la API de D&D.
         * Si el número de razas es menor, obtiene y actualiza los datos de las razas.
         * 
         * @async
         * @function
         */
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

        /**
         * Obtiene la lista de razas desde Firebase y actualiza el estado de `listRaces`.
         * 
         * @async
         * @function
         */
        async function fetchRaces() {
            const raceRef = collection(db, nameCollection);
            const quert = await getDocs(raceRef);

            setListRaces(quert.docs.map((doc) => doc.data()));
        }

        checkDataBBDD();
        fetchRaces();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 container my-4">
            <RaceTraits />
            <div className="row g-3 mt-3">
              {listRaces.map((race) => (
                <div key={race.index} className="col-12 col-md-6 col-lg-4">
                  <div className="border rounded p-3 shadow-sm bg-light h-100 d-flex flex-column justify-content-between">
                    <h5 className="mb-0 me-3 text-center">{race.name}</h5>
                    <Link
                      to={`/SRD/race/${race.index}`}
                      className="btn btn-sm btn-primary mt-3"
                    >
                      More Info
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </main>
          <Footer />
        </div>
      );
      
      
}

/**
 * Componente que muestra los detalles de una raza específica.
 * Obtiene los datos de la raza desde Firebase según el parámetro `id` de la URL,
 * y obtiene los rasgos asociados a la raza y sus ancestros dracónicos.
 * 
 * @return {JSX.Element} Componente Race renderizado con los detalles de la raza.
 */
function Race() {
    const { id } = useParams();
    const [race, setRace] = useState({});
    const [raceTraits, setRaceTraits] = useState([]);
    const [ draconicAscentry, setDraconicAscentry ] = useState([])

    
    useEffect(() => {
        const nameCollection = "SRD_Races";

        /**
        * Obtiene los datos de una raza específica desde Firebase basada en el `id` de la raza.
        * 
        * @async
        * @function
        */
        async function fetchRace() {
            const raceRef = doc(db, nameCollection, id);
            const raceDoc = await getDoc(raceRef);
            setRace(raceDoc.data());
        }
        fetchRace();
    }, [id]);

    useEffect(() => {
        /**
        * Obtiene los datos de una raza específica desde Firebase basada en el `id` de la raza.
        * 
        * @async
        * @function
        */
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
        /**
         * Obtiene los rasgos de ancestro dracónico para la raza y los filtra mediante una expresión regular.
         * 
         * @async
         * @function
         */
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
        <>
            <Header />
            <div className="d-flex flex-column min-vh-100">
                {/* Contenedor principal que ocupa todo el alto disponible */}
                <main className="flex-grow-1 container my-4">
                    <div className="border rounded p-4 bg-light mb-4">
                        <h1 className="h3 mb-3">{race.name}</h1>
    
                        <div className="mt-4">
                            <h2>Race Details</h2>
                            <ul>
                                <li><b>Ability Bonuses:</b> {race.ability_bonuses.map(ab => (<>Increases by {ab.bonus} in {ab.index} stat. </>))}</li>
                                <li><b>Alignment:</b> {race.alignment}</li>
                                <li><b>Age:</b> {race.age}</li>
                                <li><b>Size:</b> {race.size_description}</li>
                                <li><b>Languages:</b> {race.language_desc}</li>
                            </ul>
                        </div>
    
                        <div className="mt-4">
                            <h2>Race Traits</h2>
                            {raceTraits.map((trait, index) => (
                                <div key={index} className="border rounded p-3 bg-light mb-4">
                                    <h3>{trait.name}</h3>
                                    <p>{trait.desc}</p>
                                    {trait.index === "draconic-ancestry" ? (
                                        <table className="table mt-3">
                                            <thead>
                                                <tr>
                                                    <th>Dragon Color</th>
                                                    <th>Damage Type</th>
                                                    <th>Breath Weapon</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {draconicAscentry.map(color => (
                                                    <tr key={color.index}>
                                                        <td>{color.index.split("-")[2]}</td>
                                                        <td>{color.trait_specific.damage_type.name}</td>
                                                        <td>{color.trait_specific.breath_weapon.area_of_effect.size}ft {color.trait_specific.breath_weapon.area_of_effect.type} ({color.trait_specific.breath_weapon.dc.dc_type.name} save)</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : ""}
                                </div>
                            ))}
                        </div>
    
                        {race.subraces.length !== 0 && (
                            <div className="border rounded p-4 bg-light mb-4">
                                <h3>Subraces</h3>
                                <p>{race.subraces.map(subrace => (
                                    <Link key={subrace.index} to={`/SRD/subrace/${subrace.index}`} className="d-block">{subrace.name}</Link>
                                ))}</p>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
    
}


export { RaceList, Race }