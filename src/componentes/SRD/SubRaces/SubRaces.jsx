import { useEffect, useState } from "react"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import RaceTraits from '../Race_Traits/Race_Traits'

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

export default function SubRace(){
    const { id } = useParams();
    const [ subrace, setSubrace] = useState([]);
    const [raceTraits, setRaceTraits] = useState([]);
    const nameCollection = "SRD_SubRaces";

    useEffect(() => {

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

    // Comprobamos que se haya recogido la información del Spell antes de mostrar nada
    if (Object.keys(subrace).length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <RaceTraits/>
            <h2>{subrace.name}</h2>
            <p>{subrace.desc}</p>
            {console.log(raceTraits)}
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
    )
}