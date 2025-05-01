import { use, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../Header";
import Footer from "../../Footer";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

{/*
    Funcion que muestra toda la lista con la información de todos los mounstros    
*/}
function MonsterList() {
    // Constantes Necesarias para la lista
    const [list, setList] = useState([]);
    const [difCR, setDifCR] = useState([]);
    const [infoForm, setInfoForm] = useState({
        name: "",
        cr: 0,
        type: "all",
        size: "all"
    })

    // Evento para recoger la información del formulario
    const formEvent = (event) => {
        const { name, value } = event.target;
        setInfoForm((info) => ({
            ...info,
            [name]: value
        }));
    };

    // Efecto para comprobar que la BBDD esta actualizada 
    useEffect(() => {
        const nameCollection = "SRD_Monsters";
        async function updateDataBBDD() {
            // Recogemos la información de la API
            const res = await fetch(`${URL}/api/2014/monsters`)
            const data = await res.json();
            const listArray = data.results;
            const listPromises = listArray.map(monster => fetch(`${URL}${monster.url}`).then(res => res.json()));
            const listMonsterRaw = await Promise.all(listPromises);

            listMonsterRaw.forEach(async monster => {
                const monsterRef = doc(db, nameCollection, monster.index);
                const monsterDoc = await getDoc(monsterRef);

                if (!monsterDoc.exists()) {
                    // Aquí va el resto del código, como antes
                    var stats = ["str", "dex", "con", "int", "wis", "cha"];

                    var saves = monster.proficiencies.map(pf => {
                        if (pf?.proficiency?.index) {
                            var aux = pf.proficiency.index.split("-");
                            return stats.includes(aux[aux.length - 1]) ? { "index": aux[aux.length - 1], "value": pf.value } : null;
                        }
                    }).filter(item => item !== null);

                    var skills = monster.proficiencies.map(pf => {
                        if (pf?.proficiency?.index) {
                            var aux = pf.proficiency.index.split("-");
                            return !stats.includes(aux[aux.length - 1]) ? { "index": aux[aux.length - 1], "value": pf.value } : null;
                        }
                    }).filter(item => item !== null);

                    setDoc(monsterRef, {
                        index: monster.index,
                        name: monster.name,
                        size: monster.size,
                        type: monster.type,
                        alignment: monster.alignment,
                        armor_class: monster.armor_class,
                        hit_points: monster.hit_points,
                        hit_points_roll: monster.hit_points_roll,
                        speed: monster.speed,
                        strength: monster.strength,
                        dexterity: monster.dexterity,
                        constitution: monster.constitution,
                        intelligence: monster.intelligence,
                        wisdom: monster.wisdom,
                        charisma: monster.charisma,
                        saving_throws: saves,
                        skills: skills,
                        senses: monster.senses,
                        languages: monster.languages,
                        challenge_rating: monster.challenge_rating,
                        xp: monster.xp,
                        proficiency_bonus: monster.proficiency_bonus,
                        damage_vulnerabilities: monster.damage_vulnerabilities,
                        damage_resistances: monster.damage_resistances,
                        damage_immunities: monster.damage_immunities,
                        condition_immunities: monster.condition_immunities,
                        special_abilities: monster.special_abilities || "",
                        actions: monster.actions || "",
                        legendary_actions: monster.legendary_actions || ""
                    });
                }
            })
        }
        // Funcion para actualizar la BBDD
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/monsters`);
            const data = await res.json();
            const total = data.count;

            const monstersRef = collection(db, nameCollection);
            const query = await getDocs(monstersRef);
            const monsters = query.size;
            if (monsters < total) {
                updateDataBBDD();
            }
        }

        checkDataBBDD();
    }, [])


    // UseEffect para actualizar la información de la API
    useEffect(() => {
        const nameCollection = "SRD_Monsters";
        async function fecthList() {
            const monstersRef = collection(db, nameCollection);
            const query = await getDocs(monstersRef);
            var filterData = null;
            if (infoForm.cr === "-1") {
                filterData = query.docs.map(monster => monster.data());

                if(infoForm.type !== "all") {
                    filterData = filterData.filter(monster => monster.type === infoForm.type);
                }
                if(infoForm.size !== "all") {
                    filterData = filterData.filter(monster => monster.size === infoForm.size);
                }
                setList(filterData);
            }else{
                filterData = query.docs.filter(monster => monster.data().challenge_rating === parseFloat(infoForm.cr));

                if (infoForm.type !== "all") {
                    filterData = filterData.filter(monster => monster.data().type === infoForm.type);
                }
                if (infoForm.size !== "all") {
                    filterData = filterData.filter(monster => monster.data().size === infoForm.size);
                }
                setList(filterData.map(monster => monster.data()));
            }
        }

        async function fecthListName(){
            const MonsterName = infoForm.name.toLowerCase().split(" ").join("-");
            const monsterDoc = await getDoc(doc(db, nameCollection, MonsterName));
            if (monsterDoc.exists()) {
                setList([monsterDoc.data()]);
            } else {
                setList([]);
            }
        }
        function filter(){
            if (infoForm.name !== "") {
                fecthListName();
            } else {
                fecthList();
            }
        }
        filter();
    }, [infoForm])

    // UseEffect para generar el apartado del Challenge Rating o CR
    useEffect(() => {
        const CR = [];
        let aux = 8;
        for (let i = 0; i < 34; i++) {
            if (i >= 1 && i < 4) {
                let cr = 1 / aux;
                CR.push(cr);
                aux = aux / 2;
            } else {
                if (i === 0) {
                    CR.push(i);
                } else {
                    CR.push(i - 3);
                }
            }
        }
        setDifCR(CR);
    }, []);

    return (
    <>
        <Header></Header>
        <main className="flex-grow-1 flex-column container my-4">
            <div className="card p-4 mb-4 shadow-sm">
            <h2 className="mb-3">Monster List</h2>
            <form method="post">
                <div className="row g-3">
                <div className="col-md-3">
                    <label htmlFor="name" className="form-label">Monster Name</label>
                    <input type="text" id="name" name="name" className="form-control" onChange={formEvent} value={infoForm.name} placeholder="Monster Name" />
                </div>
                <div className="col-md-3">
                    <label htmlFor="cr" className="form-label">Challenge Rating (CR)</label>
                    <select id="cr" name="cr" className="form-select" onChange={formEvent} value={infoForm.cr}>
                        <option value="-1" selected>All CR</option>
                        {difCR.map((cr, i) => (
                            <option key={i} value={cr}>CR {cr}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3">
                    <label htmlFor="type" className="form-label">Creature Type</label>
                    <select id="type" name="type" className="form-select" onChange={formEvent} value={infoForm.type}>
                    <option value="all" selected>All Types</option>
                    <option value="aberration">Aberration</option>
                    <option value="beast">Beast</option>
                    <option value="celestial">Celestial</option>
                    <option value="construct">Construct</option>
                    <option value="dragon">Dragon</option>
                    <option value="elemental">Elemental</option>
                    <option value="fey">Fey</option>
                    <option value="fiend">Fiend</option>
                    <option value="giant">Giant</option>
                    <option value="humanoid">Humanoid</option>
                    <option value="monstrosity">Monstrosity</option>
                    <option value="ooze">Ooze</option>
                    <option value="plant">Plant</option>
                    <option value="undead">Undead</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <label htmlFor="size" className="form-label">Size</label>
                    <select id="size" name="size" className="form-select" onChange={formEvent} value={infoForm.size}>
                    <option value="all" selected>All Sizes</option>
                    <option value="Tiny">Tiny</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Gargantuan">Gargantuan</option>
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
                    <th>Name</th>
                    <th>CR</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Alignment</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(monster => (
                    <tr key={monster.index}>
                        <td>
                        <Link to={`/SRD/monster/${monster.index}`}>{monster.name}</Link>
                        </td>
                        <td>{monster.challenge_rating}</td>
                        <td>{monster.type}</td>
                        <td>{monster.size}</td>
                        <td>{monster.alignment}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </main>
        <Footer></Footer>
    </>    
    );

}


{/*
    Función que muestra toda la información necesaria que se recolecta de la API
*/}

function Monster() {
    // Constantes que vamos a necesitar
    const { id } = useParams();
    const [monster, setMonster] = useState({});
    var stats = ["str", "dex", "con", "int", "wis", "cha"];

    useEffect(() => {
        async function fecthMonster() {
            const nameCollection = "SRD_Monsters";
            const monsterRef = doc(db, nameCollection, id);
            const monsterDoc = await getDoc(monsterRef);

            if (monsterDoc.exists()) {
                setMonster(monsterDoc.data());
            }
        }
        fecthMonster();
    }, [])

    // Comprobación que se haya recogido la información de la API. Para que no nos de errores las comprobaciones en el return y no carge el componente
    if (Object.keys(monster).length === 0) {
        return <div>Loading...</div>
    }

    // Imprimimos la infomración por pantalla
    return (
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 container my-4">
            <div className="border rounded p-4 shadow-sm bg-light" key={monster.index}>
              <h2 className="mb-3">{monster.name}</h2>
              <hr></hr>
              <p className="mb-1">{monster.size} {monster.type}, {monster.alignment}</p>
              <p className="mb-1">AC {monster.armor_class[0].value} ({monster.armor_class[0].type} armor)</p>
              <p className="mb-1">HP {monster.hit_points} ({monster.hit_points_roll})</p>
              <p className="mb-1">
                <b>Speed:</b>{" "}
                {Object.entries(monster.speed).map(([type, value], i) => (
                  <span key={i}>{type} {value}{' '}</span>
                ))}
              </p>
              <p className="mb-1">
                <b>Initiative:</b>{" "}
                {(monster.dexterity / 2) - 5 >= 0 ? `+${parseInt(monster.dexterity / 2) - 5}` : `${parseInt(monster.dexterity / 2) - 5}`}
              </p>
      
              <div className="table-responsive my-3">
                <table className="table table-bordered table-sm text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th colSpan={2}>Stat</th>
                      <th>Mod</th>
                      <th>Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableStats("str", monster.strength, monster.saving_throws.find(st => st.index === "str")?.value)}
                    {tableStats("dex", monster.dexterity, monster.saving_throws.find(st => st.index === "dex")?.value)}
                    {tableStats("con", monster.constitution, monster.saving_throws.find(st => st.index === "con")?.value)}
                    {tableStats("int", monster.intelligence, monster.saving_throws.find(st => st.index === "int")?.value)}
                    {tableStats("wis", monster.wisdom, monster.saving_throws.find(st => st.index === "wis")?.value)}
                    {tableStats("cha", monster.charisma, monster.saving_throws.find(st => st.index === "cha")?.value)}
                  </tbody>
                </table>
              </div>
      
              <p><b>Damage Resistances:</b> {monster.damage_resistances.length > 0 ? monster.damage_resistances.join(", ") : "--"}</p>
              <p><b>Damage Immunities:</b> {monster.damage_immunities.length > 0 ? monster.damage_immunities.join(", ") : "--"}</p>
              <p><b>Condition Immunities:</b> {
                monster.condition_immunities.length > 0
                  ? monster.condition_immunities.map((c, i) => <span key={i}>{c.name}{i < monster.condition_immunities.length - 1 && ', '}</span>)
                  : "--"
              }</p>
              <p><b>Skills:</b> {
                monster.skills.length > 0
                  ? monster.skills.map((skill, i) => <span key={i}>{skill.index} +{skill.value}{i < monster.skills.length - 1 && ', '}</span>)
                  : "--"
              }</p>
              <p><b>Languages:</b> {monster.languages || "--"}</p>
              <p><b>CR:</b> {monster.challenge_rating} (XP {monster.xp}; PB +{monster.proficiency_bonus})</p>
      
              {monster.special_abilities.length !== 0 && (
                <div className="mt-4 border rounded p-3 bg-white shadow-sm">
                    <h4>Traits</h4>
                    {monster.special_abilities.map((trait, i) => (
                    <p key={i}><b>{trait.name}.</b> {trait.desc}</p>
                    ))}
                </div>
                )}

                <div className="mt-4 border rounded p-3 bg-white shadow-sm">
                <h4>Actions</h4>
                {monster.actions.map((action, i) => (
                    <p key={i}><b>{action.name}.</b> {action.desc}</p>
                ))}
                </div>

                {monster.legendary_actions.length !== 0 && (
                <div className="mt-4 border rounded p-3 bg-white shadow-sm">
                    <h4>Legendary Actions</h4>
                    {monster.legendary_actions.map((la, i) => (
                    <p key={i}><b>{la.name}.</b> {la.desc}</p>
                    ))}
                </div>
                )}

            </div>
          </main>
          <Footer />
        </div>
      );
      
}
{/* 
    Función para imprimir     
*/}
function tableStats(name, stat, save) {

    return (
        <tr>
            <td>{name.toUpperCase()}</td>
            <td>{stat}</td>
            <td>{(parseInt(stat / 2) - 5) > 0 ? `+${parseInt(stat / 2) - 5}` : `${parseInt(stat / 2) - 5}`}</td>
            <td>{save ? `+${parseInt(save)}` : (parseInt(stat / 2) - 5) > 0 ? `+${parseInt(stat / 2) - 5}` : `${parseInt(stat / 2) - 5}`}</td>
        </tr>
    )
}


export { MonsterList, Monster }