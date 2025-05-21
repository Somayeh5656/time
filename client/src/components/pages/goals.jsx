import React, { useState } from 'react';
import './goals.css';
import { v4 as uuidv4 } from 'uuid';
import { IoIosArrowBack } from "react-icons/io";
import { PiPlusFill } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";

const categories = ['Family', 'Health', 'Financial', 'Social', 'Education', 'Career', 'Character'];
const terms = ['Short Term', 'Medium Term', 'Long Term'];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addGoal = () => {
    const newGoal = {
      id: uuidv4(),
      category: selectedCategory,
      term: '',
      goal: '',
      steps: [],
      completed: false
    };
    setGoals(prev => [...prev, newGoal]);
    setEditingGoalId(newGoal.id);
  };

  const updateGoal = (id, field, value) => {
    setGoals(prev =>
      prev.map(g => g.id === id ? { ...g, [field]: value } : g)
    );
  };

  const updateStep = (goalId, index, text) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const steps = [...g.steps];
          steps[index] = { ...steps[index], text };
          return { ...g, steps };
        }
        return g;
      })
    );
  };

  const addStep = (goalId) => {
    setGoals(prev =>
      prev.map(g => g.id === goalId
        ? { ...g, steps: [...g.steps, { id: uuidv4(), text: '' }] }
        : g
      )
    );
  };

  const removeStep = (goalId, stepId) => {
    setGoals(prev =>
      prev.map(g => g.id === goalId
        ? { ...g, steps: g.steps.filter(s => s.id !== stepId) }
        : g
      )
    );
  };

  const markDone = (goalId) => {
    setGoals(prev =>
      prev.map(g => g.id === goalId ? { ...g, completed: true } : g)
    );
    setEditingGoalId(null);
  };

  const removeGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const openGoal = (id) => {
    setEditingGoalId(id);
  };

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
            }}> <IoIosArrowBack />
            
            </button>
            <p>My Goals for {selectedCategory}</p>           
          </div>

          {goals
            .filter(goal => goal.category === selectedCategory)
            .map(goal => (
              editingGoalId === goal.id ? (
                <div key={goal.id} className="goal-block">
                  <div className="goal-header">
                    <select value={goal.term} onChange={e => updateGoal(goal.id, 'term', e.target.value)}>
                      <option value="">Select Term</option>
                      {terms.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span onClick={() => removeGoal(goal.id)}>
                        <RiDeleteBin6Line />

                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Your goal"
                    value={goal.goal}
                    onChange={e => updateGoal(goal.id, 'goal', e.target.value)}
                  />

                  <div className="action-steps">
                    {goal.steps?.map((step, i) => (
                      <div key={step.id} className="step-input">
                        <input
                          type="text"
                          placeholder={`Step ${i + 1}`}
                          value={step.text}
                          onChange={e => updateStep(goal.id, i, e.target.value)}
                        />
                        <span onClick={() => removeStep(goal.id, step.id)}>
                        <RiDeleteBin6Line />
                        </span>
                      </div>
                    ))}   
                  </div>
                <div className='add-done-buttons'>
                    <button onClick={() => addStep(goal.id)} className='add-step'>
                    <PiPlusFill />
                     Action Step
                     </button>

                  <span className="done-button" onClick={() => markDone(goal.id)}>Done</span>

                </div>

                </div>
              ) : (
                <div
                  key={goal.id}
                  className="goal-summary"
                  onClick={() => openGoal(goal.id)}
                >
                  <strong>{goal.goal}</strong>
                  <span className="tag">{goal.term}</span>
                </div>
              )
            ))
          }

          <div className="footer">
            <button className="add-goal-btn" onClick={addGoal}>
             <PiPlusFill />
             New Goal</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Goals;
