import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function FeatsList() {
    const [featsList, setfeatsLits] = useState([]);

    useEffect(() => {
        const nameCollection = "SRD_Feats";

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

        async function fetchFeats(){
            const featRef = collection(db, nameCollection);
            const query = await getDocs(featRef);

            setfeatsLits(query.docs.map(feat => feat.data()));
        }

        checkDataBBDD();
        fetchFeats();
    }, []);

    return (
        <div>
            {featsList.map(feat =>(
                <div>
                    <div>
                        <h5>{feat.name}</h5>
                        <Link to={`/SRD/Feat/${feat.index}`}>More Info</Link>
                    </div>
                </div>
            ))}
        </div>
    )

}

function Feat(){
    const { id } = useParams();
    const [ feat, setFeat ] = useState({});

    useEffect(() => {
        const nameCollection = "SRD_Feats";
        
        async function fetchFeat() {
            const ref = doc(db,nameCollection, id);
            const document = await getDoc(ref);

            if(document.exists()){
                setFeat(document.data())
            }
        }

        fetchFeat()
    },[])

    return (
        <div>
            <h1>{feat.name}</h1>
            {feat.desc.map(p => (<p>{p}</p>))}
        </div>
    )
}

export { FeatsList, Feat }