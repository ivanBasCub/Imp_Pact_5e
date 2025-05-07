import { use, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../Header";
import Footer from "../../Footer";

/**
 * URL base para obtener los datos de la API de D&D 5e.
 * @constant {string}
 */ 
const URL = "https://www.dnd5eapi.co";

/**
 * Componente que muestra los detalles de una subclase de D&D 5e.
 * Si la subclase no está en la base de datos, se descarga y almacena automáticamente.
 *
 * @component
 * @returns {JSX.Element}
 */
function SubClass() {
    const { id } = useParams()
    const [subClass, setSubClass] = useState({});
    const nameCollection = "SRD_SubClasses";

    // Hook de efecto que gestiona la recuperación y almacenamiento de datos
    useEffect(() => {

        /**
         * Actualiza la base de datos si el documento de la subclase aún no existe.
         * Recupera también hechizos y características por nivel.
         */
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
        /**
         * Recupera los datos ya existentes de Firestore
         */
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

    // Mientras los datos no estén cargados, mostramos mensaje de carga
    if (Object.keys(subClass).length === 0) {
        return <div>Loading...</div>
    }

    // Obtener niveles únicos de hechizos
    var levels = subClass.spells.map(spell => spell.level)
    var filteredLevels = [...new Set(levels)]

    return (
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 flex-column container my-4">
            <div className="border rounded p-4 bg-white">
              {/* Información principal de la subclase */}
              <div className="border rounded p-3 shadow-sm bg-light mb-4">
                <h2>{subClass.subclass_flavor}: {subClass.name}</h2>
                <p>{subClass.desc.join(" ")}</p>
              </div>
      
              {/* Tabla de hechizos si existen */}
              {subClass.spells.length > 0 && (
                <div className="border rounded p-3 shadow-sm bg-light mb-4">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th colSpan={2} className="text-center">{subClass.subclass_flavor} {subClass.name} Spells</th>
                      </tr>
                      <tr>
                        <th>Level</th>
                        <th>Spells</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLevels.map((level) => (
                        <tr key={level}>
                          <td>{level}</td>
                          <td>
                            {subClass.spells
                              .filter((spell) => spell.level === level)
                              .map((spell, idx) => (
                                <span key={spell.index}>
                                  <Link to={`/SRD/spell/${spell.index}`}>{spell.name}</Link>
                                  {idx < subClass.spells.filter(s => s.level === level).length - 1 ? ', ' : ''}
                                </span>
                              ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
      
              {/* Características de la subclase */}
              {subClass.levels.map((level, index) => (
                <div key={index} className="border rounded p-3 shadow-sm bg-light mb-4">
                  {level.features.map((feature) => (
                    <div key={feature.index} className="mb-3">
                      <h4>{feature.name}</h4>
                      <p>{feature.desc.join(" ")}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </main>
          <Footer />
        </div>
      );
      
      
}

export default SubClass;