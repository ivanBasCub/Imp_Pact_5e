import { useEffect, useState } from "react"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import RaceTraits from '../Race_Traits/Race_Traits';
import Header from "../../Header";
import Footer from "../../Footer";

/**
 * URL base para obtener los datos de la API de D&D 5e.
 * @constant {string}
 */ 
const URL = "https://www.dnd5eapi.co";

/**
 * Componente que representa los detalles de una subraza en D&D 5e.
 * Obtiene la subraza desde Firebase o la API pública, y sus rasgos asociados.
 * 
 * @component
 * @returns {JSX.Element} Vista con información de la subraza y sus rasgos.
 */
export default function SubRace(){
    const { id } = useParams();
    const [ subrace, setSubrace] = useState([]);
    const [raceTraits, setRaceTraits] = useState([]);
    const nameCollection = "SRD_SubRaces";

    useEffect(() => {

        /**
         * Obtiene los datos de una subraza desde Firebase.
         * Si no existe, los descarga desde la API pública y los guarda en Firebase.
         *
         * @async
         * @returns {Promise<void>}
         */
        async function fectchSubrace() {
            const ref = doc(db, nameCollection, id);
            const document = await getDoc(ref);

            if(document.exists()){
                setSubrace(document.data());
            }else{
                const urlref = await fetch(`${URL}/api/2014/subraces/${id}`);
                const urlData = await urlref.json();

                var ability_bonuses = urlData.ability_bonuses?.map((bonus) => {
                    return {
                        index: bonus.ability_score.index,
                        bonus: bonus.bonus
                    }
                }) || [];

                var languages = urlData.languages?.map((language) => language.index) || [];
                var race_traits = urlData.racial_traits?.map((trait) => trait.index) || [];
                var languages_options = {
                    choose: urlData.language_options?.choose || null,
                    from: urlData.language_options?.from.options.map(language => language.item.name) || null
                }|| {};

                var starting_proficiencies = urlData.starting_proficiencies.map(proficiency => proficiency.name) || [];

                setDoc(ref,{
                    index: urlData.index,
                    name: urlData.name,
                    desc: urlData.desc,
                    ability_bonuses: ability_bonuses,
                    starting_proficiencies: starting_proficiencies,
                    languages: languages,
                    languages_options: languages_options,
                    racial_traits: race_traits
                })
            }
        }

        fectchSubrace()
    },[])

    useEffect(() => {
        /**
         * Obtiene los rasgos raciales desde Firebase basados en la subraza cargada.
         *
         * @async
         * @returns {Promise<void>}
         */
        const fetchRaceTraits = async () => {
            if (subrace.racial_traits) {
                const data = await Promise.all(subrace.racial_traits.map(async race_trait => {
                    const nameCollection = "SRD_RaceTraits";
                    const ref = doc(db, nameCollection, race_trait);
                    const document = await getDoc(ref);
                    return document.data();
                }));
                setRaceTraits(data);
            }
        };
        fetchRaceTraits();
    }, [subrace]);

    // Comprobamos que se haya recogido la información de subraza antes de mostrar nada
    if (Object.keys(subrace).length === 0) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Header />
            <div className="d-flex flex-column min-vh-100">
                <main className="flex-grow-1 container my-4">
                    <div className="border rounded p-4 bg-light mb-4">
                        <h1 className="h3 mb-3">{subrace.name}</h1>
                        <p>{subrace.desc}</p>
    
                        <ul>
                            <li><b>Ability Bonuses:</b> {subrace.ability_bonuses.map(ab => (<>Increases by {ab.bonus} in {ab.index} stat. </>))}</li>
                            <li><b>Starting Proficiencies:</b> {subrace.starting_proficiencies.join(", ")}</li>
                            {raceTraits.map((trait, index) => (
                                <li key={index}>
                                    <b>{trait.name}</b>: {trait.desc}
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
    
}