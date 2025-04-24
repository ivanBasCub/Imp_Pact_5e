import { useEffect, useState } from "react"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import MarkdownViewer from "../../Extras/MarkDownViewer";


{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

export default function Rules() {
    const [ruleList, setRuleList] = useState([]);

    // Efecto para almacenar información en la BBDD y mostrar la infomracón en la web
    useEffect(() => {
        const nameColeccion = "SRD_Rules";

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

        async function fecthRules() {
            const rulesColection = collection(db, nameColeccion);
            const data = await getDocs(rulesColection);

            setRuleList(data.docs.map(rule => rule.data()))
        }
        checkDataBBDD();
        fecthRules();
    }, []);


    return (
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
      );
      
      
}