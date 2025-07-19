import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CANVAS, OBJECT, PHYSICS, MATERIALS } from '../../utils/constants.js';
import { traceRay, angleToDirection, directionToAngle, Vector } from '../../utils/physics.js';

const SimulationCanvas = ({ material, isRunning, laserAngle, onAngleChange }) => {
  const canvasRef = useRef(null);
  const [laserPosition, setLaserPosition] = useState({ x: 100, y: CANVAS.HEIGHT / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [rays, setRays] = useState([]);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const calculateRays = useCallback(() => {
    if (!isRunning) return;

    const direction = angleToDirection(laserAngle);
    const newRays = traceRay(laserPosition, direction, 'air', material);
    setRays(newRays);
  }, [laserPosition, laserAngle, material, isRunning]);

  useEffect(() => {
    calculateRays();
  }, [calculateRays]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    ctx.fillStyle = CANVAS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    drawGrid(ctx);

    drawMaterial(ctx);

    drawLaserSource(ctx);

    if (isRunning && rays.length > 0) {
      drawRays(ctx);

      if (showAnnotations) {
        drawAnnotations(ctx);
      }
    }

    drawNormals(ctx);

  }, [laserPosition, rays, material, isRunning, showAnnotations]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = CANVAS.GRID_COLOR;
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= CANVAS.WIDTH; x += PHYSICS.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS.HEIGHT);
      ctx.stroke();
    }

    for (let y = 0; y <= CANVAS.HEIGHT; y += PHYSICS.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS.WIDTH, y);
      ctx.stroke();
    }
  };

  const drawMaterial = (ctx) => {
    const mat = MATERIALS[material];

    ctx.fillStyle = mat.color;
    ctx.fillRect(OBJECT.X, OBJECT.Y, OBJECT.WIDTH, OBJECT.HEIGHT);

    ctx.strokeStyle = mat.strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(OBJECT.X, OBJECT.Y, OBJECT.WIDTH, OBJECT.HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${mat.name} (n=${mat.refractiveIndex})`,
      OBJECT.X + OBJECT.WIDTH / 2,
      OBJECT.Y + OBJECT.HEIGHT / 2
    );
  };

  const drawLaserSource = (ctx) => {
    ctx.fillStyle = CANVAS.LASER_COLOR;
    ctx.beginPath();
    ctx.arc(laserPosition.x, laserPosition.y, 8, 0, 2 * Math.PI);
    ctx.fill();

    const direction = angleToDirection(laserAngle);
    const endPoint = Vector.add(laserPosition, Vector.multiply(direction, 30));

    ctx.strokeStyle = CANVAS.LASER_COLOR;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(laserPosition.x, laserPosition.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    const arrowSize = 10;
    const arrowAngle = Math.atan2(direction.y, direction.x);

    ctx.beginPath();
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
      endPoint.x - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
      endPoint.y - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
      endPoint.x - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
      endPoint.y - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const drawRays = (ctx) => {
    rays.forEach((ray, index) => {
      let color;
      switch (ray.type) {
        case 'incident':
          color = CANVAS.LASER_COLOR;
          break;
        case 'reflected':
          color = CANVAS.REFLECTED_COLOR;
          break;
        case 'refracted':
          color = CANVAS.REFRACTED_COLOR;
          break;
        default:
          color = '#ffffff';
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = ray.intensity;

      ctx.beginPath();
      ctx.moveTo(ray.start.x, ray.start.y);
      ctx.lineTo(ray.end.x, ray.end.y);
      ctx.stroke();

      ctx.globalAlpha = 1;
    });
  };

  const drawNormals = (ctx) => {
    if (!isRunning || rays.length === 0) return;

    const firstIncidentRay = rays.find(ray =>
      ray.type === 'incident' &&
      ray.incidentAngle !== null &&
      ray.end.x >= OBJECT.X && ray.end.x <= OBJECT.X + OBJECT.WIDTH &&
      ray.end.y >= OBJECT.Y && ray.end.y <= OBJECT.Y + OBJECT.HEIGHT
    );

    if (firstIncidentRay) {
      const hitPoint = firstIncidentRay.end;
      const normalLength = 50;

      let normalStart, normalEnd;

      if (Math.abs(hitPoint.y - OBJECT.Y) < 2) { // Top surface
        normalStart = { x: hitPoint.x, y: hitPoint.y - normalLength };
        normalEnd = { x: hitPoint.x, y: hitPoint.y + normalLength };
      } else if (Math.abs(hitPoint.y - (OBJECT.Y + OBJECT.HEIGHT)) < 2) { // Bottom surface
        normalStart = { x: hitPoint.x, y: hitPoint.y - normalLength };
        normalEnd = { x: hitPoint.x, y: hitPoint.y + normalLength };
      } else if (Math.abs(hitPoint.x - OBJECT.X) < 2) { // Left surface
        normalStart = { x: hitPoint.x - normalLength, y: hitPoint.y };
        normalEnd = { x: hitPoint.x + normalLength, y: hitPoint.y };
      } else if (Math.abs(hitPoint.x - (OBJECT.X + OBJECT.WIDTH)) < 2) { // Right surface
        normalStart = { x: hitPoint.x - normalLength, y: hitPoint.y };
        normalEnd = { x: hitPoint.x + normalLength, y: hitPoint.y };
      } else {
        normalStart = { x: hitPoint.x, y: hitPoint.y - normalLength };
        normalEnd = { x: hitPoint.x, y: hitPoint.y + normalLength };
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);

      // this is normal line
      ctx.beginPath();
      ctx.moveTo(normalStart.x, normalStart.y);
      ctx.lineTo(normalEnd.x, normalEnd.y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Normal', normalStart.x, normalStart.y - 8);

      ctx.setLineDash([]);
    }
  };

  // Draw angle annotations (only for the very first incident ray, clean text only)
  const drawAnnotations = (ctx) => {
    if (rays.length === 0) return;

    // Find the first ray that hits the material (should be the original incident ray)
    const firstIncidentRay = rays.find(ray =>
      ray.type === 'incident' &&
      ray.incidentAngle !== null &&
      ray.end.x >= OBJECT.X && ray.end.x <= OBJECT.X + OBJECT.WIDTH &&
      ray.end.y >= OBJECT.Y && ray.end.y <= OBJECT.Y + OBJECT.HEIGHT
    );

    if (firstIncidentRay) {
      // Just show the angle text, no messy arc
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;

      const text = `${firstIncidentRay.incidentAngle.toFixed(1)}°`;
      const textX = firstIncidentRay.end.x + 20;
      const textY = firstIncidentRay.end.y - 15;

      // Draw text with black outline for visibility
      ctx.strokeText(text, textX, textY);
      ctx.fillText(text, textX, textY);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const distance = Math.sqrt(
      Math.pow(mouseX - laserPosition.x, 2) + Math.pow(mouseY - laserPosition.y, 2)
    );

    if (distance < 15) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Update laser position
    setLaserPosition({ x: mouseX, y: mouseY });

    // Update angle based on direction to material center
    const materialCenter = {
      x: OBJECT.X + OBJECT.WIDTH / 2,
      y: OBJECT.Y + OBJECT.HEIGHT / 2
    };

    const direction = Vector.normalize(
      Vector.subtract(materialCenter, { x: mouseX, y: mouseY })
    );

    const newAngle = directionToAngle(direction);

    // Snap to grid if needed
    const snappedAngle = Math.round(newAngle / PHYSICS.ANGLE_SNAP) * PHYSICS.ANGLE_SNAP;
    onAngleChange(snappedAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, laserPosition]);

  return (
    <div className="simulation-container">
      <canvas
        ref={canvasRef}
        width={CANVAS.WIDTH}
        height={CANVAS.HEIGHT}
        style={{
          backgroundColor: CANVAS.BACKGROUND_COLOR,
          cursor: isDragging ? 'grabbing' : 'grab',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default SimulationCanvas;
