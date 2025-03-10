import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"

{/*
    Esta funcion devuelve un formulario dependiendo de 
*/}
function formulario(loc,clase,full,semi){
    if(loc.pathname == "/SRD/SpellList"){
        return (
            <div>
                <h1>Spell List</h1>
            </div>
        )
    }else{
        return (
            <div>
                <h2> Spell List</h2>
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
    const semiCasters = ["paladin", "ranger"];
    // Constantes generales
    const loc = useLocation();
    const [list, setList] = useState({});
    const { clase } = useParams()
    console.log(clase)
    return (
        <div>
            {formulario(loc,clase,fullCasters,semiCasters)}
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
            <p><b>Spell Lists. </b> {spell.classes.map(clase => <Link to={`/SRD/SpellLists/${clase.index}`}>{clase.name}</Link>)} </p>
        </div>
    )
}

export { SpellList, Spell }