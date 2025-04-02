import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function BackgroundList() {
    const nameCollection = "SRD_Backgrounds";
    const [backgroundList, setBackgroundList] = useState([]);

    useEffect(() => {
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
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/backgrounds`);
            const data = await res.json();
            const total = data.count;

            const featRef = collection(db, nameCollection);
            const query = await getDocs(featRef);
            const backgrounds = query.docs.length;

            if(backgrounds < total){
                updateDataBBDD();
            }
        }

        async function fetchBackgrounds() {
            const backgroundRef = collection(db, nameCollection);
            const query = await getDocs(backgroundRef)

            setBackgroundList(query.docs.map(background => background.data()))
        }

        checkDataBBDD()
        fetchBackgrounds()
    }, [])

    return (
        <div>
            <h1>Backgrounds</h1>
            {backgroundList.map(background => (
                <div>
                <div>
                    <h5>{background.name}</h5>
                    <Link to={`/SRD/Background/${background.index}`}>More Info</Link>
                </div>
            </div>
            ))}
        </div>
    )
}

function Background() {
    const nameCollection = "SRD_Backgrounds";
    const id = useParams();
    const [background, setBackground] = useState([]);

    useEffect(() => {
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

    return(
        <div>
            <h2>{background.name}</h2>
        </div>
    )
}

export { BackgroundList, Background }