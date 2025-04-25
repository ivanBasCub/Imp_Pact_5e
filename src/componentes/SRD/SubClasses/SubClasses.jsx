import { use, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function SubClass() {
    const { id } = useParams()
    const [subClass, setSubClass] = useState({});
    const nameCollection = "SRD_SubClasses";

    useEffect(() => {

        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/subclasses/${id}`);
            const data = await res.json();
            const docRef = doc(db, nameCollection, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                var levelsRef = await fetch(`${URL}${data.subclass_levels}`)
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
                    return {
                        level: level.level,
                        features: features
                    }
                }))
                var spells = [];
                if (data.spells.length != 0) {
                    spells = data.spells.map(spell => {
                        var level = spell.prerequisites[0].index.split("-")[1];
                        return {
                            index: spell.spell.index,
                            name: spell.spell.name,
                            level: level,
                        }
                    })
                }

                setDoc(docRef, {
                    id: data.index,
                    name: data.name,
                    class: data.class.name,
                    subclass_flavor: data.subclass_flavor,
                    desc: data.desc,
                    levels: levels,
                    spells: spells,
                });

            }
        }

        async function getDataBBDD() {
            const docRef = doc(db, nameCollection, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSubClass(docSnap.data())
            } else {
                console.log("No such document!");
            }
        }

        updateDataBBDD()
        getDataBBDD()
    }, [])

    if (Object.keys(subClass).length === 0) {
        return <div>Loading...</div>
    }

    var levels = subClass.spells.map(spell => spell.level)
    var filteredLevels = [...new Set(levels)]

    return (
        <div>
            <h2>{subClass.subclass_flavor}: {subClass.name}</h2>
            <p>{subClass.desc.join(" ")}</p>
            {subClass.spells.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>{subClass.subclass_flavor} {subClass.name} Spells</th>
                        </tr>
                        <tr>
                            <th>Level</th>
                            <th>Spells</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLevels.map(level => (
                            <tr>
                                <td>{level}</td>
                                <td>{subClass.spells.map(spell => (
                                    <>
                                        {spell.level == level ? <Link to={`/SRD/spell/${spell.index}`}>{spell.name}, </Link> : ""}
                                    </>
                                ))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : ""}
            {subClass.levels.map(levels => (
                <>
                    {levels.features.map(feature => (
                        <div key={feature.index}>
                            <h4>{feature.name}</h4>
                            <p>{feature.desc.join(" ")}</p>
                        </div>
                    ))}
                </>
            ))}
        </div>
    )
}

export default SubClass;