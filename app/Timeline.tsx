import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const timelineData = [
  { date: "2024 - ...", text: "IIM - Bachelor Coding Digital & Innovation" },
  { date: "2019 - 2024 ", text: " CY Tech - Prépa Math-Info" },
  { date: "2016 - 2019", text: " Lycée François MANSART - BAC S" },
];

const Timeline: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setKey(prev => prev + 1);
    }
  }, [isVisible]);

  return isVisible ? (
    <div className="timeline-container" style={{ position: "relative", padding: "3rem", marginTop: "15vh" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "0",
          bottom: "0",
          width: "3px",
          backgroundColor: "#ffffff",
          transform: "translateX(-50%)",
          zIndex: "2",
        }}
      />
      {timelineData.map((item, index) => (
        <motion.div
          key={`${index}-${key}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: (timelineData.length - 1 - index) * 0.5,
            duration: 0.5
          }}
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
              width: "12px",
              height: "12px",
              backgroundColor: "#ffffff",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              width: "200px",
              padding: "1rem",
              backgroundColor: "transparent",
              border: "none",
              marginLeft: index % 2 === 0 ? "0" : "10rem",
              marginRight: index % 2 !== 0 ? "0" : "16rem",
            }}
          >
            <h4>{item.date}</h4>
            <p>{item.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  ) : null;
};

export default Timeline;
