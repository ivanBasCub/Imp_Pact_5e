import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function ClassesList() {
    const nameCollection = "SRD_Classes";
    const [classesList, setClassesList] = useState([]);

    // Efecto para meter la informacion en la BBDD en el caso de que sea necesario
    useEffect(() => {
        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/classes`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(clase => fetch(`${URL}${clase.url}`).then(res => res.json()))
            const listClasses = await Promise.all(listPromises);

            listClasses.forEach(async clase => {
                const classRef = doc(db, nameCollection, clase.index);
                const classDoc = await getDoc(classRef);

                if (!classDoc.exists()) {
                    // Levels
                    var levelsRef = await fetch(`${URL}${clase.class_levels}`)
                    var levelsData = await levelsRef.json();
                    var levels = await Promise.all(levelsData.map(async level => {
                        var features = await Promise.all(level.features.map(async feature => {
                            var featureRef = await fetch(`${URL}${feature.url}`)
                            var featureData = await featureRef.json()
                            return {
                                index: featureData.index,
                                name: featureData.name,
                                desc: featureData.desc
                            }
                        }))
                        if (level.spellcasting) {
                            return {
                                index: level.index,
                                level: level.level,
                                features: features,
                                prof_bonus: level.prof_bonus,
                                class_specific: level.class_specific,
                                spellcasting: level.spellcasting
                            }
                        } else {
                            return {
                                index: level.index,
                                level: level.level,
                                features: features,
                                prof_bonus: level.prof_bonus,
                                class_specific: level.class_specific
                            }
                        }
                    }))

                    // Proficiencies
                    var tools_choices = [];
                    var saving_throws = clase.saving_throws.map(saving => saving.name);
                    var skills_choices = clase.proficiency_choices.map( (choise, index) => {
                        if (index === 0) {
                            var options = choise.from.options.map(proficiency => proficiency.item.name)
                            return {
                                choose: choise.choose,
                                desc: choise.desc,
                                options: options
                            }
                        }else{
                            var options = choise.from.options.map(proficiency => proficiency.choice.desc)
                            var tools ={
                                choose: choise.choose,
                                desc: choise.desc,
                                options: options
                            }
                            tools_choices = tools
                        }
                    }).filter(Boolean);

                    var armors = (await Promise.all(clase.proficiencies.map(async armor => {
                        var armorRef = await fetch(`${URL}${armor.url}`);
                        var armorData = await armorRef.json();
                        if (armorData.type === "Armor") {
                            return {
                                index: armorData.index,
                                name: armorData.name
                            }
                        }
                    }))).filter(Boolean);

                    var weapons = (await Promise.all(clase.proficiencies.map(async weapon => {
                        var weaponRef = await fetch(`${URL}${weapon.url}`);
                        var weaponData = await weaponRef.json();
                        if (weaponData.type === "Weapons") {
                            return {
                                index: weaponData.index,
                                name: weaponData.name
                            }
                        }
                    }))).filter(Boolean);

                    var proficiencies = {
                        armor: armors,
                        weapons: weapons,
                        saving_throws: saving_throws,
                        skills_choices: skills_choices,
                        tools_choices: tools_choices
                    }

                    // Equipamentos
                    var starting_equipment = clase.starting_equipment.map(equipment => {
                        return {
                            equipment: equipment.equipment.name,
                            quantity: equipment.quantity
                        }
                    })

                    var equipment_options = clase.starting_equipment_options.map(equipment => equipment.desc || "")

                    var equipments = {
                        starting: starting_equipment,
                        options: equipment_options
                    }

                    // Multiclass
                    var multi_classing = {
                        prerequisites: clase.multi_classing?.prerequisites?.map(requisite => {
                            return {
                                ability_score: requisite.ability_score.name,
                                minimum: requisite.minimum_score
                            }
                        }) || clase.multi_classing.prerequisite_options?.from?.options?.map(requisite => {
                            return {
                                type: "option",
                                ability_score: requisite.ability_score.name,
                                minimum: requisite.minimum_score
                            }
                        }) || [],
                        proficiencies: clase.multi_classing?.proficiencies?.map(pro => {
                            return {
                                index: pro.index,
                                name: pro.name
                            }
                        })
                    }

                    // Subclass
                    var subclasses = clase.subclasses.map(subclass => {
                        return {
                            index: subclass.index,
                            name: subclass.name
                        }
                    })

                    // Spellcasting
                    var spellcasting = {};
                    if (clase.spellcasting) {
                        spellcasting = {
                            level: clase.spellcasting.level,
                            spellcasting_ability: clase.spellcasting.spellcasting_ability.index,
                            info: clase.spellcasting.info
                        }

                        var clasData = {
                            index: clase.index,
                            name: clase.name,
                            hit_dice: clase.hit_die,
                            proficiencies: proficiencies,
                            equipments: equipments,
                            multi_classing: multi_classing,
                            subclasses: subclasses,
                            levels: levels,
                            spellcasting: spellcasting
                        }
                        setDoc(classRef, clasData)

                    } else {
                        var clasData = {
                            index: clase.index,
                            name: clase.name,
                            hit_dice: clase.hit_die,
                            proficiencies: proficiencies,
                            equipments: equipments,
                            multi_classing: multi_classing,
                            subclasses: subclasses,
                            levels: levels
                        }
                        setDoc(classRef, clasData)
                    }

                }
            })
        }
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/classes`);
            const data = await res.json();
            const total = data.count;
            const classRef = collection(db, nameCollection);
            const query = await getDocs(classRef);
            const classes = query.docs.length;

            if (classes < total) {
                updateDataBBDD();
            }
        }
        checkDataBBDD()
    }, [])

    // Coger la lista con la información de las clases
    useEffect(() => {
        async function fecthClasses() {
            const classesRef = collection(db, nameCollection);
            const query = await getDocs(classesRef);

            setClassesList(query.docs.map(document => document.data()))
        }
        fecthClasses();
    }, [])

    return (
        <div>
            {classesList.map(clase =>(
                <div>
                    <div>
                        <h5>{clase.name}</h5>
                        <Link to={`/SRD/class/${clase.index}`}>More Info</Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

function Clase() {
    const nameCollection = "SRD_Classes";
}

export { ClassesList, Clase }