import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "../../assets/css/App.css";
import "../../assets/css/modal.css";
import SpellSelector from "./SpellSelector";
import { auth } from "../../firebase/config";


export default function PersonajesNuevo() {
  const [selectedSpells, setSelectedSpells] = useState([]);  
  const [showModal, setShowModal] = useState(false);
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [showMulticlassModal, setShowMulticlassModal] = useState(false);
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
  const [features, setFeatures] = useState([]);
  const [featuresMulticlase, setFeaturesMulticlase] = useState([]);
  const [raceFeatures, setRaceFeatures] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [subclass, setSubclass] = useState(null);
  const [subclassFeatures, setSubclassFeatures] = useState([]);
  const [subclassMulticlass, setSubclassMulticlass] = useState(null);
  const [subclassMulticlassFeatures, setSubclassMulticlassFeatures] = useState([]);
  const [stats, setStats] = useState([10, 10, 10, 10, 10, 10]);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [hitDie, setHitDie] = useState(null);
  const [hitDieMulticlass, setHitDieMulticlass] = useState(null);
  const [hp, setHp] = useState(null);
  //const [savingThrows, setSavingThrows] = useState(null);
  const [savingThrowsBool, setSavingThrowsBool] = useState([false, false, false, false, false, false]);
  const [proficiencies, setProficiencies] = useState([]);
  const [proficienciesMulticlass, setProficienciesMulticlass] = useState([]);
  //const [proficiencyChoicesMulticlass, setProficiencyChoicesMulticlass] = useState([]);
  const [pb, setPb] = useState(calcularProficiencyBonus(levelTotal));
  const [casterLevel, setCasterLevel] = useState(0);
  const [casterLevelMulticlass, setCasterLevelMulticlass] = useState(0);
  const [spellSlots, setSpellSlots] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [spellSlotsWarlock, setSpellSlotsWarlock] = useState([0, 0, 0, 0, 0]);
  const [skillsClass, setSkillsClass] = useState([]);
  const [skillsClassNumber, setSkillsClassNumber] = useState(0);
  const [skillsMulticlass, setSkillsMulticlass] = useState([]);
  const [skillsMulticlassNumber, setSkillsMulticlassNumber] = useState(0);
  const [selectedClassSkills, setSelectedClassSkills] = useState([]);
  const [selectedMulticlassSkills, setSelectedMulticlassSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsBonus, setSkillsBonus] = useState([]);
  const [equipmentSections, setEquipmentSections] = useState(["", "", "", ""]);
  const [characterName, setCharacterName] = useState('');



  


  // Obtén todas las habilidades posibles
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

  useEffect(() => {
    setPb(calcularProficiencyBonus(levelTotal));
  }, [levelTotal]);

  useEffect(() => {
    if(level>0 && levelMulticlase==0){
      setLevelTotal(level);
    }else if(level>0 && levelMulticlase>0){
      setLevelTotal(level+levelMulticlase);
    }
  }, [level, levelMulticlase]);

  useEffect(() => {
    if((casterLevel>0 && level>0) || (casterLevelMulticlass>0 && levelMulticlase>0)){
      let levelEfectivo = 0;
      let levelWarlock = 0;
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


useEffect(() => {
  if (selectedClass) {
    fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        const savingThrowIndexes = data.saving_throws.map((st) => st.index); // ["str", "con", ...]
        //setSavingThrows(savingThrowIndexes);

        setHitDie(data.hit_die)

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

useEffect(() => {
  if (selectedMulticlass) {
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
          setSkillsMulticlass(skills); // <-- crea este useState en tu componente
          setSkillsMulticlassNumber(proficiencyChoices.choose); // <-- crea este useState si quieres mostrar cuántos elegir
          
        } else {
          setSkillsMulticlass([]);
          setSkillsMulticlassNumber(0);
        }

        setProficienciesMulticlass(multiClassProficiencies);
      })
      .catch((error) => console.error("Error fetching multiclass proficiencies:", error));
  }
}, [selectedMulticlass]);



useEffect(() => {
  if (hitDie && level) {
    const conBonus = statBonus(stats[2]); // Modificador de Constitución
    let calculatedHp = hitDie + conBonus; // HP de nivel 1

    if (level > 1) {
      calculatedHp += (level - 1) * ((hitDie / 2) + conBonus);
      console.log(levelMulticlase);
    }

    if(levelMulticlase > 0){
      calculatedHp = calculatedHp+((levelMulticlase) * ((hitDieMulticlass / 2) + conBonus));
    }

    setHp(Math.max(1, Math.floor(calculatedHp))); // Asegurar que HP mínimo sea 1
  }
}, [hitDie, level, stats, hitDieMulticlass, levelMulticlase]);

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/classes/")
      .then((response) => response.json())
      .then((data) => setClasses(data.results))
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  useEffect(() => {
    if (selectedClass && level) {
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${selectedClass.toLowerCase()}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredFeatures = data
            .filter((lvl) => lvl.level <= level)
            .flatMap((lvl) => lvl.features);

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

  useEffect(() => {
    if (subclass && level) {
      fetch(`https://www.dnd5eapi.co/api/2014/subclasses/${subclass}/levels/`)
        .then((response) => response.json())
        .then(async (data) => {
          const filteredSubclassFeatures = data
            .filter((lvl) => lvl.level <= level)
            .flatMap((lvl) => lvl.features);

          const subclassFeaturesWithDesc = await Promise.all(
            filteredSubclassFeatures.map(async (feature) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/2014/features/${feature.index}`);
              const featureData = await res.json();
              return { ...feature, desc: featureData.desc };
            })
          );

          setSubclassFeatures(subclassFeaturesWithDesc);
        })
        .catch((error) => console.error("Error fetching subclass features:", error));
    }
  }, [subclass, level]);

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

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/races/")
      .then((response) => response.json())
      .then((data) => setRaces(data.results))
      .catch((error) => console.error("Error fetching races:", error));
  }, []);

  useEffect(() => {
    if (selectedRace) {
      fetch(`https://www.dnd5eapi.co/api/races/${selectedRace}`)
        .then((response) => response.json())
        .then(async (data) => {
          setSpeed(data.speed);
          const traitsWithDesc = await Promise.all(
            data.traits.map(async (trait) => {
              const res = await fetch(`https://www.dnd5eapi.co/api/traits/${trait.index}`);
              const traitData = await res.json();
              return { ...trait, desc: traitData.desc };
            })
          );
  
          setRaceFeatures(traitsWithDesc);
        })
        .catch((error) => console.error("Error fetching race features:", error));
    }
  }, [selectedRace]);

  const handleToggleFeature = (featureIndex) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [featureIndex]: !prev[featureIndex],
    }));
  };

  const handleRandomStats = () => {
    const newStats = Array.from({ length: 6 }, () => {
      let rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      rolls.sort((a, b) => a - b);
      return rolls.slice(1).reduce((sum, val) => sum + val, 0);
    });

    setStats(newStats);
  };

  // Función para manejar los cambios en los inputs de estadísticas
  const handleInputChange = (index, value) => {
    const newStats = [...stats];
    newStats[index] = Math.max(0, parseInt(value) || 0);  // Para asegurarte que no sea un valor negativo
    setStats(newStats);
  };

  function statBonus(stat) {
    let bonus = Math.floor(stat/2 - 5);
    return bonus;

  }

  function calcularProficiencyBonus(n) {
    return Math.floor((n - 1) / 4) + 2;
  }

  const calcularSavingThrow = (statIndex) => {
    const bonus = statBonus(stats[statIndex]); // Modificador base

    const proficiencyBonus = calcularProficiencyBonus(level);
    return savingThrowsBool[statIndex] ? bonus + proficiencyBonus : bonus;
  };

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

    // Función para manejar la selección de skills
    const handleSkillSelect = (skill) => {
      // Si la habilidad ya está seleccionada, la deseleccionamos
      if (selectedSkills.includes(skill)) {
        setSelectedSkills(prevState => prevState.filter(item => item !== skill));
      } else {
        // Si la habilidad no está seleccionada, la añadimos
        setSelectedSkills(prevState => [...prevState, skill]);
      }
    };

  //Genera un json apto para la base de datos del personaje creado
  function jsonPersonaje() {
    let spellCaster,spellCasterMult = false;
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
      armor_class: 10+statBonus(stats[2]),
      initiative: statBonus(stats[2]),
      speed: speed,
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
    console.log(personaje);
  }
  
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

  //Para manejar los cambios en el equipment
  const handleSectionChange = (index, value) => {
    const updatedSections = [...equipmentSections];
    updatedSections[index] = value;
    setEquipmentSections(updatedSections);
  }; 

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
  

  var statsDict = [{key:"FUE", value:0},{key:"DEX", value:0},{key:"CON", value:0},{key:"INT", value:0},{key:"WIS", value:0},{key:"CHA", value:0}];

  return (
    <>
      <Header />
      <main className="mx-4 my-4">
        <button class="btn btn-primary w-auto" onClick={() => jsonPersonaje()}>Crear Personaje</button>

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
                  <div><strong>Competencia:</strong> {savingThrowsBool[index] ? "✅" : "❌"}</div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="col-12 mt-3">
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary w-auto" onClick={handleRandomStats}>
              Generar Atributos
            </button>
          </div>
        </div>
      </div>

      <div className="bg-light p-3 rounded my-4 shadow">
        <div id="hp" className="mb-3">
          <h3>Puntos de Golpe (HP): {hp !== null ? hp : "Cargando..."}</h3>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
            Clase
          </button>
          {selectedClass && (
            <button className="btn btn-outline-primary" onClick={() => setShowMulticlassModal(true)}>
              Seleccionar Multiclase
            </button>
          )}
          <button className="btn btn-outline-primary" onClick={() => setShowRaceModal(true)}>
            Raza
          </button>
        </div>

        {/* Nivel Clase */}
        {selectedClass && (
          <div className="mb-3">
            <label htmlFor="level" className="form-label">Nivel Clase:</label>
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
            <label htmlFor="levelM" className="form-label">Nivel Multiclase:</label>
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


        <div className="card mb-4">
  <div className="card-body text-start">
    <h3 className="mb-4">Skill Selection</h3>

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

    {selectedSkills.length < 2 && selectedSkills.length > 0 && (
      <p className="text-danger mt-2">Please select at least 2 skills because of your background.</p>
    )}
  </div>
</div>



    
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
        {/* Proficiencies de subclase */}
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
      <div className="mb-4">
        <div className="table-responsive">
          <table className="table table-bordered">
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
                      className="form-control"
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

      {/* Modal clase */}
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

      {/* Modal para la segunda clase */}
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


      {/* Modal raza */}
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
