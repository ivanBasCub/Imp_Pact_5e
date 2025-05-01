import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../Header";
import Footer from "../../Footer";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

// Componente que recoge la información de todos los objetos mágicos
function MagicItemList(){
    const [magicItems, setMagicItems] = useState([]);
    const [infoForm, setInfoForm] = useState({
        name: "",
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
        const nameCollection = "SRD_Magic_Items";
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
        const nameCollection = "SRD_Magic_Items";
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

        async function getMagicItem(){
            const regex = /[ +]/;
            const item = infoForm.name.toLowerCase().replace(" ","");
            const itemName = item.split(regex).join("-");
            const itemDoc = await getDoc(doc(db, nameCollection, itemName));
            if (itemDoc.exists()){
                const item = itemDoc.data();
                setMagicItems([item]);
            }
        }

        function filterItems(){
            if (infoForm.name !== ""){
                getMagicItem();
            }else{
                getMagicItems();
            }
        }
        filterItems();
        
    }, [infoForm]);

    return (
        <>
            <Header></Header>
            <main className="flex-grow-1 flex-column container my-4">
                <div className="card p-4 mb-4 shadow-sm">
                    <h2 className="mb-3">Magic Items List</h2>
                    <form method="post">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label htmlFor="name" className="form-label">Item Name</label>
                                <input text="text" className="form-control" id="name" name="name" placeholder="Item Name" onChange={formEvent} value={infoForm.name} />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="type" className="form-label">Item Type</label>
                                <select id="type" name="type" className="form-select" onChange={formEvent} value={infoForm.type}>
                                    <option value="all">All</option>
                                    <option value="armor">Armor</option>
                                    <option value="wondrous-items">Wondrous</option>
                                    <option value="weapon">Weapon</option>
                                    <option value="rod">Rod</option>
                                    <option value="staff">Staff</option>
                                    <option value="wand">Wand</option>
                                    <option value="ring">Ring</option>
                                    <option value="potion">Potion</option>
                                </select>
                            </div>
    
                            <div className="col-md-4">
                                <label htmlFor="rarity" className="form-label">Item Rarity</label>
                                <select id="rarity" name="rarity" className="form-select" onChange={formEvent} value={infoForm.rarity}>
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
                        </div>
                    </form>
                </div>
    
                <div className="card p-3 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Item Name</th>
                                    <th>Item Type</th>
                                    <th>Item Rarity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {magicItems.length !== 0 ? (
                                    magicItems.map(item => (
                                        <tr key={item.index}>
                                            <td>
                                                <Link to={`/SRD/magic_item/${item.index}`}>{item.name}</Link>
                                            </td>
                                            <td>{item.equiment_category.split("-").join(" ")}</td>
                                            <td>{item.rarity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>Magic items not found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </>
    );
    
}

// Componente que recoge la información de un objeto mágico en concreto
function MagicItem(){
    const { id } = useParams();
    const [magicItem, setMagicItem] = useState({});

    // Efecto para recoger la información de un objeto mágico en concreto
    useEffect(()=>{
        const nameCollection = "SRD_Magic_Items";
        async function getMagicItem(){
            const itemRef = doc(db, nameCollection, id);
            const itemDoc = await getDoc(itemRef);

            if (itemDoc.exists()){
                setMagicItem(itemDoc.data());
            }else{
                console.log("No existe el objeto mágico");
            }
        }
        getMagicItem();
    },[]);

    if(Object.keys(magicItem).length === 0){
        return(
            <div className="loading">
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 container my-4">
            <div className="border rounded p-4 shadow-sm bg-light">
              <h2 className="mb-3">{magicItem.name}</h2>
              <p><b>Item Type:</b> {magicItem.equiment_category}</p>
              <p><b>Item Rarity:</b> {magicItem.rarity}</p>
              {magicItem.variants.length > 0 && (
                <p><b>Variants:</b> {magicItem.variants.map((v, i) => (
                  <span key={i}>
                    <Link to={`/SRD/magic_item/${v}`}>{v}</Link>{i < magicItem.variants.length - 1 && ', '}
                  </span>
                ))}</p>
              )}
              <p><b>Item Description:</b></p>
              {magicItem.desc?.map((desc, index) => (
                <p key={index}>{desc}</p>
              ))}
            </div>
          </main>
          <Footer />
        </div>
      );
      

}

export { MagicItemList, MagicItem }