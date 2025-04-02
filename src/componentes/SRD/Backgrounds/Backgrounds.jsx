import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function BackgroundList(){
    const nameCollection = "SRD_Backgrounds";
    const [ backgroundList, setBackgroundList ] = useState([]);

    useEffect(() => {

        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/2014/backgrounds`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(background => fetch(`${URl}${background.url}`).then(res => res.json()));
            const listBackground = await Promise.all(listPromises);

            listBackground.map(async background => {
                
            })
        }

        async function checkDataBBDD() {
            
        }

    }, [])
}

function Background(){
    const nameCollection = "SRD_Backgrounds";
    const [ background, setBackground ] = useState([]);

    useEffect(() => {

    },[]);
}

export { BackgroundList, Background }