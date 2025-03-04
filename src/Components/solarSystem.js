import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { Slider, Typography, Box, Button } from "@mui/material";
import "../styles/solar.css";
import { db, collection, addDoc, getDocs } from "../firebase";

// Planet component with rotation and label
const Planet = ({ size, distance, speed, color, name }) => {
  const planetRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    planetRef.current.position.x = distance * Math.cos(t);
    planetRef.current.position.z = distance * Math.sin(t);
  });

  return (
    <group ref={planetRef}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, size + 1.5, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </group>
  );
};

// Orbit component to visualize planet orbits
const Orbit = ({ distance }) => {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
  }
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="white" linewidth={1} />
    </line>
  );
};

const SolarSystem = () => {
  const [planets, setPlanets] = useState([
    { name: "Mercury", size: 1, distance: 15, speed: 0.5, color: "gray" },
    { name: "Venus", size: 1.5, distance: 25, speed: 0.3, color: "orange" },
    { name: "Earth", size: 2, distance: 35, speed: 0.2, color: "blue" },
    { name: "Mars", size: 1.8, distance: 45, speed: 0.15, color: "red" },
    { name: "Jupiter", size: 3, distance: 60, speed: 0.1, color: "brown" },
    { name: "Saturn", size: 2.5, distance: 80, speed: 0.08, color: "goldenrod" },
    { name: "Uranus", size: 2, distance: 100, speed: 0.05, color: "lightblue" },
    { name: "Neptune", size: 1.7, distance: 120, speed: 0.03, color: "blue" }
  ]);

  // Save Configuration to Firestore
  const saveConfiguration = async () => {
    try {
      await addDoc(collection(db, "solarConfigurations"), { planets });
      alert("Configuration saved!");
    } catch (error) {
      console.error("Error saving configuration: ", error);
    }
  };

  // Load Last Saved Configuration from Firestore
  const loadConfiguration = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "solarConfigurations"));
      if (!querySnapshot.empty) {
        const latestConfig = querySnapshot.docs[querySnapshot.docs.length - 1].data();
        setPlanets(latestConfig.planets);
        alert("Configuration loaded!");
      } else {
        alert("No saved configurations found.");
      }
    } catch (error) {
      console.error("Error loading configuration: ", error);
    }
  };

  // Handle slider changes
  const handleSliderChange = (index, key, value) => {
    setPlanets(prevPlanets => {
      const updatedPlanets = [...prevPlanets];
      updatedPlanets[index] = { ...updatedPlanets[index], [key]: value };
      return updatedPlanets;
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Controls */}
      <Box sx={{ width: "300px", background: "#222", color: "white", padding: "10px", overflowY: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Adjust Planet Properties
        </Typography>
        {planets.map((planet, index) => (
          <Box key={planet.name} sx={{ marginBottom: "20px" }}>
            <Typography variant="subtitle1">{planet.name}</Typography>

            <Typography variant="body2">Size: {planet.size}</Typography>
            <Slider
              value={planet.size}
              min={0.5}
              max={5}
              step={0.1}
              onChange={(e, val) => handleSliderChange(index, "size", val)}
              sx={{ color: "white" }}
            />

            <Typography variant="body2">Distance: {planet.distance}</Typography>
            <Slider
              value={planet.distance}
              min={10}
              max={150}
              step={1}
              onChange={(e, val) => handleSliderChange(index, "distance", val)}
              sx={{ color: "white" }}
            />

            <Typography variant="body2">Speed: {planet.speed}</Typography>
            <Slider
              value={planet.speed}
              min={0.01}
              max={1}
              step={0.01}
              onChange={(e, val) => handleSliderChange(index, "speed", val)}
              sx={{ color: "white" }}
            />
          </Box>
        ))}

        {/* Save & Load Buttons */}
        <Button variant="contained" color="primary" onClick={saveConfiguration} sx={{ marginRight: "10px" }}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={loadConfiguration}>
          Load
        </Button>
      </Box>

      {/* 3D Solar System Canvas */}
      <Canvas camera={{ position: [0, 50, 100] }} style={{ flex: 1, background: "black" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <OrbitControls />

        {/* Starry Background */}
        <Stars radius={300} depth={60} count={5000} factor={7} fade />

        {/* Sun */}
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshStandardMaterial color="yellow" emissive="orange" />
        </mesh>
        <Text position={[0, 7, 0]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
          Sun
        </Text>

        {/* Orbits & Planets */}
        {planets.map((planet) => (
          <React.Fragment key={planet.name}>
            <Orbit distance={planet.distance} />
            <Planet {...planet} />
          </React.Fragment>
        ))}
      </Canvas>
    </div>
  );
};

export default SolarSystem;
