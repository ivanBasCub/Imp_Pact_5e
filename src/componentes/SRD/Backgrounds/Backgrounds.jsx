import { useEffect, useState } from "react"
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
 * Componente que muestra la lista de trasfondos de la SRD disponibles.
 * @component
 * @returns {JSX.Element} La lista de trasfondos con enlace a más detalles.
 */
function BackgroundList() {
    const nameCollection = "SRD_Backgrounds";
    const [backgroundList, setBackgroundList] = useState([]);

    useEffect(() => {
        // Actualiza los datos de la base de datos si no están presentes
        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/2014/backgrounds`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(background => fetch(`${URL}${background.url}`).then(res => res.json()));
            const listBackground = await Promise.all(listPromises);

            listBackground.map(async background => {
                const backRef = doc(db, nameCollection, background.index);
                const backDoc = await getDoc(backRef);

                if (!backDoc.exists()) {
                    setDoc(backRef, background)
                }
            })
        }
        // Verifica si es necesario actualizar los datos en la base de datos
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/backgrounds`);
            const data = await res.json();
            const total = data.count;

            const featRef = collection(db, nameCollection);
            const query = await getDocs(featRef);
            const backgrounds = query.docs.length;

            if (backgrounds < total) {
                updateDataBBDD();
            }
        }

        // Obtiene los trasfondos de la base de datos
        async function fetchBackgrounds() {
            const backgroundRef = collection(db, nameCollection);
            const query = await getDocs(backgroundRef)

            setBackgroundList(query.docs.map(background => background.data()))
        }

        checkDataBBDD()
        fetchBackgrounds()
    }, [])

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 container my-4">
                <div className="row g-3">
                    {backgroundList.map(background => (
                        <div className="col-12" key={background.index}>
                            <div className="border rounded p-3 shadow-sm bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 me-3">{background.name}</h5>
                                    <Link to={`/SRD/background/${background.index}`} className="btn btn-sm btn-primary">
                                        More Info
                                    </Link>
                                </div>
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
 * Componente que muestra los detalles de un trasfondo específico.
 * @component
 * @returns {JSX.Element} Detalles del trasfondo seleccionado.
 */
function Background() {
    const nameCollection = "SRD_Backgrounds";
    const id = useParams();
    const [background, setBackground] = useState([]);

    useEffect(() => {
      // Obtiene los detalles del fondo seleccionado desde la base de datos
        async function fetchBackground() {
            const ref = doc(db, nameCollection, id.id);
            const query = await getDoc(ref);
            if (query.exists()) {
                setBackground(query.data());
            }
        }

        fetchBackground()
    }, []);

    if (Object.keys(background).length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 flex-column container my-4">
            <div className="border rounded p-4 bg-white">
              {/* Nombre del background */}
              <div className="border rounded p-3 shadow-sm bg-light mb-4">
                <h2>{background.name}</h2>
              </div>
      
              {/* Proficiencias y equipo */}
              <div className="border rounded p-3 shadow-sm bg-light mb-4">
                <p><strong>Skills Proficiencies:</strong> {
                  background.starting_proficiencies
                    .filter(proficiency => proficiency.name.startsWith("Skill:"))
                    .map((proficiency, i) => (
                      <span key={i} className="me-2">{proficiency.name.split(":")[1]}</span>
                    ))
                }</p>
                <p><strong>Tools Proficiencies:</strong> {
                  background.starting_proficiencies
                    .filter(proficiency => !proficiency.name.startsWith("Skill:"))
                    .map((proficiency, i) => (
                      <span key={i} className="me-2">{proficiency.name.split(":")[1]}</span>
                    ))
                }</p>
                <p><strong>Languages:</strong> {
                  background.language_options?.from.option_set_type === "resource_list"
                    ? `${background.language_options.choose} of your choice`
                    : ""
                }</p>
                <p><strong>Equipment:</strong> {
                  background.starting_equipment?.map((equipment, i) => (
                    <span key={i} className="me-2">{equipment.quantity} of {equipment.equipment.name}</span>
                  ))
                }</p>
              </div>
      
              {/* Feature */}
              {background.feature && (
                <div className="border rounded p-3 shadow-sm bg-light mb-4">
                  <h4>{background.feature.name}</h4>
                  <p>{background.feature.desc.join(" ")}</p>
                </div>
              )}
      
              {/* Tablas de rasgos */}
              <div className="border rounded p-3 shadow-sm bg-light mb-4">
                {table(background.personality_traits)}
              </div>
              <div className="border rounded p-3 shadow-sm bg-light mb-4">
                {table(background.ideals)}
              </div>
              <div className="border rounded p-3 shadow-sm bg-light mb-4">
                {table(background.bonds)}
              </div>
              <div className="border rounded p-3 shadow-sm bg-light">
                {table(background.flaws)}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
      
}

/**
 * Función que genera una tabla con los rasgos del trasfondo.
 * @param {Object} data Los datos de rasgos a mostrar en la tabla.
 * @returns {JSX.Element} La tabla con los rasgos del trasfondo.
 */
function table(data) {
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm">
                <thead className="table-light">
                    <tr>
                        <th>d{data.from.options.length}</th>
                        <th>{data.type.split("_").join(" ")}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.from.options.map((opt, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.type === "ideals" ? opt.desc : opt.string}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { BackgroundList, Background }