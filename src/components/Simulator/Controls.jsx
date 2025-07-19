import React from 'react';
import { MATERIALS } from '../../utils/constants.js';

const MaterialSelector = ({ selectedMaterial, onMaterialChange }) => {
  return (
    <div className="control-group">
      <h3>Material</h3>
      <select
        value={selectedMaterial}
        onChange={(e) => onMaterialChange(e.target.value)}
        className="material-select"
      >
        {Object.entries(MATERIALS).map(([key, material]) => (
          <option key={key} value={key}>
            {material.name} (n={material.refractiveIndex})
          </option>
        ))}
      </select>
    </div>
  );
};

const LaserControls = ({ angle, onAngleChange, isRunning, onToggleRunning, onReset }) => {
  const handleAngleInput = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onAngleChange(value % 360);
    }
  };

  return (
    <div className="control-group">
      <h3>Laser Control</h3>

      <div className="angle-control">
        <label>Angle:</label>
        <input
          type="number"
          value={angle.toFixed(1)}
          onChange={handleAngleInput}
          min="-180"
          max="180"
          step="0.1"
          className="angle-input"
        />
        <span>°</span>
      </div>

      <div className="simulation-controls">
        <button
          onClick={onToggleRunning}
          className={`control-button ${isRunning ? 'stop' : 'start'}`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={onReset}
          className="control-button reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const Legend = () => {
  return (
    <div className="legend">
      <h3>Physics Guide</h3>

      <div className="legend-content">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff0000' }}></div>
          <span>Incident Ray</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00ff00' }}></div>
          <span>Reflected Ray</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#0080ff' }}></div>
          <span>Refracted Ray</span>
        </div>
      </div>

      <div className="physics-info">
        <h4>Key Laws:</h4>
        <div className="physics-law">
          <strong>Reflection:</strong><br/>
          θᵢ = θᵣ
        </div>
        <div className="physics-law">
          <strong>Snell's Law:</strong><br/>
          n₁sin(θ₁) = n₂sin(θ₂)
        </div>
        <div className="physics-law">
          <strong>Total Internal Reflection:</strong><br/>
          When n₁ > n₂ and θ > θc<br/>
          <em>Rays get trapped inside!</em>
        </div>
        <div className="physics-law">
          <strong>Critical Angle:</strong><br/>
          θc = arcsin(n₂/n₁)
        </div>
      </div>
    </div>
  );
};

export { MaterialSelector, LaserControls, Legend };