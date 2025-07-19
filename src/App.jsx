import React, { useState, useEffect } from 'react';
import SimulationCanvas from './components/Simulator/Canvas.jsx';
import { MaterialSelector, LaserControls, Legend } from './components/Simulator/Controls.jsx';
import './styles/globals.css';

function App() {
  const [selectedMaterial, setSelectedMaterial] = useState('glass');
  const [laserAngle, setLaserAngle] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-hide tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 100000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setLaserAngle(45);
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="app-header">
          <h1>Physics Laser Sim</h1>
          <p>Interactive Reflection & Refraction</p>
        </div>

        <div className="controls-section">
          <MaterialSelector
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
          />

          <LaserControls
            angle={laserAngle}
            onAngleChange={setLaserAngle}
            isRunning={isRunning}
            onToggleRunning={handleToggleRunning}
            onReset={handleReset}
          />
        </div>

        <div className="legend-section">
          <Legend />
        </div>

        <div className="instructions">
          <p><strong>Instructions:</strong></p>
          <p>• Drag red laser to move position</p>
          <p>• Use angle input for precision</p>
          <p>• Change materials to see different effects</p>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="main-simulation">
        <SimulationCanvas
          material={selectedMaterial}
          isRunning={isRunning}
          laserAngle={laserAngle}
          onAngleChange={setLaserAngle}
        />
      </div>

      {showTooltip && (
        <div className="tooltip-popup">
          <button
            className="tooltip-close"
            onClick={handleCloseTooltip}
            aria-label="Close tooltip"
          >
            ×
          </button>
          <div className="tooltip-content">
            <div className="tooltip-icon">💡</div>
              <div className={"tooltip-text"}>
                <p style={{marginBottom: '12px' }}><strong>Tip:</strong> Try dragging the red laser around!</p>
                <p><strong>Physics:</strong> Those barely visible reflections inside the objects are actually what happen in
                  real life! The intensity gets lower with each distance traveled</p>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;