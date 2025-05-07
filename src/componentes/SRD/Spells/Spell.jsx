import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import { db } from "../../../firebase/config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import MarkdownViewer from "../../Extras/MarkDownViewer";
import Header from "../../Header";
import Footer from "../../Footer";

/**
 * URL base para obtener los datos de la API de D&D 5e.
 * @constant {string}
 */ 
const URL = "https://www.dnd5eapi.co";

/**
 * Componente que muestra una lista de hechizos del SRD 5e, permitiendo filtrar
 * por nombre, nivel, escuela y clase del hechizo.
 * 
 * Se conecta a la API pública y almacena los datos en Firebase si no existen aún.
 * Utiliza filtros para mostrar resultados personalizados según la selección del usuario.
 * 
 * @return {JSX.Element} Componente con un formulario de filtrado y una tabla de resultados
 */
function SpellList() {
    // Constantes que van a ser necesarias para el filtrado de información que vamos a recoger de la API
    const fullCasters = ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"];
    // Constantes generales
    const { clase } = useParams()
    const [list, setList] = useState([])

    // Constante para recoger la información del formulario
    const [infoForm, setInfoForm] = useState({
        name: "",
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

        /**
         * Actualiza la base de datos local con hechizos del SRD desde la API.
         * @return {Promise<void>}
         */
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

        /**
         * Verifica si ya están todos los hechizos del SRD en la base de datos local.
         * Si no lo están, llama a `updateDataBBDD` para completar la colección.
         * @return {Promise<void>}
         */
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

        /**
        * Obtiene y filtra la lista de hechizos desde Firebase según nivel, escuela y clase.
        * @return {Promise<void>}
        */
        async function fetchList() {
            const collectionRef = collection(db, nanmeColeccion);
            const query = await getDocs(collectionRef);
            var filterData = null;
            if (infoForm.level === "-1") {
                filterData = query.docs.map(spell => spell.data());
                if (infoForm.school !== "all") {
                    filterData = filterData.filter(spell => spell.school === infoForm.school);
                }
                if (infoForm.class !== "all") {
                    filterData = filterData.filter(spell => spell.classes.includes(infoForm.class));
                }
                setList(filterData);
            } else {
                filterData = query.docs.filter(spell => spell.data().level === parseInt(infoForm.level));
                if (infoForm.school !== "all") {
                    filterData = filterData.filter(spell => spell.data().school === infoForm.school);
                }
                if (infoForm.class !== "all") {
                    filterData = filterData.filter(spell => spell.data().classes.includes(infoForm.class));
                }
                setList(filterData.map(spell => spell.data()));
            }
        }
        
        /**
         * Filtra un hechizo específico por nombre si se proporciona.
         * @return {Promise<void>}
         */
        async function filterListName(){
            const spellName = infoForm.name.toLowerCase().split(" ").join("-");

            const spell = await getDoc(doc(db, nanmeColeccion, spellName));
            if (spell.exists()) {
                setList([spell.data()]);
            } else {
                setList([]);
            }
        }
            /**
             * Decide si filtrar por nombre o por criterios generales.
             * @return {Promise<void>}
             */
            function fetchSpell() {
            if (infoForm.name === "") {
                fetchList();
            } else {
                filterListName();
            }
        }

        fetchSpell();

    }, [infoForm]);

    return (
        <>
            <Header></Header>
            <main className="flex-grow-1 flex-column container my-4">
                {/* Formulario de filtrado */}
                <div className="card p-4 mb-4 shadow-sm">
                    <h2 className="mb-3">Spell List</h2>
                    <form method="post">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label htmlFor="name" className="form-label">Spell Name</label>
                                <input type="text" className="form-control" id="name" name="name" placeholder="Spell Name" onChange={formEvent} value={infoForm.name} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="level" className="form-label">Spell Level</label>
                                <select id="level" name="level" className="form-select" onChange={formEvent} value={infoForm.level}>
                                    <option value="-1" selected>All Levels</option>
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

                            <div className="col-md-3">
                                <label htmlFor="school" className="form-label">Spell School</label>
                                <select id="school" name="school" className="form-select" onChange={formEvent} value={infoForm.school}>
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
                                <div className="col-md-3">
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
                {/* Tabla de resultados */}
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

/**
 * Componente que muestra los detalles de un hechizo.
 * 
 * Extrae el ID del hechizo desde la URL, obtiene los datos correspondientes desde Firestore
 * y los muestra formateados. Incluye detalles como nivel, escuela, tiempo de lanzamiento,
 * componentes, descripciones y clases que pueden usar el hechizo.
 * 
 * @component
 * @returns {JSX.Element}
 */
function Spell() {
    const { id } = useParams()
    const [spell, setSpell] = useState({})

    // Efecto para obtener el hechizo desde Firestore al montar el componente
    useEffect(() => {
        const nanmeColeccion = "SRD_Spells";
        /**
         * Obtiene los detalles de un hechizo específico desde Firestore.
         * @async
         */
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

                    {/* Nivel del hechizo y si es ritual o cantrip */}
                    <p>
                        {spell.level === 0
                            ? `${spell.school} Cantrip`
                            : spell.ritual
                                ? `${spell.school} Level ${spell.level} (Ritual)`
                                : `${spell.school} Level ${spell.level}`}
                    </p>
                    {/* Atributos básicos del hechizo */}
                    <p><b>Casting Time:</b> {spell.casting_time}</p>
                    <p><b>Range:</b> {spell.range}</p>
                    <p><b>Duration:</b> {spell.concentration ? 'Concentration, ' : ''}{spell.duration}</p>
                    <p>
                        <b>Components:</b> {spell.components.join(', ')} {spell.material ? `(${spell.material})` : ''}
                    </p>
                    {/* Descripción principal del hechizo (puede contener Markdown) */}
                    {spell.desc.map((desc, i) => (
                        <MarkdownViewer key={i} markdown={desc} />
                    ))}
                    {/* Descripción para niveles superiores, si aplica */}
                    {spell.higher_level.map((pf, i) => (
                        pf ? <p key={i}><b>At Higher Levels.</b> {pf}</p> : null
                    ))}
                    {/* Clases que pueden usar este hechizo */}
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