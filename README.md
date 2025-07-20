The **Physics Laser Simulator** is an interactive educational tool that visualizes how light behaves when it hits different materials. Built with React and Canvas API, it accurately simulates real-world optical phenomena including:

- **Reflection** - Light bouncing off surfaces
- **Refraction** - Light bending when entering new materials  
- **Total Internal Reflection** - Light getting trapped inside materials
- **Fresnel Reflection** - Partial reflection at material interfaces

### 🎓 Educational Purpose

I created this simulator specifically to help my younger siblings understand physics concepts that can be difficult to visualize in textbooks. The interactive nature makes learning about optics engaging and intuitive. Especially if you dont have lasers and proper materials at home to showcase with

---
## 🎯 How to Use

### Basic Operation
1. **Click "Start"** to begin the simulation
2. **Drag the red laser** around the canvas to change position
3. **Adjust angle** using the input field or by dragging
4. **Select materials** from the dropdown to see different behaviors
5. **Watch the physics** unfold in real-time!

### Understanding the Visualization
- **Incident Ray (Red)**: Your laser beam traveling through air
- **Refracted Ray (Blue)**: Light bending as it enters the material
- **Reflected Ray (Green)**: Light bouncing off the surface
- **Normal Line (Dashed)**: Reference line perpendicular to the surface
- **Angle Display**: Shows the incident angle from the normal

### Experiment Ideas
- **Try steep angles with diamond** - Watch total internal reflection trap light inside!
- **Compare water vs. glass** - Notice how refraction angle changes
- **Use the mirror material** - See perfect reflection in action
- **Shallow angles vs. steep angles** - Observe how Fresnel reflection changes

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/al1kss/physics-rays.git
   cd physics-rays
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 🔬 Physics Behind the Scenes

### Snell's Law
```
n₁ × sin(θ₁) = n₂ × sin(θ₂)
```
Where:
- `n₁, n₂` = refractive indices of materials
- `θ₁, θ₂` = angles from the surface normal

### Critical Angle for Total Internal Reflection
```
θc = arcsin(n₂ / n₁)
```
When `θ > θc` and `n₁ > n₂`, total internal reflection occurs.

### Fresnel Reflection Coefficient
Complex calculations determine how much light reflects vs. refracts at each interface, creating realistic intensity distributions (basically an opacity of a ray).

---

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18.2** - Component-based UI framework
- **Vite 5.0** - Fast development build tool  
- **Canvas API** - High-performance 2D graphics rendering
- **Modern JavaScript** - ES6+ features for clean code

### Core Components
```
src/
├── components/
│   └── Simulator/
│       ├── Canvas.jsx       # Main simulation rendering
│       └── Controls.jsx     # UI controls and legend
├── utils/
│   ├── constants.js         # Material properties & config
│   └── physics.js          # Ray tracing & physics calculations
└── styles/
    └── globals.css         # Responsive styling
```

### Performance Optimizations
- **Efficient ray tracing** with configurable bounce limits
- **Canvas optimizations** for smooth 60fps rendering
- **Debounced calculations** during interactive dragging
- **Memory management** for recursive ray calculations

---

## 🎓 Educational Value

### Learning Objectives
Students will understand:
- How light behaves at material boundaries
- Why there is more than one reflection ray
- Why diamonds sparkle (total internal reflection)
- How fiber optic cables work (light trapping)
- The relationship between refractive index and light bending
- Real-world applications of optical physics

### Classroom Applications
- **Physics demonstrations** for IB Wave Behaviour units
- **Interactive homework** assignments
- **Science fair** project inspiration
- **Visual aid** for difficult concepts


---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-material`
3. **Make your changes**: Add new materials, improve physics, enhance UI
4. **Test thoroughly**: Ensure physics accuracy and performance
5. **Submit a pull request**: Describe your changes and their benefits

### Areas for Contribution
- **New Materials**: Add more optical materials with accurate properties
- **Physics Features**: Implement dispersion, absorption, polarization
- **UI Improvements**: Better mobile experience, accessibility features
- **Educational Content**: More explanations, guided tutorials
- **Performance**: Optimize ray tracing algorithms (although I think they are already good enough lol :))


---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **My little siblings** for inspiring this educational tool
- **Physics teachers** who make complex concepts accessible
- **Open source community** for amazing tools and libraries
- **Scientists and engineers** who study and apply optics in real world

---

## 📞 Contact & Support

- **Author**: Alikhan Abdykaimov
- **Email**: aliabdykaimov@gmail.com
- **GitHub**: [@al1kss](https://github.com/al1kss)
- **Issues**: [Report bugs or request features](https://github.com/al1kss/physics-rays/issues)

---

<div align="center">

**Made with ❤️ to make physics accessible and fun**

*Star ⭐ this repository if it helped you learn something new!*

</div>
