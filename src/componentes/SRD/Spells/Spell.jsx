import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

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
        level: 1,
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

    // Actualizamos los datos recogidos por la API
    useEffect(() => {
        { console.log(infoForm) }
        // Funcion principal donde se hara el filtrado de nivel
        async function fetchList() {
            // Hacemos la llamada general a la api
            const res = await fetch(`${URL}/api/2014/spells`);
            const data = await res.json();
            // Recogemos la información completa de la API
            const listArray = data.results;

            // Filtramos la información de la API segun el nivel indicado en el formulario y hacemos llamadas a la API de nuevo para conseguir la información que necesitamos para mostrar en la tabla
            const filterArray = listArray.filter(spell => spell.level === parseInt(infoForm.level));
            const listSpellPromises = filterArray.map(spell => fetch(`${URL}${spell.url}`).then(res => res.json()));
            const listSpell = await Promise.all(listSpellPromises);

            // En el caso de que sea el base
            if (infoForm.class === "all" && infoForm.school === "all") {
                setList(listSpell)
            }

            // Filtrado segun clase y escuela si se cumplen las condiciones
            if (infoForm.class != "all") {

                var listSpellClass = listSpell.filter(spell => spell.classes.some(pj => pj.index === infoForm.class))
                setList(listSpellClass)
                // En el caso de que tambien estemos filtrando por la escuela y actualizamos la constante list
                if (infoForm.school != "all") {
                    var result = listSpellClass.filter(spell => spell.school.index === infoForm.school)
                    setList(result)
                }
            }

            // En el caso de que solamente estemos filtrando por la escuela
            if (infoForm.school != "all") {
                var listSpellSchool = listSpell.filter(spell => spell.school.index === infoForm.school)
                setList(listSpellSchool)
            }
        }
        fetchList();
    }, [infoForm]);

    return (
        <div>
            <form method="post">
                <h2>{clase === undefined ? "Spell List" : `${clase} Spell List`}</h2>
                <div>
                    <label>Spell Level</label>
                    <select name="level" onChange={formEvent} value={infoForm.level}>
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
                                {fullCasters.includes(infoForm.class) ? (
                                    <>
                                        <option value="6">Level 6</option>
                                        <option value="7">Level 7</option>
                                        <option value="8">Level 8</option>
                                        <option value="9">Level 9</option>
                                    </>
                                ) : ""}
                            </>
                        )}
                    </select>
                </div>
                <div>
                    <label >Spell School</label>
                    <select name="school" onChange={formEvent} value={infoForm.school}>
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
                {clase === undefined ? (
                    <div>
                        <label>Class Spell List</label>
                        <select name="class" id="class" onChange={formEvent} value={infoForm.class}>
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
                ) : ""}

            </form>
            <table>
                <thead>
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
                    {list.map(spell => (
                        <tr key={spell.index}>
                            <td><Link to={`/SRD/Spell/${spell.index}`}>{spell.name}</Link></td>
                            <td>{spell.school.name}</td>
                            <td>{spell.casting_time} {spell.ritual ? "R" : ""}</td>
                            <td>{spell.range}</td>
                            <td>{spell.duration}</td>
                            <td>{spell.components.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

{/*
  Este componente se encarga de mostrar la descripción de un hechizo que se haya seleccionado
  */}
function Spell() {
    const { id } = useParams()
    const [spell, setSpell] = useState({})

    useEffect(() => {
        async function fetchSpell() {
            const res = await fetch(`${URL}/api/2014/spells/${id}`)
            const data = await res.json()
            setSpell(data)
        }
        fetchSpell()
    }, [id])

    // Comprobamos que se haya recogido la información del Spell antes de mostrar nada
    if (Object.keys(spell).length === 0) {
        return <div>Loading...</div>
    }

    // Imprimimos la información por pantalla
    return (
        <div key={id}>
            <h2>{spell.name}</h2>
            <p>{spell.level === 0 ? `${spell.school.name} Cantrip` : spell.ritual ? `${spell.school.name} Level ${spell.level} (Ritual)` : `${spell.school.name} Level ${spell.level}`}</p>
            <p><b>Casting Time: </b> {spell.casting_time}</p>
            <p><b>Range: </b>{spell.range}</p>
            <p><b>Duration: </b>{spell.concentration ? 'Concentration,' : spell.duration}</p>
            <p><b>Components: </b>{spell.components.join(', ')} {spell.material ? `(${spell.material})` : ""}</p>
            <p>{spell.desc.join(<br />)}</p>
            {spell.higher_level.map(pf => {
                if (pf) {
                    return <p><b>At higher Levels.</b> {pf}</p>
                }
            })}
            <p><b>Spell Lists. </b> {spell.classes.map(clase => <Link to={`/SRD/SpellList/${clase.index}`}>{clase.name}</Link>)} </p>
        </div>
    )
}

export { SpellList, Spell }