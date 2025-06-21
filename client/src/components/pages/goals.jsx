// React ja muut tarvittavat paketit
import React, { useState, useEffect } from 'react';
import './goals.css'; // Tyylit
import { v4 as uuidv4 } from 'uuid'; // ID:n luontiin
import { IoIosArrowBack } from "react-icons/io"; // Takaisin-nuoli
import { PiPlusFill } from "react-icons/pi"; // Plus-ikoni
import { RiDeleteBin6Line } from "react-icons/ri"; // Roskakori-ikoni
import axios from "../../utils/axios"; // Axios-toteutus backend-yhteyteen

// Mahdolliset kategorioiden ja aikavälien valinnat
const categories = ['Family', 'Health', 'Financial', 'Social', 'Education', 'Career', 'Character'];
const terms = ['Short Term', 'Medium Term', 'Long Term'];

const Goals = () => {
  // Tilat
  const [goals, setGoals] = useState([]); // Tallennetut tavoitteet
  const [editingGoalId, setEditingGoalId] = useState(null); // Muokattava tavoite
  const [selectedCategory, setSelectedCategory] = useState(null); // Valittu kategoria
  const [savingId, setSavingId] = useState(null); // Tavoite, jota tallennetaan

    // Haetaan tavoitteet backendistä
  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      try {
        const res = await axios.get("/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(res.data);
      } catch (e) {
        console.error("Failed to fetch goals", e);
      }
    };
    fetchGoals();
  }, []);

  useEffect(()=>{
    const fetchGoals=async()=>{
      const token= localStorage.getItem("token");
      try{
        const res= await axios.get("./goals", {
          headers:{ Authorization: ` Bearer ${token}`}
        });
        setGoals(res.data);
      }catch(e){
        console.error("Failed to fetch goals",e)

      }
    }
    fetchGoals;

  },[])

  // Uuden tavoitteen luonti
  const addGoal = async () => {
    if (!selectedCategory) return alert("Select a category first");

    const tempId = uuidv4(); // Väliaikainen ID
    const newGoal = {
      _id: tempId,
      category: selectedCategory,
      term: 'Short Term',
      goal: '',
      steps: [],
      completed: false,
      isNew: true // Merkitään että ei vielä tallennettu backendissä
    };

    setGoals(prev => [...prev, newGoal]);
    setEditingGoalId(tempId); // Avataan suoraan muokattavaksi
  };

  // Tavoitteen kentän muokkaus (esim. goal tai term)
  const updateGoal = (id, field, value) => {
    setGoals(prev =>
      prev.map(g => g._id === id ? { ...g, [field]: value } : g)
    );
  };

  // Vaiheen muokkaus
  const updateStep = (goalId, index, text) => {
    setGoals(prev =>
      prev.map(g => {
        if (g._id === goalId) {
          const steps = [...g.steps];
          if (!steps[index]) {
            steps[index] = { id: uuidv4(), text }; // Luo uusi vaihe
          } else {
            steps[index] = { ...steps[index], text }; // Päivitä vaihe
          }
          return { ...g, steps };
        }
        return g;
      })
    );
  };

  // Lisää vaihe
  const addStep = (goalId) => {
    setGoals(prev =>
      prev.map(g => g._id === goalId
        ? { ...g, steps: [...g.steps, { id: uuidv4(), text: '' }] }
        : g
      )
    );
  };

  // Poista vaihe
  const removeStep = (goalId, stepId) => {
    setGoals(prev =>
      prev.map(g => g._id === goalId
        ? { ...g, steps: g.steps.filter(s => s.id !== stepId) }
        : g
      )
    );
  };


  const markDone=async(goalId)=>{
    setEditingGoalId(null);
    setSavingId(goalId);

    const updatedGoal =goals.find( g=> g._id===goalId);
    if( !updatedGoal) return;

    if(!updatedGoal.goal.trim()){
      alert("Please enter a goal description")
      setEditingGoalId(goalId)
      setSavingId(null)
      return;
    }

    const filteredSteps= updatedGoal.steps
    .filter(s=> s.text.trim() !== '')
    .map(s=>({...s, text: s.text.trim()}));
  

  if(filteredSteps.length===0){
    alert("Please add at least one action step.")
    setEditingGoalId(goalId)
    setSavingId(null)
    return;
  }

  const token= localStorage.getItem("token");
  if(!token) return;

  const cleanPayLoad= {
    category: updatedGoal.category,
    term: updatedGoal.term,
    goal: updatedGoal.goal.trim(),
    steps: filteredSteps,
    completed:true,
  };

  try{
    let res;
    if( updatedGoal.isNew){
      res= await axios.post("./goals",cleanPayLoad, {headers:
        {Authorization: `Bearer ${token}`}
      })
    }else{
      res = await axios.put(`./goals/${goalId}`, cleanPayLoad, {headers:
        {Authorization: `Bearer ${token}`}
    })
  }
  setGoals(prev=>
    prev.map(g=> 
      g._id=== goalId ? {
        ...g, ...res.data, isNew:false
      }: g
    )
  )
  }catch(e){
      console.error("Failed to save goal")
      alert("Failed to save goal.")
      setEditingGoalId(goalId)
    } finally{
      setSavingId(null)
    }};
  

  const removeGoal= async(id)=>{
    const token=localStorrage.getItem("token");
    if(!token) return;

    try{
      await axios.delete(`./goals/${id}`,{headers:{
        Authorization:` Bearer${token} `}});
        setGoals(prev=> prev.filter(g._id !== id));
    }catch(e){
      console.error("Fialed to delete goal",e);
    }
  };

  const openGoal=(id)=>{
    setEditingGoalId(id)
  }

  return (
    <div className="goals-container">
      {/* Kategoria valinta näkymä */}
      {!selectedCategory ? (
        <div className="category-selection">
          <h2>Select a Category</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <div key={cat} className="category-card" onClick={() => setSelectedCategory(cat)}>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Kategoria valittu, näytetään tavoitteet */}
          <div className="goals-header">
            <button className="back-btn" onClick={() => {
              setSelectedCategory(null);
              setEditingGoalId(null);
            }}>
              <IoIosArrowBack />
            </button>
            <p>My Goals for {selectedCategory}</p>
          </div>

          {/* Tavoitteiden lista */}
          {goals
            .filter(goal => goal.category === selectedCategory)
            .map(goal => (
              editingGoalId === goal._id ? (
                // Muokkausnäkymä
                <div key={goal._id} className="goal-block">
                  <div className="goal-header">
                    <select value={goal.term} onChange={e => updateGoal(goal._id, 'term', e.target.value)}>
                      <option value="">Select Term</option>
                      {terms.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span onClick={() => removeGoal(goal._id)}>
                      <RiDeleteBin6Line />
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Your goal"
                    value={goal.goal}
                    onChange={e => updateGoal(goal._id, 'goal', e.target.value)}
                  />

                  <div className='action-steps'>
                    {
                      goal.steps?.map((step,i)=>(
                        <div key={step.id} className='step-input'>
                          <input
                          type="text"
                          placeholder={`step ${i+1}`}
                          value={step.text}
                          onChange={e=> updateStep(goal._id, i, e.target.value)}
                          />
                          <span onClick={()=> removeStep(goal._id, step.id)}>
                            <RiDeleteBin6Line/>
                          </span>
                        </div>
                      ))
                    }
                  </div>


                  <div className='add-done-buttons'>
                    <button onClick={() => addStep(goal._id)} className='add-step'>
                      <PiPlusFill />
                      Action Step
                    </button>
                    <span className="done-button" onClick={() => markDone(goal._id)}>Done</span>
                  </div>
                </div>
              ) : (
                // Yhteenvetonäkymä
                <div
                  key={goal._id}
                  className="goal-summary"
                  onClick={() => openGoal(goal._id)}
                >
                  <strong>{goal.goal}</strong>
                  <span className="term-tag">{goal.term}</span>
                </div>
              )
            ))
          }

          {/* Uusi tavoite */}
          <div className="footer">
            <button className="add-goal-btn" onClick={addGoal}>
              <PiPlusFill />
              New Goal
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Goals;
