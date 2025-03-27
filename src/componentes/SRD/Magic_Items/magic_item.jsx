import { use, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

// Componente que recoge la información de todos los objetos mágicos
function MagicItemList(){
    const [magicItems, setMagicItems] = useState([]);
    const [infoForm, setInfoForm] = useState({
        type: "all",
        rarity: "all"
    });

    // Evento para recoger la información del formulario
    const formEvent = (event) => {
        const { name, value } = event.target;
        setInfoForm((info) => ({
            ...info,
            [name]: value
        }));
    };

    // Efecto para recoger la información de la API de los objetos mágicos
    useEffect(()=>{
        const nameCollection = "SRD_magic_items";
        async function updateDataBBDD(){
            const res = await fetch(`${URL}/api/magic-items`);
            const data = await res.json();
            const items = data.results;
            const itemsPromises = items.map(item => fetch(`${URL}${item.url}`).then(res => res.json()));
            const listItems = await Promise.all(itemsPromises);

            listItems.forEach(async (item) => {
                const itemRef = doc(db, nameCollection, item.index);
                const itemDoc = await getDoc(itemRef);

                if (!itemDoc.exists()) {
                    var variants = item.variants.map(variant => variant.index) || [];
                    
                    setDoc(itemRef, {
                        index: item.index,
                        name: item.name,
                        equiment_category: item.equipment_category.index,
                        rarity: item.rarity.name,
                        variants: variants,
                        variant: item.variant,
                        desc: item.desc
                    })
                }
            });
        }

        async function checkDataBBDD(){
            const res = await fetch(`${URL}/api/magic-items`);
            const data = await res.json();
            const total = data.count;

            const itemsRef = collection(db, nameCollection);
            const itemsSnap = await getDocs(itemsRef);
            const items = itemsSnap.docs.length;
            if (items < total){
                updateDataBBDD();
            }
        }
        checkDataBBDD();
    },[]);

    // Efecto para filtrar los objetos mágicos
    useEffect(()=>{
        const nameCollection = "SRD_magic_items";
        async function getMagicItems(){
            const itemsRef = collection(db, nameCollection);
            const itemsSnap = await getDocs(itemsRef);
            var items = itemsSnap.docs.map(item => item.data());
            if (infoForm.type !== "all"){
                items = items.filter(item => item.equiment_category === infoForm.type);
            }
            if (infoForm.rarity !== "all"){
                items = items.filter(item => item.rarity.toLowerCase() === infoForm.rarity);
            }
            setMagicItems(items);
        }
        getMagicItems();
    }, [infoForm]);

    return(
        <div className="form">
            <form method="post">
                <h2>Magic Items List</h2>
                <div>
                    <label>Item Type</label>
                    <select name="type" onChange={formEvent} value={infoForm.type}>
                        <option value="all">All</option>
                        <option value="armor">Armor</option>
                        <option value="wondrous">Wondrous</option>
                        <option value="weapon">Weapon</option>
                        <option value="rod">Rod</option>
                        <option value="staff">Staff</option>
                        <option value="wand">Wand</option>
                        <option value="ring">Ring</option>
                        <option value="potion">Potion</option>
                    </select>
                </div>
                <div>
                    <label>Item Rarity</label>
                    <select name="rarity" onChange={formEvent} value={infoForm.rarity}>
                        <option value="all">All</option>
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="very rare">Very Rare</option>
                        <option value="legendary">Legendary</option>
                        <option value="artifact">Artifact</option>
                        <option value="varies">Varies</option>
                    </select>
                </div>
            </form>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Item Type</th>
                            <th>Item Rarity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {magicItems.map(item =>(
                            <tr key={item.index}>
                                <td><Link to={`/SRD/MagicItem/${item.index}`}>{item.name}</Link></td>
                                <td>{item.equiment_category}</td>
                                <td>{item.rarity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>   
            </div>
        </div>   
    )
}

// Componente que recoge la información de un objeto mágico en concreto
function MagicItem(){
    const { id } = useParams();
    const [magicItem, setMagicItem] = useState({});

    // Efecto para recoger la información de un objeto mágico en concreto
    useEffect(()=>{
        const nameCollection = "SRD_magic_items";
        async function getMagicItem(){
            const itemRef = doc(db, nameCollection, id);
            const itemDoc = await getDoc(itemRef);
            console.log(itemDoc.data());
            if (itemDoc.exists()){
                setMagicItem(itemDoc.data());
            }
        }
        getMagicItem();
    },[]);

    return(
        <div key={magicItem.index}>
            <h2>{magicItem.name}</h2>
            <div>
                <p><b>Item Type: </b> {magicItem.equiment_category}</p>
                <p><b>Item Rarity: </b> {magicItem.rarity}</p>
                <p><b>Item Description: </b></p>
                {magicItem.desc && magicItem.desc.map((desc, index) => (
                    <p key={index}>{desc}</p>
                ))}
            </div>
        </div>
    )

}

export { MagicItemList, MagicItem }