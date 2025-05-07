import { useEffect, useState } from "react"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import MarkdownViewer from "../../Extras/MarkDownViewer";
import Footer from "../../Footer";
import Header from "../../Header";

/**
 * URL base para obtener los datos de la API de D&D 5e.
 * @constant {string}
 */ 
const URL = "https://www.dnd5eapi.co";

/**
 * Componente que maneja la visualización de las reglas.
 * Este componente obtiene las reglas desde la API de D&D y las almacena en Firebase, 
 * luego muestra la información en la interfaz de usuario.
 * 
 * @return {JSX.Element} El componente renderizado con las reglas de D&D.
 */
export default function Rules() {
    const [ruleList, setRuleList] = useState([]);

    // Efecto para almacenar información en la BBDD y mostrar la infomracón en la web
    useEffect(() => {
        const nameColeccion = "SRD_Rules";

        /**
         * Actualiza la base de datos con las reglas obtenidas de la API de D&D.
         * Si una regla no existe en Firebase, obtiene sus subsecciones y las guarda.
         * 
         * @async
         * @function
         */
        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/2014/rules`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(rule => fetch(`${URL}${rule.url}`).then(res => res.json()));
            const listRules = await Promise.all(listPromises);

            listRules.map(async rule => {
                const ruleRef = doc(db, nameColeccion, rule.index);
                const ruleDoc = await getDoc(ruleRef);

                if (!ruleDoc.exists()) {
                    var sections = await Promise.all(rule.subsections.map(async section => {
                        var res_section = await fetch(`${URL}${section.url}`);
                        var data_section = await res_section.json();
                        return {
                            name: data_section.name,
                            desc: data_section.desc
                        };
                    }));

                    setDoc(ruleRef, {
                        index: rule.index,
                        name: rule.name,
                        sections: sections
                    })
                }
            });
        }

        /**
         * Verifica si el número de reglas en Firebase coincide con el número total de reglas en la API de D&D.
         * Si el número de reglas en la base de datos es menor, actualiza los datos.
         * 
         * @async
         * @function
         */
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/rules`);
            const data = await res.json();
            const total = data.count;

            const rulesColection = collection(db, nameColeccion);
            const query = await getDocs(rulesColection);
            const rules = query.size;

            if (rules < total) {
                updateDataBBDD();
            }
        }

        /**
         * Obtiene las reglas almacenadas en Firebase y actualiza el estado del componente.
         * 
         * @async
         * @function
         */
        async function fecthRules() {
            const rulesColection = collection(db, nameColeccion);
            const data = await getDocs(rulesColection);

            setRuleList(data.docs.map(rule => rule.data()))
        }
        checkDataBBDD();
        fecthRules();
    }, []);


    return (
        <>
        <Header></Header>
        <div className="container my-4" style={{ display: 'block' }}>
          {ruleList.map((rule, i) => (
            <div key={i} className="border rounded p-4 bg-light mb-5">
              <h1 className="h4 mb-4">{rule.name}</h1>
              {rule.sections.map((section, j) => (
                <div key={j}>
                  <div className="border rounded p-3 bg-white">
                    <MarkdownViewer markdown={section.desc} />
                  </div>
                  {j < rule.sections.length - 1 && <hr className="my-4" />}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Footer></Footer>
        </>
      );
      
      
}