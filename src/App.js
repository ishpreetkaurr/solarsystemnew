import React, { useEffect } from "react";
import SolarSystem from "./Components/solarSystem";
import { db, collection, addDoc, getDocs } from "./firebase";

function App() {
  useEffect(() => {
    async function testFirestore() {
      try {
        // Add test data to Firestore
        const docRef = await addDoc(collection(db, "testCollection"), {
          name: "Solar System",
          status: "Connected",
          timestamp: new Date(),
        });
        console.log("Document written with ID:", docRef.id);

        // Retrieve data from Firestore
        const querySnapshot = await getDocs(collection(db, "testCollection"));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });

      } catch (error) {
        console.error("Error with Firestore:", error);
      }
    }

    async function addPlanetsToFirestore() {
      try {
        const planets = [
          { name: "Mercury", size: "Small", distance: "57.9 million km" },
          { name: "Venus", size: "Medium", distance: "108.2 million km" },
          { name: "Earth", size: "Medium", distance: "149.6 million km" },
          { name: "Mars", size: "Small", distance: "227.9 million km" },
          { name: "Jupiter", size: "Large", distance: "778.5 million km" },
          { name: "Saturn", size: "Large", distance: "1.4 billion km" },
          { name: "Uranus", size: "Medium", distance: "2.9 billion km" },
          { name: "Neptune", size: "Medium", distance: "4.5 billion km" },
        ];

        const planetCollection = collection(db, "planets");

        for (const planet of planets) {
          const docRef = await addDoc(planetCollection, planet);
          console.log(`Added ${planet.name} with ID:`, docRef.id);
        }

        // Retrieve and log stored planets
        const querySnapshot = await getDocs(planetCollection);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });

      } catch (error) {
        console.error("Error adding planets to Firestore:", error);
      }
    }

    testFirestore();
    addPlanetsToFirestore();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <SolarSystem />
    </div>
  );
}

export default App;
