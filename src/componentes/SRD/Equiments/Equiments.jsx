import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

function EquimentList() {
    const nameCollection = "SRD_Equipments";
    const equiemntsTypes = ["weapon", "armor", "adventuring-gear", "mounts-and-vehicles", "tools"];

    useEffect(() => {

        async function updateDataBBDD() {
            const res = await fetch(`${URL}/api/2014/equipment`);
            const data = await res.json();
            const list = data.results;
            const listPromises = list.map(equiment => fetch(`${URL}${equiment.url}`).then(res => res.json()));
            const listEquiment = await Promise.all(listPromises);

            listEquiment.forEach(async equiment => {
                const equimentRef = doc(db, nameCollection, equiment.index);
                const equimentDoc = await getDoc(equimentRef);

                if (!equimentDoc.exists()) {
                    if (equiment.equipment_category.index === equiemntsTypes[0]) {
                        var damage = {
                            type: equiment.damage?.damage_type?.index || "",
                            dice: equiment.damage?.damage_dice || 0
                        }
                        var properties = equiment.properties.map(property => property.index);

                        setDoc(equimentRef, {
                            index: equiment.index,
                            name: equiment.name,
                            desc: equiment.desc,
                            equipment_category: equiment.equipment_category.index,
                            weapon_category: equiment.weapon_category,
                            weapon_range: equiment.weapon_range,
                            category_range: equiment.category_range,
                            range: equiment.range,
                            damage: damage,
                            properties: properties,
                            cost: equiment.cost,
                            special: equiment.special,
                            weight: equiment.weight,
                        })
                    }

                    if (equiment.equipment_category.index === equiemntsTypes[1]) {
                        setDoc(equimentRef, {
                            index: equiment.index,
                            name: equiment.name,
                            desc: equiment.desc,
                            cost: equiment.cost,
                            equipment_category: equiment.equipment_category.index,
                            armor_category: equiment.armor_category,
                            armor_class: equiment.armor_class,
                            stealth_disadvantage: equiment.stealth_disadvantage,
                            weight: equiment.weight,
                            str_minimun: equiment.str_minimum,
                            properties: equiment.properties,
                            special: equiment.special
                        })
                    }

                    if (equiment.equipment_category.index === equiemntsTypes[2]) {
                        setDoc(equimentRef, {
                            index: equiment.index,
                            name: equiment.name,
                            desc: equiment.desc,
                            cost: equiment.cost,
                            weight: equiment.weight || 0,
                            equipment_category: equiment.equipment_category.index,
                            gear_category: equiment.gear_category.index,
                            properties: equiment.properties,
                            special: equiment.special
                        })
                    }

                    if (equiment.equipment_category.index === equiemntsTypes[3]) {
                        var speed = equiment.speed || null;

                        setDoc(equimentRef, {
                            index: equiment.index,
                            name: equiment.name,
                            desc: equiment.desc,
                            cost: equiment.cost,
                            weight: equiment.weight || 0,
                            equipment_category: equiment.equipment_category.index,
                            speed: speed,
                            properties: equiment.properties,
                            special: equiment.special
                        })
                    }

                    if (equiment.equipment_category.index === equiemntsTypes[4]) {
                        setDoc(equimentRef, {
                            index: equiment.index,
                            name: equiment.name,
                            desc: equiment.desc,
                            cost: equiment.cost,
                            weight: equiment.weight || 0,
                            equipment_category: equiment.equipment_category.index,
                            tool_category: equiment.tool_category,
                            properties: equiment.properties,
                            special: equiment.special
                        })
                    }
                }
            })
        }

        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/equipment`);
            const data = await res.json();
            const total = data.count;

            const featRef = collection(db, nameCollection);
            const query = await getDocs(featRef);
            const equiment = query.docs.length;

            if (equiment < total) {
                updateDataBBDD();
            }
        }

        checkDataBBDD();
    }, [])

    return (
        <div>
            <h1>Equiments Types</h1>
            <div>
                <h4>Weapons</h4>
                <Link to={`/SRD/Equiment/${equiemntsTypes[0]}`}>More Info</Link>
            </div>
            <div>
                <h4>Armors</h4>
                <Link to={`/SRD/Equiment/${equiemntsTypes[1]}`}>More Info</Link>
            </div>

            <div>
                <h4>Adventuring gear</h4>
                <Link to={`/SRD/Equiment/${equiemntsTypes[2]}`}>More Info</Link>
            </div>

            <div>
                <h4>Mounts and Vehicules</h4>
                <Link to={`/SRD/Equiment/${equiemntsTypes[3]}`}>More Info</Link>
            </div>

            <div>
                <h4>Tools</h4>
                <Link to={`/SRD/Equiment/${equiemntsTypes[4]}`}>More Info</Link>
            </div>
        </div>
    )

}

function Equiments() {
    const id = useParams();
    const [equipmentCategoryList, setEquipmentCategoryList] = useState([]);
    const nameCollection = "SRD_Equipments";

    useEffect(() => {

        async function fetchEquipments() {
            const ref = collection(db, nameCollection);
            const documents = await getDocs(ref);
            const filteredEquipments = [];

            documents.forEach(document => {
                const data = document.data();
                if (data.equipment_category === id.id) {
                    filteredEquipments.push(data);
                }
            });

            setEquipmentCategoryList(filteredEquipments);
        }

        fetchEquipments();
    }, [])


    return (
        <div>
            <h1>
                {id.id === "weapon" ? (<>Weapons</>) : ""}
                {id.id === "armor" ? (<>Armors</>) : ""}
                {id.id === "adventuring-gear" ? (<>Adventuring gear</>) : ""}
                {id.id === "mounts-and-vehicles" ? (<>Mounts and Vehicules</>) : ""}
                {id.id === "tools" ? (<>Tools</>) : ""}
            </h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        {id.id === "weapon" ? (
                            <>
                                <th>Weapon Category</th>
                                <th>Attack Type</th>
                                <th>Damage</th>
                                <th>Properties</th>
                                <th>Weight</th>
                            </>
                        ) : ""}
                        {id.id === "armor" ? (
                            <>
                                <th>Armor type</th>
                                <th>AC</th>
                                <th>Strength</th>
                                <th>Stealth</th>
                                <th>Weight</th>
                            </>
                        ) : ""}
                        {id.id === "adventuring-gear" ? (
                            <>
                                <th>Description</th>
                                <th>Weight</th>
                            </>
                        ): ""}
                        {id.id === "mounts-and-vehicles" ? (
                            <>
                                <th>Speed</th>
                                <th>Weight</th>
                            </>
                        ) : ""} 
                        {id.id === "tools" ? (
                            <>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Weight</th>
                            </>
                        ) : ""}                       

                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {console.log(equipmentCategoryList)}
                    {equipmentCategoryList.map(equipment => (
                        <tr>
                            <td>{equipment.name}</td>
                            {equipment.equipment_category === "weapon" ? (
                                <>
                                    <td>{equipment.weapon_category}</td>
                                    <td>{equipment.weapon_range}</td>
                                    <td>{equipment.weapon_range === "Ranged" ? (<>{equipment.damage.dice} {equipment.damage.type} ({equipment.range.normal} ft / {equipment.range.long}ft)</>) : (<>{equipment.damage.dice} {equipment.damage.type}</>)}</td>
                                    <td>{equipment.properties.join(", ")}</td>
                                    <td>{equipment.weight} lb</td>
                                </>
                            ) : ""}
                            {equipment.equipment_category === "armor" ? (
                                <>
                                    <td>{equipment.armor_category}</td>
                                    <td>{equipment.armor_class.base} {equipment.armor_class.dex_bonus === true ? (<>+ Dex modifier {equipment.armor_class.max_bonus ? (<>(max {equipment.armor_class.max_bonus})</>) : ""} </>) : ""}</td>
                                    <td>{equipment.str_minimun != 0 ? (<>{equipment.str_minimun}</>): (<> - </>)}</td>
                                    <td>{equipment.stealth_disadvantage === true ? (<>Disadvantage</>): (<> - </>)}</td>
                                    <td>{equipment.weight} lb</td>

                                </>
                            ) : ""}
                            {equipment.equipment_category === "adventuring-gear" ? (
                                <>
                                    <td>{equipment.desc.join(" ")}</td>
                                    <td>{equipment.weight} lb</td>
                                </>
                            ) : ""}
                            {equipment.equipment_category === "mounts-and-vehicles" ? (
                                <>
                                    <td>{equipment.speed != null ? (<> {equipment.speed.quantity} {equipment.speed.unit}</>) : (<> - </>) }</td>
                                    <td>{equipment.weight} lb</td>
                                </>
                            ) :""}
                            {equipment.equipment_category === "tools" ?(
                                <>
                                    <td>{equipment.tool_category}</td>
                                    <td>{equipment.desc.join(" ")}</td>
                                    <td>{equipment.weight} lb</td>
                                </>
                            ) : ""}
                            <td>{equipment.cost.quantity}{equipment.cost.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export { EquimentList, Equiments }; 
