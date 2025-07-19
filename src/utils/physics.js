import { MATERIALS, PHYSICS, OBJECT } from './constants.js';

// Vector operations
export const Vector = {
  create: (x, y) => ({ x, y }),
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
  subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
  multiply: (v, scalar) => ({ x: v.x * scalar, y: v.y * scalar }),
  magnitude: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  normalize: (v) => {
    const mag = Vector.magnitude(v);
    return mag > 0 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 };
  },
  dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
  reflect: (incident, normal) => {
    const dot = Vector.dot(incident, normal);
    return Vector.subtract(incident, Vector.multiply(normal, 2 * dot));
  }
};

// Convert angle to direction vector
export function angleToDirection(angleDegrees) {
  const angleRad = (angleDegrees * Math.PI) / 180;
  return Vector.normalize({
    x: Math.cos(angleRad),
    y: Math.sin(angleRad)
  });
}

// Convert direction vector to angle
export function directionToAngle(direction) {
  return (Math.atan2(direction.y, direction.x) * 180) / Math.PI;
}

// Calculate line-rectangle intersection
export function lineRectIntersection(rayStart, rayDirection, rect) {
  const { x: rx, y: ry, width: rw, height: rh } = rect;
  const intersections = [];

  // Check intersection with each side of rectangle
  const sides = [
    { start: { x: rx, y: ry }, end: { x: rx + rw, y: ry }, normal: { x: 0, y: -1 } }, // Top
    { start: { x: rx + rw, y: ry }, end: { x: rx + rw, y: ry + rh }, normal: { x: 1, y: 0 } }, // Right
    { start: { x: rx + rw, y: ry + rh }, end: { x: rx, y: ry + rh }, normal: { x: 0, y: 1 } }, // Bottom
    { start: { x: rx, y: ry + rh }, end: { x: rx, y: ry }, normal: { x: -1, y: 0 } } // Left
  ];

  for (const side of sides) {
    const intersection = lineSegmentIntersection(rayStart, rayDirection, side.start, side.end);
    if (intersection) {
      intersections.push({
        point: intersection,
        normal: side.normal,
        distance: Vector.magnitude(Vector.subtract(intersection, rayStart))
      });
    }
  }

  // Return closest intersection
  if (intersections.length === 0) return null;
  return intersections.reduce((closest, current) =>
    current.distance < closest.distance ? current : closest
  );
}

// Line segment intersection calculation
function lineSegmentIntersection(rayStart, rayDirection, segStart, segEnd) {
  const rayEnd = Vector.add(rayStart, Vector.multiply(rayDirection, 10000)); // Extend ray

  const x1 = rayStart.x, y1 = rayStart.y;
  const x2 = rayEnd.x, y2 = rayEnd.y;
  const x3 = segStart.x, y3 = segStart.y;
  const x4 = segEnd.x, y4 = segEnd.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) return null; // Lines are parallel

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t > 0 && u >= 0 && u <= 1) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  }
  return null;
}

// Calculate Fresnel reflectance
export function fresnelReflectance(n1, n2, cosTheta1) {
  const sinTheta1 = Math.sqrt(1 - cosTheta1 * cosTheta1);
  const sinTheta2 = (n1 / n2) * sinTheta1;

  if (sinTheta2 > 1) return 1; // Total internal reflection

  const cosTheta2 = Math.sqrt(1 - sinTheta2 * sinTheta2);

  const rs = Math.pow((n1 * cosTheta1 - n2 * cosTheta2) / (n1 * cosTheta1 + n2 * cosTheta2), 2);
  const rp = Math.pow((n1 * cosTheta2 - n2 * cosTheta1) / (n1 * cosTheta2 + n2 * cosTheta1), 2);

  return (rs + rp) / 2;
}

// Apply Snell's Law for refraction
export function snellsLaw(incidentDirection, normal, n1, n2) {
  const cosTheta1 = -Vector.dot(incidentDirection, normal);
  const sinTheta1Sq = 1 - cosTheta1 * cosTheta1;
  const sinTheta2Sq = (n1 * n1 * sinTheta1Sq) / (n2 * n2);

  if (sinTheta2Sq > 1) return null; // Total internal reflection

  const cosTheta2 = Math.sqrt(1 - sinTheta2Sq);
  const ratio = n1 / n2;

  return Vector.add(
    Vector.multiply(incidentDirection, ratio),
    Vector.multiply(normal, ratio * cosTheta1 - cosTheta2)
  );
}

// Calculate angle between two vectors in degrees
export function angleBetweenVectors(v1, v2) {
  const dot = Vector.dot(Vector.normalize(v1), Vector.normalize(v2));
  const clampedDot = Math.max(-1, Math.min(1, dot)); // Clamp to avoid numerical errors
  return Math.acos(clampedDot) * 180 / Math.PI;
}

// Main ray tracing function
export function traceRay(startPoint, direction, currentMaterial, targetMaterial, intensity = 1.0, bounceCount = 0) {
  if (bounceCount >= PHYSICS.MAX_BOUNCES || intensity < PHYSICS.MIN_INTENSITY) {
    return [];
  }

  const rays = [];
  const materialRect = {
    x: OBJECT.X,
    y: OBJECT.Y,
    width: OBJECT.WIDTH,
    height: OBJECT.HEIGHT
  };

  const intersection = lineRectIntersection(startPoint, direction, materialRect);

  if (!intersection) {
    // Ray misses object, continues to edge of canvas
    const endPoint = Vector.add(startPoint, Vector.multiply(direction, 1000));
    rays.push({
      start: startPoint,
      end: endPoint,
      type: 'incident',
      intensity,
      incidentAngle: null,
      material: currentMaterial,
      bounceCount
    });
    return rays;
  }

  // Ray hits object
  const { point, normal } = intersection;

  // Calculate incident angle (angle between ray and normal)
  const incidentAngle = angleBetweenVectors(Vector.multiply(direction, -1), normal);

  // Determine ray type based on current material and bounce count
  let rayType = 'incident';
  if (bounceCount > 0) {
    // If we're inside a material (not air), it's still refracted light
    rayType = currentMaterial === 'air' ? 'incident' : 'refracted';
  }

  // Add incident ray segment
  rays.push({
    start: startPoint,
    end: point,
    type: rayType,
    intensity,
    incidentAngle: bounceCount === 0 ? incidentAngle : null, // Only show angle for first ray
    material: currentMaterial,
    bounceCount
  });

  // Special case: if both materials are air, ray just continues straight
  if (currentMaterial === 'air' && targetMaterial === 'air') {
    const continuedRays = traceRay(point, direction, targetMaterial, 'air',
                                  intensity * 0.99, bounceCount + 1);
    rays.push(...continuedRays);
    return rays;
  }

  // Handle mirror separately
  if (targetMaterial === 'mirror') {
    const reflectedDirection = Vector.reflect(direction, normal);
    const reflectedRays = traceRay(point, reflectedDirection, currentMaterial, currentMaterial,
                                  intensity * MATERIALS.mirror.reflectance, bounceCount + 1);
    reflectedRays.forEach(ray => {
      ray.type = 'reflected'; // Force reflected type for mirror bounces
    });
    rays.push(...reflectedRays);
    return rays;
  }

  // Now handle real material interfaces
  const n1 = MATERIALS[currentMaterial].refractiveIndex;
  const n2 = MATERIALS[targetMaterial].refractiveIndex;
  const cosTheta1 = -Vector.dot(direction, normal);

  // Check for total internal reflection
  const sinTheta1Sq = 1 - cosTheta1 * cosTheta1;
  const sinTheta2Sq = (n1 * n1 * sinTheta1Sq) / (n2 * n2);
  const isTotalInternalReflection = sinTheta2Sq > 1;

  if (isTotalInternalReflection) {
    // Total internal reflection - but if we're inside material, it should still be blue
    const reflectedDirection = Vector.reflect(direction, normal);
    const reflectedRays = traceRay(point, reflectedDirection, currentMaterial, currentMaterial,
                                  intensity * 0.98, bounceCount + 1);
    reflectedRays.forEach(ray => {
      // If we're inside a material, keep it as refracted (blue), otherwise reflected (green)
      ray.type = currentMaterial === 'air' ? 'reflected' : 'refracted';
    });
    rays.push(...reflectedRays);
  } else {
    // Normal refraction case - calculate Fresnel reflectance
    const reflectance = fresnelReflectance(n1, n2, Math.abs(cosTheta1));

    // Reflected ray
    if (reflectance > 0.01) {
      const reflectedDirection = Vector.reflect(direction, normal);
      const reflectedRays = traceRay(point, reflectedDirection, currentMaterial, currentMaterial,
                                    intensity * reflectance, bounceCount + 1);
      reflectedRays.forEach(ray => {
        // If we're inside a material, keep it as refracted (blue), otherwise reflected (green)
        ray.type = currentMaterial === 'air' ? 'reflected' : 'refracted';
      });
      rays.push(...reflectedRays);
    }

    // Refracted ray
    if ((1 - reflectance) > 0.01) {
      const refractedDirection = snellsLaw(direction, normal, n1, n2);
      if (refractedDirection) {
        // Determine the next material the ray will encounter
        let nextMaterial;
        if (currentMaterial === 'air') {
          // Ray entering the material
          nextMaterial = 'air'; // Will exit back to air when it hits the other side
        } else {
          // Ray inside material, will exit to air
          nextMaterial = 'air';
        }

        const refractedRays = traceRay(point, refractedDirection, targetMaterial, nextMaterial,
                                      intensity * (1 - reflectance) +0.05, bounceCount + 1);
        refractedRays.forEach(ray => {
          ray.type = 'refracted'; // Always blue for refracted rays
        });
        rays.push(...refractedRays);
      }
    }
  }

  return rays;
}