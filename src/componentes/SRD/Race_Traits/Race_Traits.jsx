import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

/**
 * URL base para obtener los datos de la API de D&D 5e.
 * @constant {string}
 */ 
const URL = "https://www.dnd5eapi.co";

/**
 * Componente que se encarga de actualizar la base de datos con los rasgos de razas de la API de D&D 5e.
 * La información se descarga y se guarda en la base de datos si no existe previamente.
 * 
 * @async
 * @function
 * @returns {JSX.Element} Un componente vacío ya que solo ejecuta la actualización de la base de datos.
 */
function RaceTraits() {
    // Constantes necesarias para el componente
    const nameCollection = "SRD_RaceTraits";

    /**
     * Función que actualiza la base de datos de Firestore con los rasgos de razas obtenidos desde la API de D&D 5e.
     * 
     * Obtiene los rasgos de razas de la API, los procesa y los guarda en Firestore si aún no existen en la base de datos.
     * 
     * @async
     * @function
     */
    async function updateDataBBDD() {
        const res = await fetch(`${URL}/api/2014/traits`);
        const data = await res.json();
        const list = data.results;
        const listPromises = list.map(raceTrait => fetch(`${URL}${raceTrait.url}`).then(res => res.json()));
        const listRaceTraits = await Promise.all(listPromises);

        listRaceTraits.forEach(async (raceTrait) => {
            const raceTraitRef = doc(db, nameCollection, raceTrait.index);
            const raceTraitDoc = await getDoc(raceTraitRef);

            if (!raceTraitDoc.exists()) {
                var trait_specific = null;

                var trait_options = {
                    choose: raceTrait.trait_specific?.subtrait_options?.choose || null,
                    from: raceTrait.trait_specific?.subtrait_options?.from.options.map(trait => trait.item.index) || null
                };

                var language_options = {
                    choose: raceTrait.language_options?.choose || null,
                    from: raceTrait.language_options?.from.options.map(languaje => languaje.item.index) || null
                };

                var skill_options = {
                    choose: raceTrait.proficiency_choices?.choose || null,
                    from: raceTrait.proficiency_choices?.from.options.map(skill => skill.item.index.split("-")[1]) || null
                }

                var spell_options = {
                    choose: raceTrait.trait_specific?.spell_options?.choose || null,
                    from: raceTrait.trait_specific?.spell_options?.from.options.map(spell => spell.item.index) || null
                }

                var draconic = raceTrait.index.split("-");
                if(draconic.length > 2 && draconic[0] == "draconic"){
                    trait_specific = raceTrait.trait_specific || null;
                }


                setDoc(raceTraitRef, {
                    index: raceTrait.index,
                    name: raceTrait.name,
                    desc: raceTrait.desc,
                    proficiencies: raceTrait.proficiencies?.map((proficiency) => proficiency.index) || [],
                    trait_options: trait_options,
                    language_options: language_options,
                    skill_options: skill_options,
                    spell_options:spell_options,
                    trait_specific: trait_specific,
                })
            }
        });
    }

    updateDataBBDD();

    return <></>
}

export default RaceTraits;