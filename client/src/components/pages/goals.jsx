import React, { useState, useEffect } from 'react';
import './goals.css';
import { v4 as uuidv4 } from 'uuid';
import { IoIosArrowBack } from "react-icons/io";
import { PiPlusFill } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "../../utils/axios";

const categories = ['Family', 'Health', 'Financial', 'Social', 'Education', 'Career', 'Character'];
const terms = ['Short Term', 'Medium Term', 'Long Term'];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addGoal =async () => {
  if (!selectedCategory) return alert("Select a category first");

  const tempId = uuidv4();
  const newGoal = {
    _id: tempId, // käytetään tilapäisenä ID:nä ennen tallennusta
    category: selectedCategory,
    term: 'Short Term',
    goal: '',
    steps: [],
    completed: false,
    isNew: true, // merkitään että ei ole vielä backendissä
  };


  setGoals(prev => [...prev, newGoal]);
  setEditingGoalId(tempId);
};


  const updateGoal = (id, field, value) => {
    setGoals(prev =>
      prev.map(g => g._id === id ? { ...g, [field]: value } : g)
    );
  };

const updateStep = (goalId, index, text) => {
  setGoals(prev =>
    prev.map(g => {
      if (g._id === goalId) {
        const steps = [...g.steps];
        // If step at index doesn't exist, create a new step object with id
        if (!steps[index]) {
          steps[index] = { id: uuidv4(), text };
        } else {
          steps[index] = { ...steps[index], text };
        }
        return { ...g, steps };
      }
      return g;
    })
  );
};


  const addStep = (goalId) => {
    setGoals(prev =>
      prev.map(g => g._id === goalId
        ? { ...g, steps: [...g.steps, { id: uuidv4(), text: '' }] }
        : g
      )
    );
  };

  const removeStep = (goalId, stepId) => {
    setGoals(prev =>
      prev.map(g => g._id === goalId
        ? { ...g, steps: g.steps.filter(s => s.id !== stepId) }
        : g
      )
    );
  };

const [savingId, setSavingId] = useState(null);

const markDone = async (goalId) => {
  setEditingGoalId(null);
  setSavingId(goalId);

  const updatedGoal = goals.find(g => g._id === goalId);
  if (!updatedGoal) return;

  if (!updatedGoal.goal.trim()) {
    alert("Please enter a goal description.");
    setEditingGoalId(goalId);
    setSavingId(null);
    return;
  }

  const filteredSteps = updatedGoal.steps
    .filter(s => s.text.trim() !== '')
    .map(s => ({ ...s, text: s.text.trim() }));

  if (filteredSteps.length === 0) {
    alert("Please add at least one action step.");
    setEditingGoalId(goalId);
    setSavingId(null);
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) return;

  const cleanPayload = {
    category: updatedGoal.category,
    term: updatedGoal.term,
    goal: updatedGoal.goal.trim(),
    steps: filteredSteps,
    completed: true,
  };
  console.log("Saving goal with payload:", cleanPayload);

  try {
    let res;
    if (updatedGoal.isNew) {
      res = await axios.post("/goals", cleanPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      res = await axios.put(`/goals/${goalId}`, cleanPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    setGoals(prev =>
      prev.map(g =>
        g._id === goalId ? { ...g, ...res.data, isNew: false } : g
      )
    );
  } catch (e) {
    console.error("Failed to save goal", e);
    alert("Failed to save goal");
    setEditingGoalId(goalId);
  } finally {
    setSavingId(null);
  }
};



  const removeGoal = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(prev => prev.filter(g => g._id !== id));
    } catch (e) {
      console.error("Failed to delete goal", e);
    }
  };

  const openGoal = (id) => {
    setEditingGoalId(id);
  };

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
      console.log("Fetched goals:", res.data);
      setGoals(res.data);
    } catch (e) {
      console.error("Failed to fetch goals", e);
    }
  };
  fetchGoals();
}, []);


  return (
    <div className="goals-container">
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
          <div className="goals-header">
            <button className="back-btn" onClick={() => {
              setSelectedCategory(null);
              setEditingGoalId(null);
            }}>
              <IoIosArrowBack />
            </button>
            <p>My Goals for {selectedCategory}</p>
          </div>

          {goals
            .filter(goal => goal.category === selectedCategory)
            .map(goal => (
              editingGoalId === goal._id ? (
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

                  <div className="action-steps">
                    {goal.steps?.map((step, i) => (
                      <div key={step.id} className="step-input">
                        <input
                          type="text"
                          placeholder={`Step ${i + 1}`}
                          value={step.text}
                          onChange={e => updateStep(goal._id, i, e.target.value)}
                        />
                        <span onClick={() => removeStep(goal._id, step.id)}>
                          <RiDeleteBin6Line />
                        </span>
                      </div>
                    ))}
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
