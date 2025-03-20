import { useEffect, useState } from "react";

export default function SkillProficiencyForm() {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/proficiencies");
        const data = await response.json();
        const skillProficiencies = data.results.filter(skill => skill.index.startsWith("skill-"));
        setSkills(skillProficiencies);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }
    fetchSkills();
  }, []);

  const handleSkillChange = (index) => {
    setSelectedSkills(prev => 
      prev.includes(index)
        ? prev.filter(skill => skill !== index)
        : [...prev, index]
    );
  };

  return (
    <div>
      <h2>Select Skill Proficiencies</h2>
      <form>
        {skills.map(skill => (
          <label key={skill.index}>
            <input 
              type="checkbox" 
              value={skill.index} 
              checked={selectedSkills.includes(skill.index)}
              onChange={() => handleSkillChange(skill.index)}
            />
            {skill.name}
          </label>
        ))}
      </form>
      <p>Selected Skills: {selectedSkills.join(", ")}</p>
    </div>
  );
}
