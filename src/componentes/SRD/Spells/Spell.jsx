import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"

{/*
    Esta funcion devuelve un formulario dependiendo de 
*/}
function formulario(info, clase, full, handleChange) {
    if (clase === undefined) {
        return (
            <div>
                <h1>Spell List</h1>
                <form method="post">
                    <div>
                        <label>Spell Level</label>
                        <select name="level" id="level" onChange={handleChange} value={info.level}>
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
                        </select>
                    </div>
                    <div>
                        <label>Spell School</label>
                        <select id="school" name="school" onChange={handleChange} value={info.school}>
                            <option value="all">All Schools</option>
                            <option value="Abjuration">Abjuration</option>
                            <option value="Conjuration">Conjuration</option>
                            <option value="Divination">Divination</option>
                            <option value="Enchantment">Enchantment</option>
                            <option value="Evocation">Evocation</option>
                            <option value="Illusion">Illusion</option>
                            <option value="Necromancy">Necromancy</option>
                            <option value="Transmutation">Transmutation</option>
                        </select>
                    </div>
                    <div>
                        <label>Class Spell List</label>
                        <select name="class" id="class" onChange={handleChange} value={info.class}>
                            <option value="all">All Classes</option>
                            <option value="Bard">Bard</option>
                            <option value="Cleric">Cleric</option>
                            <option value="Druid">Druid</option>
                            <option value="Paladin">Paladin</option>
                            <option value="Ranger">Ranger</option>
                            <option value="Sorcerer">Sorcerer</option>
                            <option value="Warlock">Warlock</option>
                            <option value="Wizard">Wizard</option>
                        </select>
                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <div>
                <h2>{clase} Spell List</h2>
                <form method="post">
                    <div>
                        <label>Spell Level</label>
                        <select name="level" onChange={handleChange} value={info.level}>
                            {full.includes(clase) ? (
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
                            {full.includes(clase) ? (
                                <>
                                    <option value="6">Level 6</option>
                                    <option value="7">Level 7</option>
                                    <option value="8">Level 8</option>
                                    <option value="9">Level 9</option>
                                </>
                            ) : ""}
                        </select>
                    </div>
                    <div>
                        <label >Spell School</label>
                        <select name="school" onChange={handleChange} value={info.school}>
                            <option value="all">All Schools</option>
                            <option value="Abjuration">Abjuration</option>
                            <option value="Conjuration">Conjuration</option>
                            <option value="Divination">Divination</option>
                            <option value="Enchantment">Enchantment</option>
                            <option value="Evocation">Evocation</option>
                            <option value="Illusion">Illusion</option>
                            <option value="Necromancy">Necromancy</option>
                            <option value="Transmutation">Transmutation</option>
                        </select>
                    </div>
                </form>
            </div>
        )
    }
}

{/*
  Este componente se encarga de mostrar la lista de hechizos especifico de una clase
*/}
function SpellList() {
    // Constantes que van a ser necesarias para el filtrado de información que vamos a recoger de la API
    const fullCasters = ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"];
    // Constantes generales
    const { clase } = useParams()

    const [ infoForm , setInfoForm ] = useState({
        level : "0",
        school: "all",
        class: clase || 'all'
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInfoForm((info) => ({
          ...info,
          [name]: value
        }));
    };
      
    return (
        <div>
            {formulario(infoForm, clase, fullCasters, handleChange)}
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
            const res = await fetch(`https://www.dnd5eapi.co/api/2014/spells/${id}`)
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