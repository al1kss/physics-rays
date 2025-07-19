export const MATERIALS = {
  air: {
    name: 'Air',
    refractiveIndex: 1.000293,
    color: 'rgba(230, 243, 255, 0.3)',
    strokeColor: '#e6f3ff',
    absorptionCoeff: 0.0001,
    reflectance: 0.04
  },
  water: {
    name: 'Water',
    refractiveIndex: 1.333,
    color: 'rgba(77, 166, 255, 0.4)',
    strokeColor: '#4da6ff',
    absorptionCoeff: 0.01,
    reflectance: 0.02
  },
  glass: {
    name: 'Crown Glass',
    refractiveIndex: 1.52,
    color: 'rgba(204, 255, 204, 0.4)',
    strokeColor: '#ccffcc',
    absorptionCoeff: 0.001,
    reflectance: 0.04
  },
  flintGlass: {
    name: 'Flint Glass',
    refractiveIndex: 1.62,
    color: 'rgba(255, 230, 204, 0.4)',
    strokeColor: '#ffe6cc',
    absorptionCoeff: 0.002,
    reflectance: 0.05
  },
  diamond: {
    name: 'Diamond',
    refractiveIndex: 2.42,
    color: 'rgba(255, 255, 204, 0.5)',
    strokeColor: '#ffffcc',
    absorptionCoeff: 0.0001,
    reflectance: 0.17
  },
  oil: {
    name: 'Oil',
    refractiveIndex: 1.47,
    color: 'rgba(255, 200, 100, 0.4)',
    strokeColor: '#ffc864',
    absorptionCoeff: 0.005,
    reflectance: 0.03
  },
  mirror: {
    name: 'Mirror',
    refractiveIndex: 1.0,
    color: 'rgba(192, 192, 192, 0.8)',
    strokeColor: '#c0c0c0',
    absorptionCoeff: 0.05,
    reflectance: 0.95
  }
};

export const PHYSICS = {
  MAX_BOUNCES: 10,
  MIN_INTENSITY: 0.01,
  CRITICAL_ANGLE_THRESHOLD: 0.001,
  GRID_SIZE: 20,
  ANGLE_SNAP: 5
};

export const CANVAS = {
  WIDTH: 1000,
  HEIGHT: 700,
  BACKGROUND_COLOR: '#1a1a1a',
  GRID_COLOR: 'rgba(255, 255, 255, 0.1)',
  LASER_COLOR: '#ff0000',
  REFLECTED_COLOR: '#00ff00',
  REFRACTED_COLOR: '#0080ff',
  NORMAL_COLOR: 'rgba(255, 255, 255, 0.5)'
};

export const OBJECT = {
  WIDTH: 200,
  HEIGHT: 150,
  X: CANVAS.WIDTH / 2 - 100, 
  Y: CANVAS.HEIGHT / 2 - 75
};