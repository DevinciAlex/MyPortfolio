import React from "react";
import { motion } from "framer-motion";

const timelineData = [
  { date: "2010", text: "Début de mes études en informatique" },
  { date: "2014", text: "Premier stage en entreprise" },
  { date: "2016", text: "Diplôme obtenu et premier emploi" },
  { date: "2020", text: "Changement de carrière vers le développement web" },
];

const Timeline: React.FC = () => {
  return (
    <div className="timeline-container" style={{ position: "relative", padding: "2rem" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "0",
          bottom: "0",
          width: "4px",
          backgroundColor: "#ccc",
          transform: "translateX(-50%)",
        }}
      />
      {timelineData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.5, duration: 0.5 }}
          style={{
            position: "relative",
            marginBottom: "2rem",
            display: "flex",
            flexDirection: index % 2 === 0 ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              width: "16px",
              height: "16px",
              backgroundColor: "#007bff",
              borderRadius: "50%",
            }}
          ></div>
          <div
            style={{
              width: "200px",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4>{item.date}</h4>
            <p>{item.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
