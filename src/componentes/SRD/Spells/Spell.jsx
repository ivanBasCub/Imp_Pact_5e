import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import MarkdownViewer from "../../Extras/MarkDownViewer";
import Header from "../../Header";
import Footer from "../../Footer";

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

{/*
  Este componente se encarga de mostrar la lista de hechizos especifico de una clase
*/}
function SpellList() {
    // Constantes que van a ser necesarias para el filtrado de información que vamos a recoger de la API
    const fullCasters = ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"];
    // Constantes generales
    const { clase } = useParams()
    const [list, setList] = useState([])

    // Constante para recoger la información del formulario
    const [infoForm, setInfoForm] = useState({
        level: 0 || 1,
        school: "all",
        class: clase || 'all'
    })

    // Evento para recoger la información del formulario
    const formEvent = (event) => {
        const { name, value } = event.target;
        setInfoForm((info) => ({
            ...info,
            [name]: value
        }));
    };


    // Usamos este useEffect para actualizar la BBDD de Firebase con la información de la API
    useEffect(() => {
        const nanmeColeccion = "SRD_Spells";

        // Funcion para actualizar la BBDD con la información de la API
        async function updateDataBBDD() {
            // Recogemos la información de la API
            const res = await fetch(`${URL}/api/2014/spells`);
            const data = await res.json();
            const listArray = data.results;
            const listSpellPromises = listArray.map(spell => fetch(`${URL}${spell.url}`).then(res => res.json()));
            const listSpell = await Promise.all(listSpellPromises);

            // En el caso de que no existe el spell dentro de la colección Spells en la BBDD la creamos
            listSpell.map(async spell => {
                const spellRef = doc(db, nanmeColeccion, spell.index);
                const spellDoc = await getDoc(spellRef);

                if (!spellDoc.exists()) {
                    var classes = spell.classes.map(clase => clase.index);
                    var subclasses = spell.subclasses.map(subclase => subclase.index);
                    var damage_type = spell.damage?.damage_type?.name;
                    var damage_at_slot_level = spell.damage?.damage_at_slot_level || [];

                    setDoc(spellRef, {
                        index: spell.index,
                        name: spell.name,
                        level: spell.level,
                        school: spell.school.index,
                        casting_time: spell.casting_time,
                        range: spell.range,
                        duration: spell.duration,
                        components: spell.components,
                        material: spell.material || "",
                        ritual: spell.ritual,
                        desc: spell.desc,
                        higher_level: spell.higher_level,
                        damage_type: damage_type || "",
                        damage_at_slot_level: damage_at_slot_level,
                        classes: classes,
                        subclasses: subclasses
                    })
                }
            })
        }
        // Funcion para comprobar si la información de la API y la BBDD coinciden
        async function checkDataBBDD() {
            const res = await fetch(`${URL}/api/2014/spells`);
            const data = await res.json();
            const total = data.count;

            const collectionRef = collection(db, nanmeColeccion);
            const query = await getDocs(collectionRef);
            const totalSpell = query.size;

            if (totalSpell < total) {
                updateDataBBDD();
            }
        }
        checkDataBBDD();
    }, [])



    // Actualizamos los datos recogidos por la API
    useEffect(() => {
        const nanmeColeccion = "SRD_Spells";
        // Funcion para filtrar la información de la BBDD segun los parametros del formulario
        async function fetchList() {
            const collectionRef = collection(db, nanmeColeccion);
            const query = await getDocs(collectionRef);

            var filterData = query.docs.filter(spell => spell.data().level === parseInt(infoForm.level));
            if (infoForm.school !== "all") {
                filterData = filterData.filter(spell => spell.data().school === infoForm.school);
            }
            if (infoForm.class !== "all") {
                filterData = filterData.filter(spell => spell.data().classes.includes(infoForm.class));
            }
            setList(filterData.map(spell => spell.data()));
        }
        fetchList();
    }, [infoForm]);

    return (
        <>
            <Header></Header>
            <main className="flex-grow-1 flex-column container my-4">
                <div className="card p-4 mb-4 shadow-sm">
                    <h2 className="mb-3">Spell List</h2>
                    <form method="post">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label htmlFor="level" className="form-label">Spell Level</label>
                                <select
                                    id="level"
                                    name="level"
                                    className="form-select"
                                    onChange={formEvent}
                                    value={infoForm.level}
                                >
                                    {infoForm.class === "all" ? (
                                        <>
                                            <option value="0">Cantrips</option>
                                            <option value="1">Level 1</option>
                                            <option value="2">Level 2</option>
                                            <option value="3">Level 3</option>
                                            <option value="4">Level 4</option>
                                            <option value="5">Level 5</option>
                                            <option value="6">Level 6</option>
                                            <option value="7">Level 7</option>
                                            <option value="8">Level 8</option>
                                            <option value="9">Level 9</option>
                                        </>
                                    ) : (
                                        <>
                                            {fullCasters.includes(infoForm.class) ? (
                                                <>
                                                    <option value="0">Cantrips</option>
                                                    <option value="1">Level 1</option>
                                                </>
                                            ) : (
                                                <option value="1">Level 1</option>
                                            )}
                                            <option value="2">Level 2</option>
                                            <option value="3">Level 3</option>
                                            <option value="4">Level 4</option>
                                            <option value="5">Level 5</option>
                                            {fullCasters.includes(infoForm.class) && (
                                                <>
                                                    <option value="6">Level 6</option>
                                                    <option value="7">Level 7</option>
                                                    <option value="8">Level 8</option>
                                                    <option value="9">Level 9</option>
                                                </>
                                            )}
                                        </>
                                    )}
                                </select>
                            </div>
    
                            <div className="col-md-4">
                                <label htmlFor="school" className="form-label">Spell School</label>
                                <select
                                    id="school"
                                    name="school"
                                    className="form-select"
                                    onChange={formEvent}
                                    value={infoForm.school}
                                >
                                    <option value="all">All Schools</option>
                                    <option value="abjuration">Abjuration</option>
                                    <option value="conjuration">Conjuration</option>
                                    <option value="divination">Divination</option>
                                    <option value="enchantment">Enchantment</option>
                                    <option value="evocation">Evocation</option>
                                    <option value="illusion">Illusion</option>
                                    <option value="necromancy">Necromancy</option>
                                    <option value="transmutation">Transmutation</option>
                                </select>
                            </div>
    
                            {clase === undefined && (
                                <div className="col-md-4">
                                    <label htmlFor="class" className="form-label">Class Spell List</label>
                                    <select
                                        id="class"
                                        name="class"
                                        className="form-select"
                                        onChange={formEvent}
                                        value={infoForm.class}
                                    >
                                        <option value="all">All Classes</option>
                                        <option value="bard">Bard</option>
                                        <option value="cleric">Cleric</option>
                                        <option value="druid">Druid</option>
                                        <option value="paladin">Paladin</option>
                                        <option value="ranger">Ranger</option>
                                        <option value="sorcerer">Sorcerer</option>
                                        <option value="warlock">Warlock</option>
                                        <option value="wizard">Wizard</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
    
                <div className="card p-3 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>School</th>
                                    <th>Casting Time</th>
                                    <th>Range</th>
                                    <th>Duration</th>
                                    <th>Components</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length !== 0 ? (
                                    list.map(spell => (
                                        <tr key={spell.index}>
                                            <td>
                                                <Link to={`/SRD/spell/${spell.index}`}>{spell.name}</Link>
                                            </td>
                                            <td>{spell.school}</td>
                                            <td>{spell.casting_time} {spell.ritual ? "R" : ""}</td>
                                            <td>{spell.range}</td>
                                            <td>{spell.duration}</td>
                                            <td>{spell.components.join(', ')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>Spells not found</td>
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

{/*
  Este componente se encarga de mostrar la descripción de un hechizo que se haya seleccionado
  */}
function Spell() {
    const { id } = useParams()
    const [spell, setSpell] = useState({})

    useEffect(() => {
        const nanmeColeccion = "SRD_Spells";
        async function fetchSpell() {
            const spellRef = doc(db, nanmeColeccion, id);
            const spellDoc = await getDoc(spellRef);
            if (spellDoc.exists()) {
                setSpell(spellDoc.data());
            }
        }
        fetchSpell()
    }, [])

    // Comprobamos que se haya recogido la información del Spell antes de mostrar nada
    if (Object.keys(spell).length === 0) {
        return <div>Loading...</div>
    }

    // Imprimimos la información por pantalla
    return (
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 container my-4">
            <div className="border rounded p-4 shadow-sm bg-light" key={id}>
              <h2 className="mb-3">{spell.name}</h2>
              <p>
                {spell.level === 0
                  ? `${spell.school} Cantrip`
                  : spell.ritual
                  ? `${spell.school} Level ${spell.level} (Ritual)`
                  : `${spell.school} Level ${spell.level}`}
              </p>
              <p><b>Casting Time:</b> {spell.casting_time}</p>
              <p><b>Range:</b> {spell.range}</p>
              <p><b>Duration:</b> {spell.concentration ? 'Concentration, ' : ''}{spell.duration}</p>
              <p>
                <b>Components:</b> {spell.components.join(', ')} {spell.material ? `(${spell.material})` : ''}
              </p>
      
              {spell.desc.map((desc, i) => (
                <MarkdownViewer key={i} markdown={desc} />
              ))}
      
              {spell.higher_level.map((pf, i) => (
                pf ? <p key={i}><b>At Higher Levels.</b> {pf}</p> : null
              ))}
      
              <p><b>Spell Lists:</b> {spell.classes.map((clase, i) => (
                <span key={i}>
                  <Link to={`/SRD/spells/${clase}`}>{clase}</Link>{i < spell.classes.length - 1 && ', '}
                </span>
              ))}</p>
            </div>
          </main>
          <Footer />
        </div>
      );
      
}

export { SpellList, Spell }