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
 * Componente que muestra una lista de dotes (feats) disponibles en la base de datos.
 * Si los datos no están en la base de datos, los descarga de la API de D&D 5e y los almacena.
 * 
 * @component
 */
function FeatsList() {
    const [featsList, setfeatsLits] = useState([]);

    useEffect(() => {
        const nameCollection = "SRD_Feats";

        /**
         * Función que actualiza la base de datos con los logros (feats) de la API de D&D 5e.
         * Descarga los datos de la API y los almacena en Firestore si no existen previamente.
         */
        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/2014/feats`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(feat => fetch(`${URL}${feat.url}`).then(res => res.json()));
            const listFeats = await Promise.all(listPromises);

            listFeats.forEach(async (feat) => {
                const featRef = doc(db, nameCollection, feat.index);
                const featDoc = await getDoc(featRef);

                if (!featDoc.exists()) {
                    var prerequisites = feat.prerequisites.map(requisit => {
                        return {
                            name: requisit.ability_score?.name || null,
                            minimun: requisit.minimum_score
                        }
                    })

                    setDoc(featRef, {
                        index: feat.index,
                        name: feat.name,
                        prerequisites: prerequisites,
                        desc: feat.desc
                    })
                }
            })
        }

        /**
         * Función que verifica si hay datos en la base de datos y los actualiza si es necesario.
         * Compara el número de feats en la base de datos con el total disponible en la API.
         */
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/feats`);
            const data = await res.json();
            const total = data.count;

            const featRef = collection(db, nameCollection);
            const query = await getDocs(featRef);
            const feats = query.docs.length;

            if (feats < total) {
                updateDataBBDD();
            }
        }

        /**
         * Función que recupera la lista de feats desde la base de datos de Firestore.
         * Actualiza el estado con los datos obtenidos.
         */
        async function fetchFeats(){
            const featRef = collection(db, nameCollection);
            const query = await getDocs(featRef);

            setfeatsLits(query.docs.map(feat => feat.data()));
        }

        checkDataBBDD();
        fetchFeats();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 container my-4">
                <div className="row g-3">
                    {featsList.map(feat => (
                        <div className="col-12" key={feat.index}>
                            <div className="border rounded p-3 shadow-sm bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 me-3">{feat.name}</h5>
                                    <Link to={`/SRD/Feat/${feat.index}`} className="btn btn-sm btn-primary">
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
 * Componente que muestra los detalles de un logro (feat) específico.
 * 
 * @component
 * @returns {JSX.Element} Detalles del feat seleccionado.
 */
function Feat(){
    const { id } = useParams();
    const [ feat, setFeat ] = useState({});

    useEffect(() => {
        const nameCollection = "SRD_Feats";
        
         /**
         * Función que recupera los detalles de un feat específico desde la base de datos.
         * Actualiza el estado con los datos del feat si existe en Firestore.
         */
        async function fetchFeat() {
            const ref = doc(db,nameCollection, id);
            const document = await getDoc(ref);

            if(document.exists()){
                setFeat(document.data())
            }
        }

        fetchFeat()
    },[])

    if (Object.keys(feat).length === 0) {
        return <div>Loading...</div>
    }

    return (
        <>
          <Header />
          <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1 container my-4">
              <div className="bg-white border rounded shadow-sm p-4">
                <h1>{feat.name}</h1>
                {feat.prerequisites.length > 0 && (
                  <p>
                    <strong>Prerequisites:</strong>{" "}
                    {feat.prerequisites.map((data, i) => (
                      <span key={i}>
                        Minimum {data.minimum} in {data.name}
                        {i < feat.prerequisites.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                )}
                {feat.desc.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </main>
            <Footer />
          </div>
        </>
      );
      
    
    
}

export { FeatsList, Feat }