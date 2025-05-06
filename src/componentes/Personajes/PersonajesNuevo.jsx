import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "../../assets/css/App.css";
import "../../assets/css/modal.css";
import SpellSelector from "./SpellSelector";
import { auth } from "../../firebase/config";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";



export default function PersonajesNuevo() {
  // Estados relacionados con hechizos y modales
  const [selectedSpells, setSelectedSpells] = useState([]);  
  const [showModal, setShowModal] = useState(false);
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [showMulticlassModal, setShowMulticlassModal] = useState(false);
  
  // Estados para clases, razas y niveles
  const [classes, setClasses] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMulticlass, setSelectedMulticlass] = useState(null);
  const [spellcastingAbility, setSpellcastingAbility] = useState(null);
  const [spellcastingAbilityMulticlass, setSpellcastingAbilityMulticlass] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [level, setLevel] = useState(1);
  const [levelMulticlase, setLevelMulticlase] = useState(0);
  const [levelTotal, setLevelTotal] = useState(1);
  
  // Estados para características y subclases
  const [features, setFeatures] = useState([]);
  const [featuresMulticlase, setFeaturesMulticlase] = useState([]);
  const [raceFeatures, setRaceFeatures] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [subclass, setSubclass] = useState(null);
  const [subclassFeatures, setSubclassFeatures] = useState([]);
  const [subclassMulticlass, setSubclassMulticlass] = useState(null);
  const [subclassMulticlassFeatures, setSubclassMulticlassFeatures] = useState([]);
  
  // Estadísticas y modificadores
  const [stats, setStats] = useState([10, 10, 10, 10, 10, 10]);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  
  // Dados de golpe y puntos de golpe
  const [hitDie, setHitDie] = useState(null);
  const [hitDieMulticlass, setHitDieMulticlass] = useState(null);
  const [hp, setHp] = useState(null);

  // Competencias y bonificadores
  const [savingThrowsBool, setSavingThrowsBool] = useState([false, false, false, false, false, false]);
  const [proficiencies, setProficiencies] = useState([]);
  const [proficienciesMulticlass, setProficienciesMulticlass] = useState([]);
  const [pb, setPb] = useState(calcularProficiencyBonus(levelTotal));
  
  // Niveles de lanzador y ranuras de conjuro
  const [casterLevel, setCasterLevel] = useState(0);
  const [casterLevelMulticlass, setCasterLevelMulticlass] = useState(0);
  const [spellSlots, setSpellSlots] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [spellSlotsWarlock, setSpellSlotsWarlock] = useState([0, 0, 0, 0, 0]);
  
  // Habilidades y sus modificadores
  const [skillsClass, setSkillsClass] = useState([]);
  const [skillsClassNumber, setSkillsClassNumber] = useState(0);
  const [skillsMulticlass, setSkillsMulticlass] = useState([]);
  const [skillsMulticlassNumber, setSkillsMulticlassNumber] = useState(0);
  const [selectedClassSkills, setSelectedClassSkills] = useState([]);
  const [selectedMulticlassSkills, setSelectedMulticlassSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsBonus, setSkillsBonus] = useState([]);
  
  // Equipamiento
  const [equipmentSections, setEquipmentSections] = useState(["", "", "", ""]);
  
  // Nombre del personaje
  const [characterName, setCharacterName] = useState('');
  
  // Hook para redirección de rutas
  const navigate = useNavigate();

  // Carga los datos desde localStorage en caso de edición
  useEffect(() => {
    const saved = localStorage.getItem("editCharacter");
    if (saved) {
      const personaje = JSON.parse(saved);
  
      // Carga nombre, raza, clase principal y multiclase (y sus niveles correspondientes)
      setCharacterName(personaje.name || "");                   // Nombre
      setSelectedRace(personaje.race || "");                    // Raza
      setSelectedClass(personaje.class?.[0]?.name || "");       // Establecer clase
      setLevel(personaje.class?.[0]?.level || "")
      setSelectedMulticlass(personaje.class?.[1]?.name || "");  // Establecer Multiclase
      setLevelMulticlase(personaje.class?.[1]?.level || "")
      //console.log(personaje.spells.spellbook[0]);
      //setSelectedSpells(personaje.spells.spellbook[0]); // Aquí usamos 'spellbook' como array
      //console.log(selectedSpells)

      // Carga estadísticas
      setStats([
        personaje.stats.strength || 10,
        personaje.stats.dexterity || 10,
        personaje.stats.constitution || 10,
        personaje.stats.intelligence || 10,
        personaje.stats.wisdom || 10,
        personaje.stats.charisma || 10
      ]);

      // Carga equipo
      setEquipmentSections([
        personaje.equipment?.armor || "",  // Valor de armadura
        personaje.equipment?.weapons || "", // Valor de armas
        personaje.equipment?.tools || "",   // Valor de herramientas
        personaje.equipment?.other || ""    // Valor de otros
      ]);
  
      // Finalmente, limpia el almacenamiento después de cargar
      localStorage.removeItem("editCharacter");
    }
  }, []);
  
  
  //  Carga las habilidades disponibles del API al cargar
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/proficiencies");
        const data = await response.json();
        
        // Filtramos las habilidades de tipo 'skill'
        const skillProficiencies = data.results.filter(skill => skill.index.startsWith("skill-"));
        setAllSkills(skillProficiencies);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    
    fetchSkills();
  }, []);

  // Actualiza el bonificador de competencia cuando cambia el nivel total
  useEffect(() => {
    setPb(calcularProficiencyBonus(levelTotal));
  }, [levelTotal]);

  // Calcula el nivel total en función de clase y multiclase
  useEffect(() => {
    if(level>0 && levelMulticlase==0){
      setLevelTotal(level);
    }else if(level>0 && levelMulticlase>0){
      setLevelTotal(level+levelMulticlase);
    }
  }, [level, levelMulticlase]);

  // Calcula las ranuras de conjuro (normales y de warlock) según niveles de clase y multiclase  
  useEffect(() => {
    if((casterLevel>0 && level>0) || (casterLevelMulticlass>0 && levelMulticlase>0)){
      let levelEfectivo = 0;
      let levelWarlock = 0;
      // calcula el nivel de magia efectivo y el nivel de warlock
      if(casterLevelMulticlass==0 || levelMulticlase==0){
        if(selectedClass != "warlock"){
          levelEfectivo = level/casterLevel;
        }else{
          levelWarlock = level;
        }
      }else if(casterLevel==0 || level==0){
        if(selectedMulticlass != "warlock"){
          levelEfectivo = levelMulticlase/casterLevelMulticlass;
        }else{
          levelWarlock = levelMulticlase;
        }
      }else{
        if(selectedClass == "warlock"){
          levelEfectivo = levelMulticlase/casterLevelMulticlass;
          levelWarlock = level;
        }else if(selectedMulticlass == "warlock"){
          levelEfectivo = level/casterLevel;
          levelWarlock = levelMulticlase;
        }else{
          levelEfectivo = level/casterLevel+levelMulticlase/casterLevelMulticlass;
        }
      }
      // Ranuras normales según el nivel efectivo de conjurador
      setSpellSlots([
        levelEfectivo>=1 ? (levelEfectivo>1 ? (levelEfectivo>2 ? 4 : 3) : 2) : 0,           //nivel 1
        levelEfectivo>2 ? (levelEfectivo>3 ? 3 : 2) : 0,                                    //nivel 2
        levelEfectivo>4 ? (levelEfectivo>5 ? 3 : 2) : 0,                                    //nivel 3
        levelEfectivo>6 ? (levelEfectivo>7 ? (levelEfectivo>8 ? 3 : 2) : 1) : 0,            //nivel 4
        levelEfectivo>8 ? (levelEfectivo>9 ? (levelEfectivo>17 ? 3 : 2) : 1) : 0,           //nivel 5
        levelEfectivo>10 ? (levelEfectivo>18 ? 2 : 1) : 0,                                  //nivel 6
        levelEfectivo>12 ? (levelEfectivo>19 ? 2 : 1) : 0,                                  //nivel 7
        levelEfectivo>14 ? 1 : 0,                                                           //nivel 8
        levelEfectivo>16 ? 1 : 0]);                                                         //nivel 9
    // Ranuras especiales de warlock
      setSpellSlotsWarlock([
        levelWarlock==1 ? 1 : (levelWarlock==2 ? 2 : 0),                           //nivel 1
        levelWarlock>2 ? (levelWarlock>4 ? 0 : 2) : 0,                             //nivel 2
        levelWarlock>4 ? (levelWarlock>6 ? 0 : 2) : 0,                             //nivel 3
        levelWarlock>6 ? (levelWarlock>8 ? 0 : 2) : 0,                             //nivel 4
        levelWarlock>8 ? (levelWarlock>10 ? (levelWarlock>16 ? 4 : 3) : 2) : 0,    //nivel 5
      ]);
    }else{
      setSpellSlots([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  }, [level, casterLevel, levelMulticlase, casterLevelMulticlass]);

// Cuando se selecciona una clase principal, se obtienen todos sus datos relevantes
useEffect(() => {
  if (selectedClass) {
    // Obtener detalles generales de la clase de la api
    fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        const savingThrowIndexes = data.saving_throws.map((st) => st.index); // ["str", "con", ...]

        setHitDie(data.hit_die) // Dado de golpe de la clase

        // Extrae la habilidad de conjuro si la clase puede lanzar hechizos
        if (data.spellcasting) {
          setSpellcastingAbility(data.spellcasting.spellcasting_ability.index);
          setCasterLevel(data.spellcasting.level);
        } else {
          setSpellcastingAbility(null);
          setCasterLevel(0);

        }

        // Mapeamos los atributos en un array de booleanos
        const newSavingThrowsBool = ["str", "dex", "con", "int", "wis", "cha"].map(stat => 
          savingThrowIndexes.includes(stat)
        );
        setSavingThrowsBool(newSavingThrowsBool);

      // Obtener skills (proficiency_choices)
      const proficiencyChoices = data.proficiency_choices?.[0]; // solo usamos el primero
      if (proficiencyChoices) {
        const skills = proficiencyChoices.from.options.map(option => ({
          name: option.item.name,   // "Skill: Acrobatics"
          index: option.item.index, // "skill-acrobatics"
        }));
        setSkillsClass(skills); // <-- crea este useState en tu componente
        setSkillsClassNumber(proficiencyChoices.choose); // <-- crea este useState si quieres mostrar cuántos elegir
        setSelectedClassSkills([]);
      } else {
        setSkillsClass([]);
        setSkillsClassNumber(0);
        setSelectedClassSkills([]);
      }
      })
      .catch((error) => console.error("Error fetching saving throws:", error));

      // Obtener proficiencias (excluyendo salvaciones)
      fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}/proficiencies`)
      .then((response) => response.json())
      .then((data) => {
        const savingProficiencies = data.results
          .filter((st) => !st.index.startsWith("saving-throw"))
          .map((st) => st.index); 
        setProficiencies(savingProficiencies);
      })
      .catch((error) => console.error("Error fetching proficiencies:", error));
  }
}, [selectedClass]);

// Cuando se selecciona una multiclase, se obtienen sus datos igual que la principal
useEffect(() => {
  if (selectedMulticlass) {
    // Obtener información general de la multiclase
    fetch(`https://www.dnd5eapi.co/api/classes/${selectedMulticlass.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        setHitDieMulticlass(data.hit_die);

        if (data.spellcasting) {
          setSpellcastingAbilityMulticlass(data.spellcasting.spellcasting_ability.index);
          setCasterLevelMulticlass(data.spellcasting.level);
          setSelectedMulticlassSkills([]);
        } else {
          setSpellcastingAbilityMulticlass(null);
          setCasterLevelMulticlass(0);
          setSelectedMulticlassSkills([]);
        }
      })
      .catch((error) => console.error("Error fetching multiclass details:", error));

    // Nueva petición para obtener proficiencias de la multiclase
    fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedMulticlass.toLowerCase()}/multi-classing`)
      .then((response) => response.json())
      .then((data) => {
        // Proficiencias fijas de la multiclase
        const multiClassProficiencies = data.proficiencies.map((prof) => prof.index);

        // Opciones de proficiencias a elegir
        const proficiencyChoices = data.proficiency_choices?.[0]; // solo usamos el primero
        if (proficiencyChoices) {
          const skills = proficiencyChoices.from.options.map(option => ({
            name: option.item.name,   // "Skill: Acrobatics"
            index: option.item.index, // "skill-acrobatics"
          }));
          setSkillsMulticlass(skills); 
          setSkillsMulticlassNumber(proficiencyChoices.choose); 
          
        } else {
          setSkillsMulticlass([]);
          setSkillsMulticlassNumber(0);
        }

        setProficienciesMulticlass(multiClassProficiencies);
      })
      .catch((error) => console.error("Error fetching multiclass proficiencies:", error));
  }
}, [selectedMulticlass]);


// Cada vez que se cambia el nivel, la CON o el dado de golpe, recalculamos el HP total
useEffect(() => {
  if (hitDie && level) {
    const conBonus = statBonus(stats[2]); // Modificador de Constitución
    let calculatedHp = hitDie + conBonus; // HP de nivel 1

    // HP de los siguientes niveles: media del dado + CON
    if (level > 1) {
      calculatedHp += (level - 1) * ((hitDie / 2) + conBonus);
      console.log(levelMulticlase);
    }

    // Si hay multiclase, se suma su HP
    if(levelMulticlase > 0){
      calculatedHp = calculatedHp+((levelMulticlase) * ((hitDieMulticlass / 2) + conBonus));
    }

    setHp(Math.max(1, Math.floor(calculatedHp))); // Asegurar que HP mínimo sea 1
  }
}, [hitDie, level, stats, hitDieMulticlass, levelMulticlase]);

  // Al montar el componente, se obtiene la lista completa de clases
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/classes/")
      .then((response) => response.json())
      .then((data) => setClasses(data.results))
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  // Cada vez que se cambia la clase principal o su nivel, se obtienen las características desbloqueadas
  useEffect(() => {
    if (selectedClass && level) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedClass.toLowerCase()}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredFeatures = data
            .filter((lvl) => lvl.level <= level)
            .flatMap((lvl) => lvl.features);
          // Cargar descripciones completas de las características
          const featuresWithDesc = await Promise.all(
            filteredFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };
            })
          );

          setFeatures(featuresWithDesc);
        })
        .catch((error) => console.error("Error fetching class levels:", error));
    }
  }, [selectedClass, level]);

  // Igual que el anterior, pero para la multiclase
  useEffect(() => {
    if (selectedMulticlass && levelMulticlase) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedMulticlass.toLowerCase()}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredFeatures = data
            .filter((lvl) => lvl.level <= levelMulticlase)
            .flatMap((lvl) => lvl.features);

          const featuresWithDesc = await Promise.all(
            filteredFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };
            })
          );

          setFeaturesMulticlase(featuresWithDesc);
        })
        .catch((error) => console.error("Error fetching class levels:", error));
    }
  }, [selectedMulticlass, levelMulticlase]);

  // Al seleccionar clase, también se obtiene la subclase por defecto (la del SRD)
  useEffect(() => {
    if (selectedClass) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedClass.toLowerCase()}/subclasses/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            setSubclass(data.results[0].index);
          }
        })
        .catch((error) => console.error("Error fetching subclass:", error));
    }
  }, [selectedClass]);
  
  // Cuando se selecciona una multiclase, se busca su subclase por defecto (la del SRD)
  useEffect(() => {
    if (selectedMulticlass) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedMulticlass.toLowerCase()}/subclasses/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            setSubclassMulticlass(data.results[0].index);
          }
        })
        .catch((error) => console.error("Error fetching subclass:", error));
    }
  }, [selectedMulticlass]);

  // Cuando hay subclase y nivel definidos, se buscan sus características desbloqueadas hasta ese nivel
  useEffect(() => {
    if (subclass && level) {
      fetch(`https://www.dnd5eapi.co/api/2014/subclasses/${subclass}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          // Filtra características de niveles menores o iguales al nivel del personaje
          const filteredSubclassFeatures = data
            .filter((lvl) => lvl.level <= level)
            .flatMap((lvl) => lvl.features);
          // Obtiene las descripciones completas de cada característica
          const subclassFeaturesWithDesc = await Promise.all(
            filteredSubclassFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };  // Añade la descripción al objeto feature
            })
          );

          setSubclassFeatures(subclassFeaturesWithDesc);  // Guarda las características completas
        })
        .catch((error) => console.error("Error fetching subclass features:", error));
    }
  }, [subclass, level]);

  // Igual que el anterior, pero para la subclase asociada a la multiclase y su nivel correspondiente
  useEffect(() => {
    if (subclassMulticlass && levelMulticlase) {
      fetch(`https://www.dnd5eapi.co/api/2014/subclasses/${subclassMulticlass}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredSubclassFeatures = data
            .filter((lvl) => lvl.level <= levelMulticlase)
            .flatMap((lvl) => lvl.features);

          const subclassFeaturesWithDesc = await Promise.all(
            filteredSubclassFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };
            })
          );

          setSubclassMulticlassFeatures(subclassFeaturesWithDesc);
        })
        .catch((error) => console.error("Error fetching subclass features:", error));
    }
  }, [subclassMulticlass, levelMulticlase]);

  // Al montar el componente, obtiene el listado de todas las razas disponibles
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/races/")
      .then((response) => response.json())
      .then((data) => setRaces(data.results))
      .catch((error) => console.error("Error fetching races:", error));
  }, []);

  // Cuando se selecciona una raza, obtiene su velocidad y rasgos raciales detallados
  useEffect(() => {
    if (selectedRace) {
      fetch(`https://www.dnd5eapi.co/api/races/${selectedRace}`)
        .then((response) => response.json())
        .then(async (data) => {
          setSpeed(data.speed);
          // Obtiene las descripciones de todos los rasgos raciales
          const traitsWithDesc = await Promise.all(
            data.traits.map(async (trait) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/traits/${trait.index}`);
              const traitData = await res.json();
              return { ...trait, desc: traitData.desc };
            })
          );
  
          setRaceFeatures(traitsWithDesc);  // Guarda los rasgos con descripción
        })
        .catch((error) => console.error("Error fetching race features:", error));
    }
  }, [selectedRace]);

/**
 * Alterna si una característica está expandida o colapsada en la interfaz,
 * para mostrar u ocultar su descripción.
 *
 * @param {*} featureIndex - Índice de la característica a alternar.
 */
  const handleToggleFeature = (featureIndex) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [featureIndex]: !prev[featureIndex],  // Cambia el estado del índice específico
    }));
  };

/**
 * Genera 6 estadísticas aleatorias usando la regla estándar de 4d6,
 * descartando el dado con menor valor en cada tirada.
 *
 * @returns {void}
 */
  const handleRandomStats = () => {
    const newStats = Array.from({ length: 6 }, () => {
      let rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      rolls.sort((a, b) => a - b);  // Ordena los dados
      return rolls.slice(1).reduce((sum, val) => sum + val, 0); // Suma los tres mayores
    });

    setStats(newStats);
  };

  /**
   * Maneja los cambios en los inputs de estadísticas, asegurando que no sean negativos.
   *
   * @param {number} index - Índice de la estadística a modificar.
   * @param {string|number} value - Valor ingresado por el usuario.
   */
  const handleInputChange = (index, value) => {
    const newStats = [...stats];
    newStats[index] = Math.max(0, parseInt(value) || 0);  // Para asegurarte que no sea un valor negativo
    setStats(newStats);
  };

  /**
   * Calcula el modificador de una estadística según las reglas de D&D 5e.
   *
   * @param {number} stat - Valor de la estadística.
   * @returns {number} - Modificador correspondiente.
   */
  function statBonus(stat) {
    let bonus = Math.floor(stat/2 - 5);
    return bonus;

  }

  /**
   * Calcula el bonificador de competencia (proficiency bonus) según el nivel del personaje.
   *
   * @param {number} n - Nivel del personaje.
   * @returns {number} - Bonificador de competencia.
   */
  function calcularProficiencyBonus(n) {
    return Math.floor((n - 1) / 4) + 2;
  }

  /**
   * Calcula la tirada de salvación (saving throw) en base a la estadística y si se es competente.
   *
   * @param {number} statIndex - Índice de la estadística correspondiente.
   * @returns {number} - Resultado de la tirada de salvación.
   */
  const calcularSavingThrow = (statIndex) => {
    const bonus = statBonus(stats[statIndex]); // Modificador base

    const proficiencyBonus = calcularProficiencyBonus(level);
    return savingThrowsBool[statIndex] ? bonus + proficiencyBonus : bonus;
  };

  /**
   * Alterna la selección de una habilidad de clase, respetando el máximo permitido.
   *
   * @param {number} skillIndex - Índice de la habilidad.
   * @param {number} max - Máximo de habilidades seleccionables.
   */
  const handleClassSkillToggle = (skillIndex, max) => {
    setSelectedClassSkills((prev) => {
      if (prev.includes(skillIndex)) {
        return prev.filter((s) => s !== skillIndex);
      }
  
      if (prev.length >= max) {
        return prev; // No dejar seleccionar más de lo permitido
      }
      console.log(selectedClassSkills);
      return [...prev, skillIndex];
    });
  };

  /**
   * Alterna la selección de una habilidad de multiclase, respetando el máximo permitido.
   *
   * @param {number} skillIndex - Índice de la habilidad.
   * @param {number} max - Máximo de habilidades seleccionables.
   */
  const handleMulticlassSkillToggle = (skillIndex, max) => {
    setSelectedMulticlassSkills((prev) => {
      if (prev.includes(skillIndex)) {
        return prev.filter((s) => s !== skillIndex);
      }
  
      if (prev.length >= max) {
        return prev;
      }
  
      return [...prev, skillIndex];
    });
  };

    /**
     * Alterna la selección de una habilidad general del personaje.
     *
     * @param {string} skill - Nombre o índice de la habilidad.
     */
    const handleSkillSelect = (skill) => {
      // Si la habilidad ya está seleccionada, la deseleccionamos
      if (selectedSkills.includes(skill)) {
        setSelectedSkills(prevState => prevState.filter(item => item !== skill));
      } else {
        // Si la habilidad no está seleccionada, la añadimos
        setSelectedSkills(prevState => [...prevState, skill]);
      }
    };

  /**
   * Genera un objeto JSON representando un personaje de D&D 5e
   * y lo sube a Firebase bajo la colección "Characters".
   *
   * Incluye información sobre:
   * - nombre y nivel
   * - clases y multiclases
   * - estadísticas y modificadores
   * - tiradas de salvación
   * - habilidades
   * - competencias, equipo y hechizos
   * - velocidad, iniciativa y CA
   * - creador (ID del usuario autenticado)
   *
   * Finalmente redirige a la lista de personajes.
   *
   * @function
   * @returns {void}
   */
  function jsonPersonaje() {
    let spellCaster = false;
    let spellCasterMult = false;
    if(spellcastingAbility){
      spellCaster = true;
    }
    if(spellcastingAbilityMulticlass){
      spellCasterMult = true;
    }
    const personaje = {
      name:  characterName,
      level: levelTotal,
      hit_points: hp,
      armor_class: 10+statBonus(stats[2]),  // CA base = Destreza
      initiative: statBonus(stats[2]),  // Iniciativa = Destreza
      speed: speed,
      race: selectedRace,
      class: [
        {
          name: selectedClass,
          level: level,
          subclass: subclass,
          hit_dice: hitDie,
          features: features+subclassFeatures,
          spell_caster: spellCaster
        },
        {
          name: selectedMulticlass,
          level: levelMulticlase,
          subclass: subclassMulticlass,
          hit_dice: hitDieMulticlass,
          features: featuresMulticlase+subclassMulticlassFeatures,
          spell_caster: spellCasterMult
        }
      ],
      stats: {
        strength: stats[0],
        dexterity: stats[1],
        intelligence: stats[2],
        constitution: stats[3],
        wisdom: stats[4],
        charisma: stats[5]
      },
      saving_throws: {
        strength: calcularSavingThrow(0),
        dexterity:  calcularSavingThrow(1),
        intelligence:  calcularSavingThrow(2),
        constitution:  calcularSavingThrow(3),
        wisdom:  calcularSavingThrow(4),
        charisma:  calcularSavingThrow(5)
      },
      skills: {
        acrobatics: skillsBonus[0],
        animal_handling: skillsBonus[1],
        arcana: skillsBonus[2],
        athletics: skillsBonus[3],
        deception: skillsBonus[4],
        history: skillsBonus[5],
        insight: skillsBonus[6],
        intimidation: skillsBonus[7],
        investigation: skillsBonus[8],
        medicine: skillsBonus[9],
        nature: skillsBonus[10],
        perception: skillsBonus[11],
        performance: skillsBonus[12],
        persuasion: skillsBonus[13],
        religion: skillsBonus[14],
        sleight_of_hand: skillsBonus[15],
        stealth: skillsBonus[16],
        survival: skillsBonus[17]
      },
      proficiencies: proficiencies+proficienciesMulticlass,
      equipment: {
        weapons: equipmentSections[0],
        armor: equipmentSections[1],
        tools: equipmentSections[2],
        other: equipmentSections[3]
    },
      spells: {
        spell_slots: {
          level_1: spellSlots[0]+spellSlotsWarlock[0],
          level_2: spellSlots[1]+spellSlotsWarlock[1],
          level_3: spellSlots[2]+spellSlotsWarlock[2],
          level_4: spellSlots[3]+spellSlotsWarlock[3],
          level_5: spellSlots[4]+spellSlotsWarlock[4],
          level_6: spellSlots[5],
          level_7: spellSlots[6],
          level_8: spellSlots[7],
          level_9: spellSlots[8],
        },
        spells_known: 0,
        spellbook: selectedSpells
      },
      background: {
        name: '',
        proficiencies: [],
        equipment: '',
        feature: ''
      },
      creator:  auth.currentUser.uid 
    };
  
    // Ahora imprimimos el JSON
    //console.log(personaje);
    //console.log(selectedSpells);


    let documentId = characterName+"_"+auth.currentUser.uid;
    const db = getFirestore();
    //  Subir a Firebase
    setDoc(doc(db, "Characters", documentId), personaje);

    //volvemos a la lista
    navigate("/Personajes");
    }
   
  /**
   * Hook que actualiza el array `skillsBonus` en base a los atributos del personaje y las habilidades seleccionadas.
   * Se recalcula cuando cambian las estadísticas base (`stats`), las habilidades de clase o multiclase seleccionadas,
   * o el bonus de competencia (`pb`).
   */
  useEffect(() => {
    // Solo actualizamos el array de skillsBonus si los datos de stats, selectedClassSkills, selectedMulticlassSkills, o selectedSkills cambian
    const newSkillsBonus = skills.map((skill) => {
      const statBonusValue = statBonus(stats[skill.statNumber]);
      const proficiencyBonus =
        (selectedClassSkills.includes(skill.index) ||
          selectedMulticlassSkills.includes(skill.index) ||
          selectedSkills.includes(skill.index))
          ? pb
          : 0;

      return statBonusValue + proficiencyBonus;
    });

    // Solo actualizamos el estado si hay un cambio en los valores
    setSkillsBonus((prevSkillsBonus) => {
      // Evitar actualizar si no hay cambios
      if (JSON.stringify(prevSkillsBonus) !== JSON.stringify(newSkillsBonus)) {
        return newSkillsBonus;
      }
      return prevSkillsBonus;
    });
  }, [stats, selectedClassSkills, selectedMulticlassSkills, selectedSkills, pb]);

  
  /**
   * Maneja el cambio de una sección del equipo del personaje.
   * @param {number} index - Índice de la sección a modificar (0: armas, 1: armadura, 2: herramientas, 3: otros).
   * @param {string[]} value - Nuevos valores para esa sección.
   */
  const handleSectionChange = (index, value) => {
    const updatedSections = [...equipmentSections];
    updatedSections[index] = value;
    setEquipmentSections(updatedSections);
  }; 

  /**
   * Lista de habilidades disponibles en D&D 5e con su atributo asociado.
   * @type {Array<{index: string, name: string, stat: string, statNumber: number}>}
   */
  const skills = [
    { index: "skill-acrobatics", name: "Acrobatics", stat: "dexterity", statNumber: 1 },
    { index: "skill-animal-handling", name: "Animal Handling", stat: "wisdom", statNumber: 4 },
    { index: "skill-arcana", name: "Arcana", stat: "intelligence", statNumber: 3 },
    { index: "skill-athletics", name: "Athletics", stat: "strength", statNumber: 0 },
    { index: "skill-deception", name: "Deception", stat: "charisma", statNumber: 5 },
    { index: "skill-history", name: "History", stat: "intelligence", statNumber: 3 },
    { index: "skill-insight", name: "Insight", stat: "wisdom", statNumber: 4 },
    { index: "skill-intimidation", name: "Intimidation", stat: "charisma", statNumber: 5 },
    { index: "skill-investigation", name: "Investigation", stat: "intelligence", statNumber: 3 },
    { index: "skill-medicine", name: "Medicine", stat: "wisdom", statNumber: 4 },
    { index: "skill-nature", name: "Nature", stat: "intelligence", statNumber: 3 },
    { index: "skill-perception", name: "Perception", stat: "wisdom", statNumber: 4 },
    { index: "skill-performance", name: "Performance", stat: "charisma", statNumber: 5 },
    { index: "skill-persuasion", name: "Persuasion", stat: "charisma", statNumber: 5 },
    { index: "skill-religion", name: "Religion", stat: "intelligence", statNumber: 3 },
    { index: "skill-sleight-of-hand", name: "Sleight of Hand", stat: "dexterity", statNumber: 1 },
    { index: "skill-stealth", name: "Stealth", stat: "dexterity", statNumber: 1 },
    { index: "skill-survival", name: "Survival", stat: "wisdom", statNumber: 4 }
  ];
  
/**
 * Diccionario auxiliar para identificar abreviaturas de estadísticas con su índice en el array de `stats`.
 * @type {Array<{key: string, value: number}>}
 */
  var statsDict = [{key:"FUE", value:0},{key:"DEX", value:0},{key:"CON", value:0},{key:"INT", value:0},{key:"WIS", value:0},{key:"CHA", value:0}];

  return (
    <>
      <Header />  
      <main className="mx-4 my-4">
        <button class="btn btn-primary w-auto" onClick={() => jsonPersonaje()}>Save Character</button>

          {/* Nombre del personaje */}
            <div className="col-sm-6 col-md-4 my-4 shadow border rounded p-2 bg-light shadow">
              <div className="form-group">
                <label htmlFor="characterName"><strong>Character Name</strong></label>
                <input
                  type="text"
                  id="characterName"
                  className="form-control"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              </div>
            </div>

        {/* Formulario de estadísticas */}
        <div className="row">
        {["FUE", "DES", "CON", "INT", "WIS", "CHA"].map((statName, index) => {
          statsDict[statName] = stats[index]; // Se ejecuta sin renderizar

          return (
            <div key={statName} className="col-6 col-md-4 col-lg-2 mb-3">
              <div className="border rounded p-2 text-center bg-light shadow">
                <label htmlFor={statName} className="form-label fw-bold">{statName}</label>
                <input
                  type="number"
                  id={statName}
                  className="form-control text-center mb-2"
                  value={stats[index]}
                  min={1}
                  max={30}
                  onChange={(e) => {
                    const rawValue = Number(e.target.value);
                    const clampedValue = Math.max(1, Math.min(30, rawValue));
                    handleInputChange(index, clampedValue);
                  }}
                />
                <div className="small">
                  <div><strong>Bonus:</strong> {statBonus(stats[index])}</div>
                  <div><strong>Save:</strong> {calcularSavingThrow(index)}</div>
                  <div><strong>Proficiency:</strong> {savingThrowsBool[index] ? "✅" : "❌"}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Botón para generar stats aleatorios */}
        <div className="col-12 mt-3">
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary w-auto" onClick={handleRandomStats}>
              Generate Random Stats
            </button>
          </div>
        </div>
      </div>

      {/* HP (Puntos de vida) del personaje */}
      <div className="bg-light p-3 rounded my-4 shadow">
        <div id="hp" className="mb-3">
          <h3>Hit Points (HP): {hp !== null ? hp : "Cargando..."}</h3>
        </div>

        {/* Botones de selección de clase, multiclase y raza */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
            Select Class
          </button>
          {selectedClass && (
            <button className="btn btn-outline-primary" onClick={() => setShowMulticlassModal(true)}>
              Select Multiclass
            </button>
          )}
          <button className="btn btn-outline-primary" onClick={() => setShowRaceModal(true)}>
            Select Race
          </button>
        </div>

        {/* Nivel Clase */}
        {selectedClass && (
          <div className="mb-3">
            <label htmlFor="level" className="form-label">Class Level:</label>
            <input
              type="number"
              id="level"
              min="1"
              max={20 - levelMulticlase}
              value={level}
              onChange={(e) => {
                const value = Math.max(1, Math.min(20 - levelMulticlase, Number(e.target.value)));
                setLevel(value);
              }}
              className="form-control"
              style={{ maxWidth: "150px" }}
            />
          </div>
        )}

        {/* Nivel Multiclase */}
        {selectedMulticlass && (
          <div className="mb-3">
            <label htmlFor="levelM" className="form-label">Multiclass Level:</label>
            <input
              type="number"
              id="levelM"
              min="1"
              max={20 - level}
              value={levelMulticlase}
              onChange={(e) => {
                const value = Math.max(1, Math.min(20 - level, Number(e.target.value)));
                setLevelMulticlase(value);
              }}
              className="form-control"
              style={{ maxWidth: "150px" }}
            />
          </div>
        )}

          {/*Info de Raza*/}
          {selectedRace && <h2>Selected Race: {selectedRace}</h2>}
          {selectedRace && <p>Speed: {speed} ft</p>}
          {selectedRace && <hr/>}

          {/*Info de Clase*/}          
          {selectedClass && <h2>Selected Class: {selectedClass}</h2>}
          {spellcastingAbility && <><p>Spellcasting Ability: {spellcastingAbility.toUpperCase()}</p>
          <p>Spellcasting Bonus: {statBonus(statsDict[spellcastingAbility.toUpperCase()])+pb}</p>
          <p>Spell Saving Difficulty: {statBonus(statsDict[spellcastingAbility.toUpperCase()])+pb+8}</p>
          <p>Spellcasting Level: {casterLevel}</p>
          </>}
          {selectedClass && <hr/>}

          {/*Info de Multiclase*/}
          {selectedMulticlass && <h2>Selected Multiclass: {selectedMulticlass}</h2>}
          {spellcastingAbilityMulticlass && <><p>Spellcasting Ability: {spellcastingAbilityMulticlass.toUpperCase()}</p>
          <p>Spellcasting Bonus: {statBonus(statsDict[spellcastingAbilityMulticlass.toUpperCase()])+pb}</p>
          <p>Spell Saving Difficulty: {statBonus(statsDict[spellcastingAbilityMulticlass.toUpperCase()])+pb+8}</p>
          <p>Spellcasting Level: {casterLevelMulticlass}</p>
          </>}
          {selectedMulticlass && <hr/>}

          {/*Spell Slots*/}
          {spellSlots[0]>0 && <h2>Spell Slots</h2>}
          <ul>
            {spellSlots.map((slots, index) => (
              slots > 0 && <li key={index}>Level {index + 1}: {slots} slots</li>
            ))}
          </ul>
          {spellSlots[0]>0 && <hr/>}

          {/*Warlock Spell Slots*/}
          {(selectedClass=="warlock" || (selectedMulticlass=="warlock" && levelMulticlase>0)) && <h2>Warlock Spell Slots</h2>}
          <ul>
            {spellSlotsWarlock.map((slots, index) => (
              slots > 0 && <li key={index}>Level {index + 1}: {slots} slots</li>
            ))}
          </ul>
          {(selectedClass=="warlock" || (selectedMulticlass=="warlock" && levelMulticlase>0)) && <hr/>}

          <h2>Proficiency Bonus: {pb}</h2>
        </div>

        {/*Contenedor de selección de habilidades*/}
        <div className="card mb-4">
          <div className="card-body text-start">
            <h3 className="mb-4">Skill Selection</h3>
            {/*Selección de habilidades de clase*/}
            {skillsClassNumber > 0 && (
              <>
                <h5 className="mb-3">Choose {skillsClassNumber} Class Skills:</h5>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {skillsClass.map((skill) => (
                    <div key={skill.index} className="border rounded p-2 px-3 bg-light">
                      <div className="form-check m-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`class-skill-${skill.index}`}
                          checked={selectedClassSkills.includes(skill.index)}
                          onChange={() => handleClassSkillToggle(skill.index, skillsClassNumber)}
                          disabled={
                            (!selectedClassSkills.includes(skill.index) &&
                              selectedClassSkills.length >= skillsClassNumber) ||
                            selectedMulticlassSkills.includes(skill.index)
                          }
                        />
                        <label className="form-check-label ms-2" htmlFor={`class-skill-${skill.index}`}>
                          {skill.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
              </>
            )}
          {/*Selección de habilidades de multiclase*/}
          {skillsMulticlassNumber > 0 && (
            <>
              <h5 className="mb-3">Choose {skillsMulticlassNumber} Multiclass Skills:</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {skillsMulticlass.map((skill) => (
                  <div key={skill.index} className="border rounded p-2 px-3 bg-light">
                    <div className="form-check m-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`multiclass-skill-${skill.index}`}
                        checked={selectedMulticlassSkills.includes(skill.index)}
                        onChange={() => handleMulticlassSkillToggle(skill.index, skillsMulticlassNumber)}
                        disabled={
                          (!selectedMulticlassSkills.includes(skill.index) &&
                            selectedMulticlassSkills.length >= skillsMulticlassNumber) ||
                          selectedClassSkills.includes(skill.index)
                        }
                      />
                      <label className="form-check-label ms-2" htmlFor={`multiclass-skill-${skill.index}`}>
                        {skill.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </>
          )}
          {/*Selección de habilidades generales*/}
          <h5 className="mb-3">Select your skills (at least 2):</h5>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {allSkills.map((skill) => (
              <div key={skill.index} className="border rounded p-2 px-3 bg-light">
                <div className="form-check m-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`general-skill-${skill.index}`}
                    checked={selectedSkills.includes(skill.index)}
                    onChange={() => handleSkillSelect(skill.index)}
                    disabled={
                      selectedMulticlassSkills.includes(skill.index) || selectedClassSkills.includes(skill.index)
                    }
                  />
                  <label className="form-check-label ms-2" htmlFor={`general-skill-${skill.index}`}>
                    {skill.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
          {/* Mensaje de advertencia si no se seleccionan al menos 2 habilidades generales */}
          {selectedSkills.length < 2 && selectedSkills.length > 0 && (
            <p className="text-danger mt-2">Please select at least 2 skills because of your background.</p>
          )}
      </div>
    </div>



    {/* Bloque conjunto para habilidades con bonificaciones */}
    <div className="bg-white p-3 rounded shadow mb-4">
      <h3 className="mb-3">Skills with Bonuses</h3>
      <div className="d-flex flex-wrap gap-2">
        {skills.map((skill, index) => {
          const totalBonus = skillsBonus[index];
          return (
            <div key={skill.index} className="border rounded p-2 px-3 d-flex align-items-center">
              <strong className="me-2">{skill.name}</strong>
              <span className={`badge ${totalBonus >= 0 ? "bg-success" : "bg-danger"} rounded-pill`}>
                {totalBonus >= 0 ? `+${totalBonus}` : totalBonus}
              </span>
            </div>
          );
        })}
      </div>
    </div>



  {/* Bloque conjunto para proficiencies */}
  <div className="bg-white p-3 rounded shadow mb-4">
    {/* Proficiencies de clase */}
    <h3 className="mb-2">Competencias varias</h3>
    <ul className="list-group mb-3">
      {proficiencies.length > 0 ? (
        proficiencies.map((prof, index) => (
          <li key={index} className="list-group-item">
            {prof}
          </li>
        ))
      ) : (
        <li className="list-group-item text-muted">No hay proficiencias disponibles</li>
      )}
    </ul>

    {selectedMulticlass && (
      <>
        {/* Proficiencies de multiclase */}
        <h3 className="mb-2">Competencias multiclase</h3>
        <ul className="list-group">
          {proficienciesMulticlass.length > 0 ? (
            proficienciesMulticlass.map((prof, index) => (
              <li key={index} className="list-group-item">
                {prof}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No hay proficiencias disponibles</li>
          )}
        </ul>
      </>
    )}
  </div>


      {/* Selector de hechizos */}
      <SpellSelector
        classList={[selectedClass, selectedMulticlass]}
        spellSlots={[
          spellSlots[0] + (spellSlotsWarlock[0] || 0), // nivel 1
          spellSlots[1] + (spellSlotsWarlock[1] || 0), // nivel 2
          spellSlots[2] + (spellSlotsWarlock[2] || 0), // nivel 3
          spellSlots[3] + (spellSlotsWarlock[3] || 0), // nivel 4
          spellSlots[4] + (spellSlotsWarlock[4] || 0), // nivel 5
          spellSlots[5],  // nivel 6 (solo de spellSlots)
          spellSlots[6],  // nivel 7 (solo de spellSlots)
          spellSlots[7],  // nivel 8 (solo de spellSlots)
          spellSlots[8],  // nivel 9 (solo de spellSlots)
        ]}
        onSelectSpells={setSelectedSpells}
      />

      {/* Equipment */}
      <div className="mb-4 p-0">
        <div className="table-responsive shadow-lg p-3 mb-0 bg-body rounded">
          <table className="table table-bordered rounded-3 mb-0">
            <thead>
              <tr>
                <th colSpan="4" className="text-center">Equipment</th>
              </tr>
              <tr>
                <th>Weapons</th>
                <th>Armor</th>
                <th>Tools</th>
                <th>Other items</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {["Weapons", "Armor", "Tools", "Other items"].map((label, index) => (
                  <td key={index}>
                    <textarea
                      className="form-control rounded-3"
                      value={equipmentSections[index]}
                      onChange={(e) => handleSectionChange(index, e.target.value)}
                      rows={6}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>



      {/* Lista de Features de la Clase */}
      {(features.length > 0 || featuresMulticlase.length>0 || raceFeatures.length>0) && (<div className="bg-light p-3 rounded my-4 shadow">
        {features.length > 0 && (
          <div className="mb-4">
            <h2 className="h4">Class Features: {selectedClass}</h2>
            <ul className="list-group">
              {features.map((feature) => (
                <li key={feature.index} className="list-group-item d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => handleToggleFeature(feature.index)} 
                    className="btn btn-outline-primary btn-sm feature-item"
                  >
                    <strong className="feature-name">{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p className="mt-2 mx-2">{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de Features de la Subclase */}
        {subclass && subclassFeatures.length > 0 && (
          <div className="mb-4">
            <h2 className="h4">Subclass Features: {subclass}</h2>
            <ul className="list-group">
              {subclassFeatures.map((feature) => (
                <li key={feature.index} className="list-group-item d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => handleToggleFeature(feature.index)} 
                    className="btn btn-outline-primary btn-sm feature-item"
                  >
                    <strong className="feature-name">{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p className="mt-2 mx-2">{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de Features de la MultiClase */}
        {featuresMulticlase.length > 0 && (
          <div className="mb-4">
            <h2 className="h4">Multiclass Features: {selectedMulticlass}</h2>
            <ul className="list-group">
              {featuresMulticlase.map((feature) => (
                <li key={feature.index} className="list-group-item d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => handleToggleFeature(feature.index)} 
                    className="btn btn-outline-primary btn-sm feature-item"
                  >
                    <strong className="feature-name">{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p className="mt-2 mx-2">{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de Features de la Subclase de Multiclase */}
        {subclassMulticlass && subclassMulticlassFeatures.length > 0 && (
          <div className="mb-4">
            <h2 className="h4">Subclass Features: {subclassMulticlass}</h2>
            <ul className="list-group">
              {subclassMulticlassFeatures.map((feature) => (
                <li key={feature.index} className="list-group-item d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => handleToggleFeature(feature.index)} 
                    className="btn btn-outline-primary btn-sm feature-item"
                  >
                    <strong className="feature-name">{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p className="mt-2 mx-2">{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de Features de la Raza */}
        {raceFeatures.length > 0 && (
          <div className="mb-4">
            <h2 className="h4">Race Features</h2>
            <ul className="list-group">
              {raceFeatures.map((feature) => (
                <li key={feature.index} className="list-group-item d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => handleToggleFeature(feature.index)} 
                    className="btn btn-outline-primary btn-sm feature-item"
                  >
                    <strong className="feature-name">{feature.name}</strong>
                  </button>
                  {expandedFeatures[feature.index] && <p className="mt-2 mx-2">{feature.desc.join(" ")}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>)}

      </main>
      <Footer />

      {/* Modal selección clase */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-3">Selecciona una clase</h2>
            <ul className="list-group">
              {classes.map((clase) => (
                <li
                  key={clase.index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{
                    cursor: selectedMulticlass === clase.index ? "not-allowed" : "pointer",
                    color: selectedMulticlass === clase.index ? "gray" : "black",
                  }}
                >
                  <span
                    onClick={() => {
                      if (selectedMulticlass !== clase.index) {
                        setSelectedClass(clase.index);
                        setShowModal(false);
                      }
                    }}
                  >
                    {clase.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/SRD/class/${clase.index}`, "_blank");
                    }}
                  >
                    Más información
                  </button>
                </li>
              ))}
            </ul>
            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal selección multiclase */}
      {showMulticlassModal && (
        <div className="modal-overlay" onClick={() => setShowMulticlassModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-3">Selecciona una segunda clase</h2>
            <ul className="list-group">
              <li
                className="list-group-item"
                onClick={() => {
                  setSelectedMulticlass(null);
                  setShowMulticlassModal(false);
                  setLevelMulticlase(0);
                  setSubclassMulticlass(null);
                }}
                style={{ cursor: "pointer" }}
              >
                Ninguna
              </li>
              {classes.map((clase) => (
                <li
                  key={clase.index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{
                    cursor: selectedClass === clase.index ? "not-allowed" : "pointer",
                    color: selectedClass === clase.index ? "gray" : "black",
                  }}
                >
                  <span
                    onClick={() => {
                      if (selectedClass !== clase.index) {
                        setSelectedMulticlass(clase.index);
                        setShowMulticlassModal(false);
                      }
                    }}
                  >
                    {clase.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/SRD/class/${clase.index}`, "_blank");
                    }}
                  >
                    Más información
                  </button>
                </li>
              ))}
            </ul>
            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setShowMulticlassModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal selección raza */}
      {showRaceModal && (
        <div className="modal-overlay" onClick={() => setShowRaceModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Selecciona una raza</h2>
            <ul className="list-group">
              {races.map((race) => (
                <li
                  key={race.index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedRace(race.index);
                    setShowRaceModal(false);
                  }}
                >
                  {race.name}
                  <button
                    onClick={() => window.open(`/SRD/race/${race.index}`, "_blank")}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Más información
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowRaceModal(false)} className="btn btn-secondary mt-2">Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}
