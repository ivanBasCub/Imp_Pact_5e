import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

{/*
    Constantes Generales del componente    
*/}
const URL = "https://www.dnd5eapi.co";

{/*
    Funcion que muestra toda la lista con la información de todos los mounstros    
*/}
<<<<<<< HEAD
function MonsterList(){

=======
function MonsterList() {
    // Constantes Necesarias para la lista
    const [list, setList] = useState([]);
    const [difCR, setDifCR] = useState([]);
    const [infoForm, setInfoForm] = useState({
        cr : 0,
        type : "all",
        size : "all"
    })

    // Evento para recoger la información del formulario
    const formEvent = (event) => {
        const { name, value } = event.target;
        setInfoForm((info) => ({
            ...info,
            [name]: value
        }));
    };

    // UseEffect para actualizar la información de la API
    useEffect(() => {
        async function fecthList() {
            const res = await fetch(`${URL}/api/2014/monsters`)
            const data = await res.json();
            // Recogemos la información que ha recogido la consulta fetch
            
            const listArray = data.results;
            // Filtramos la información de la API segun el CR del bicho
            const filterArray = listArray.map(monster => fetch(`${URL}${monster.url}`).then(res => res.json()));
            const listMonsterRaw = await Promise.all(filterArray);
            var listMonsterCR = listMonsterRaw.filter(monster => monster.challenge_rating === parseFloat(infoForm.cr));

            // En el caso de el filtrado solo sea el nivel
            if (infoForm.size === "all" && infoForm.type === "all") {
                setList(listMonsterCR)
            }
            
            // En el caso de que se este filtrado el tipo de criatura
            if (infoForm.type != "all"){
                var listMonsterType = listMonsterCR.filter(monster => monster.type === infoForm.type);
                setList(listMonsterType);

                if(infoForm.size != "all"){
                    var listMonsterTypeSize = listMonsterType.filter(monster => monster.size === infoForm.size);
                    setList(listMonsterTypeSize)
                    
                }

            }

            // En el caso de que esta solamente filtrando por el tamaño
            if(infoForm.size != "all" && infoForm.type == "all"){
                var listMonsterSize = listMonsterCR.filter(monster => monster.size === infoForm.size)
                setList(listMonsterSize)
            }
        }
        fecthList();
    },[infoForm])

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
        <div>
            <form method="post">
                <h2>Monster List</h2>
                <div>
                    <label>Challenge Rating (CR)</label>
                    <select name="cr" onChange={formEvent} value={infoForm.cr}>
                        {difCR.map((cr, i) => (
                            <option key={i} value={cr}>CR {cr}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Creature Type</label>
                    <select name="type" onChange={formEvent} value={infoForm.type}>
                        <option value="all">All Types</option>
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
                <div>
                    <label>Size</label>
                    <select name="size" onChange={formEvent} value={infoForm.size}>
                        <option value="all">All Sizes</option>
                        <option value="Tiny">Tiny</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="Gargatuan">Gargatuan</option>
                    </select>
                </div>
            </form>
            <table>
                <thead>
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
                                <td>{monster.name}</td>
                                <td>{monster.challenge_rating}</td>
                                <td>{monster.type}</td>
                                <td>{monster.size}</td>
                                <td>{monster.alignment}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
>>>>>>> 8c991a598e6cb8f9b4d3145d18788b0fae70f484
}


{/*
    Función que muestra toda la información necesaria que se recolecta de la API
*/}
<<<<<<< HEAD
function Monster(){
=======
function Monster() {
>>>>>>> 8c991a598e6cb8f9b4d3145d18788b0fae70f484


}

export { MonsterList, Monster }