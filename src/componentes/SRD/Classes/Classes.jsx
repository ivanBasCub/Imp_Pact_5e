import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../Header";
import Footer from "../../Footer";

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
                    var tools_choices = {};
                    var saving_throws = clase.saving_throws.map(saving => saving.name);
                    var skills_choices = clase.proficiency_choices.map((choise, index) => {
                        if (index === 0) {
                            var options = choise.from.options.map(proficiency => proficiency.item.name)
                            return {
                                choose: choise.choose,
                                desc: choise.desc,
                                options: options
                            }
                        } else {
                            var options = choise.from.options.map(proficiency => proficiency.choice?.desc || proficiency.item?.name)
                            var tools = {
                                choose: choise.choose,
                                desc: choise.desc,
                                options: options
                            }
                            tools_choices = tools
                        }
                    }).filter(Boolean);

                    var skills_choices = skills_choices[0] || {};

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
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 container my-4">
            <div className="row g-3 mt-3">
              {classesList.map((clase) => (
                <div key={clase.index} className="col-12 col-md-6 col-lg-4">
                  <div className="border rounded p-3 shadow-sm bg-light h-100 d-flex flex-column justify-content-between">
                    <h5 className="mb-0 me-3 text-center">{clase.name}</h5>
                    <Link
                      to={`/SRD/class/${clase.index}`}
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

function Clase() {
    const id = useParams();
    const nameCollection = "SRD_Classes";
    const [clase, setClase] = useState({});

    useEffect(() => {

        async function fectchClass() {
            const ref = doc(db, nameCollection, id.id);
            const query = await getDoc(ref);

            setClase(query.data())
        }
        fectchClass()
    }, [])

    if (Object.keys(clase).length === 0) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Header />
            <div className="container my-4">
                <div className="border rounded p-4 bg-light mb-4">
                    <h1 className="h3 mb-3">{clase.name}</h1>
                    {table(clase.index, clase.levels)}
    
                    <div className="mt-4">
                        <h2>Class Features</h2>
                        <p>As a {clase.index.split("-").join(" ")}, you gain the following class features.</p>
    
                        <div className="border rounded p-3 bg-light mb-4">
                            <h3>Hit points</h3>
                            <p><b>Hit dice:</b> 1d{clase.hit_dice} per {clase.index.split("-").join(" ")} level</p>
                            <p><b>Hit Points at 1st level:</b> {clase.hit_dice} + your Constitution modifier</p>
                            <p><b>Hit Points at Higher Levels:</b> 1d{clase.hit_dice} (or {(clase.hit_dice / 2) + 1}) + your Constitution modifier</p>
                        </div>
    
                        <div className="border rounded p-3 bg-light mb-4">
                            <h3>Proficiencies</h3>
                            <p><b>Armor:</b>{clase.proficiencies.armor.length !== 0 ? (<> {clase.proficiencies.armor.map(ar => ar.name).join(", ")} </>) : (<>None</>)}</p>
                            <p><b>Weapons:</b>{clase.proficiencies.weapons.length !== 0 ? (<> {clase.proficiencies.weapons.map(wp => wp.name).join(", ")} </>) : (<>None</>)}</p>
                            <p><b>Tools:</b> {Object.keys(clase.proficiencies.tools_choices).length !== 0 ? (<>{clase.proficiencies.tools_choices.desc}</>) : (<>None</>)} </p>
                            <p><b>Saving Throws:</b> {clase.proficiencies.saving_throws.join(", ")}</p>
                            <p><b>Skills:</b> {clase.proficiencies.skills_choices !== undefined ? (<>{clase.proficiencies.skills_choices.desc}</>) : (<>None</>)}  </p>
                        </div>
    
                        <div className="border rounded p-3 bg-light mb-4">
                            <h3>Equipment</h3>
                            <p>You start with the following equipment, in addition to the equipment granted by your background:</p>
                            <ul>
                                {clase.equipments.options.map(opt => (
                                    <li key={opt}>{opt}</li>
                                ))}
                                <li>{clase.equipments.starting.map((start, i) => (<>{start.quantity} {start.equipment}{i < clase.equipments.starting.length - 1 && ", "}</>))}</li>
                            </ul>
                        </div>
    
                        {/* Ver la lista de habilidades en el caso de que sea un spellcaster */}
                        {clase.spellcasting ? (
                            <>
                                {clase.spellcasting.info.map((inf, idx) => (
                                    <div key={idx} className="border rounded p-3 bg-light mb-4">
                                        <h3>{inf.name}</h3>
                                        <p>{inf.desc.join(" ")}</p>
                                    </div>
                                ))}
                            </>
                        ) : ""}
    
                        {/* Ver la lista de habilidades de la clase */}
                        {featureList(clase)}
    
                        {/* Tabla con las subclasses que hay en el SRD */}
                        <div className="border rounded p-4 bg-light mb-4">
                            <h3>Subclasses</h3>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Subclass Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clase.subclasses.map(sb => (
                                        <tr key={sb.index}>
                                            <td>
                                                <Link to={`/SRD/subclass/${sb.index}`}>{sb.name}</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}    

// Ver la lista de habilidades de la clase con un filtro para que no se repitan
function featureList(data) {
    var result = [];

    data.levels.map(level => {
        level.features.map(ft => {
            result.push({
                name: ft.name.split("(")[0].trim(),
                desc: ft.desc,
                level: level.level
            });
        });
    });

    var seenNames = {};
    var featureList = result.filter(item => {
        if (seenNames[item.name]) {
            return false;
        } else {
            seenNames[item.name] = true;
            return true;
        }
    });

    return (
        <div>
            {featureList.map(ft => (
                <div>
                    <h3>{ft.name}</h3>
                    <p>{ft.desc.join(" ")}</p>
                </div>
            ))}
        </div>
    )

}
// Tabla de los niveles de la clase con sus habilidades principales y hechizos en el caso de que sea un lanzador de hechizos
// Se le pasa el index de la clase y los niveles de la misma
function table(clase, data) {
    const fullCasters = ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"];
    const subClassFeatureLevel = [2, 3, 6, 10, 14, 18]; 

    return (
        <div className="table-responsive my-4">
          <table className="table table-striped table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th scope="col">Level</th>
                <th scope="col">Proficiency Bonus</th>
                <th scope="col">Features</th>
      
                {/* Mostrar columnas de hechizos si es spellcaster */}
                {data[0].spellcasting && (
                  <>
                    {fullCasters.includes(clase) && (
                      <>
                        <th scope="col">Cantrips Known</th>
                        {data[0].spellcasting.spells_known && <th scope="col">Spells Known</th>}
                      </>
                    )}
                    <th scope="col">1st</th>
                    <th scope="col">2nd</th>
                    <th scope="col">3rd</th>
                    <th scope="col">4th</th>
                    <th scope="col">5th</th>
                    {fullCasters.includes(clase) && (
                      <>
                        <th scope="col">6th</th>
                        <th scope="col">7th</th>
                        <th scope="col">8th</th>
                        <th scope="col">9th</th>
                      </>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((level) => (
                <tr key={level.level}>
                  <td>{level.level}</td>
                  <td>+{level.prof_bonus}</td>
                  <td>
                    {level.features.length === 0 && subClassFeatureLevel.includes(level.level)
                      ? "SubClass Feature"
                      : level.features.map((ft) => ft.name).join(", ")}
                  </td>
      
                  {/* Mostrar datos de spellcasting si aplica */}
                  {level.spellcasting && (
                    <>
                      {fullCasters.includes(clase) && (
                        <>
                          <td>{level.spellcasting.cantrips_known}</td>
                          {level.spellcasting.spells_known && (
                            <td>{level.spellcasting.spells_known}</td>
                          )}
                        </>
                      )}
                      <td>{level.spellcasting.spell_slots_level_1}</td>
                      <td>{level.spellcasting.spell_slots_level_2}</td>
                      <td>{level.spellcasting.spell_slots_level_3}</td>
                      <td>{level.spellcasting.spell_slots_level_4}</td>
                      <td>{level.spellcasting.spell_slots_level_5}</td>
                      {fullCasters.includes(clase) && (
                        <>
                          <td>{level.spellcasting.spell_slots_level_6}</td>
                          <td>{level.spellcasting.spell_slots_level_7}</td>
                          <td>{level.spellcasting.spell_slots_level_8}</td>
                          <td>{level.spellcasting.spell_slots_level_9}</td>
                        </>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
}

export { ClassesList, Clase }