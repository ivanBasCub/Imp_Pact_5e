import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

{/* 
  Este componente se encarga de mostrar la página principal del SRD y muestra la lista de hechizos disponibles para todas las clases
  */}
function SRD() {
  return (
    <>
      <h1>SRD</h1>
      <p>Esta es la página principal del SRD</p>
    </>
  )
}

{/*
  Este componente se encarga de mostrar la lista de hechizos especifico de una clase
  */}
function SpellList() {
  return (
    <div>
      <h1>SpellList</h1>
      <p>Esta es la lista de hechizos</p>
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
      const res = await fetch(`https://www.dnd5eapi.co/api/spells/${id}`)
      const data = await res.json()
      setSpell(data)
    }
    fetchSpell()
  }, [id])

  return (
    <div key={id}>
      <h2>{spell.name}</h2>
      <p><b>Casting Time: </b> {spell.casting_time}</p>
      <p><b>Range: </b>{spell.range}</p>
      <p><b>Duration: </b>{spell.concentration ? 'Concentration,' : spell.duration}</p>
      <p><b>Components: </b>{spell.material} </p>
    </div>

  )
}

export { SRD, SpellList, Spell }