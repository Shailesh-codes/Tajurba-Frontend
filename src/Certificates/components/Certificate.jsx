import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import "../public/Styles/style.css";

const Certificate = ({ name, date, certificateType }) => {
  const certificateRef = useRef();

  // Add useEffect to log props and check image loading
  useEffect(() => {
    console.log("Certificate Props:", { name, date, certificateType });
  }, [name, date, certificateType]);

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `${name}_certificate`,
    onBeforeGetContent: () => {
      console.log("Before printing - Certificate content:", certificateRef.current);
    },
    onPrintError: (error) => {
      console.error("Print Error:", error);
    }
  });

  // Update image paths to match your project structure
  const certificateConfig = {
    highest_business: {
      image: "../assets/businessImage.jpg", // Updated path
      nameStyle: {
        position: "absolute",
        top: "42%",  // Adjusted for your template
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "28px",
        textAlign: "center",
        color: "#000",
        fontFamily: "Greates-Draken, sans-serif",
        zIndex: 2,
        pointerEvents: "none",
        userSelect: "none"
      },
      dateStyle: {
        position: "absolute",
        top: "52%",  // Adjusted for your template
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "16px",
        textAlign: "center",
        color: "#000",
        zIndex: 2
      }
    },
    highest_visitor: {
      image: "../assets/visitorImage.jpg",
      nameStyle: {
        position: "absolute",
        top: "42%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "28px",
        textAlign: "center",
        color: "#000",
        fontFamily: "Greates-Draken, sans-serif",
        zIndex: 2
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "16px",
        textAlign: "center",
        color: "#000",
        zIndex: 2
      }
    },
    best_elevator_pitch: {
      image: "../assets/elevatorImage.jpg",
      // Similar styling as highest_business
      nameStyle: {
        position: "absolute",
        top: "42%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "28px",
        textAlign: "center",
        color: "#000",
        fontFamily: "Greates-Draken, sans-serif",
        zIndex: 2
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "16px",
        textAlign: "center",
        color: "#000",
        zIndex: 2
      }
    },
    maximum_referrals: {
      image: "../assets/refImage.jpg",
      // Similar styling as highest_business
      nameStyle: {
        position: "absolute",
        top: "42%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "28px",
        textAlign: "center",
        color: "#000",
        fontFamily: "Greates-Draken, sans-serif",
        zIndex: 2
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "16px",
        textAlign: "center",
        color: "#000",
        zIndex: 2
      }
    },
    mdp_attended: {
      image: "../assets/mdpImage.jpg",
      nameStyle: {
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "28px",
        textAlign: "center",
        color: "#000",
        fontFamily: "Greates-Draken, sans-serif",
        zIndex: 2
      },
      dateStyle: {
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "16px",
        textAlign: "center",
        color: "#595959",
        backgroundColor: "#fff",
        padding: "5px 10px",
        zIndex: 2
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const config = certificateConfig[certificateType];
  const isMDP = certificateType === "mdp_attended";

  // Check if config exists
  if (!config) {
    console.error(`No configuration found for certificate type: ${certificateType}`);
    return <div>Invalid certificate type</div>;
  }

  // Handle image loading error
  const handleImageError = (error) => {
    console.error("Image loading error:", error);
  };

  return (
    <div>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Print Certificate
      </button>

      <div 
        ref={certificateRef} 
        style={{
          width: "1024px", // Match your template size
          height: "681px",  // Match your template size
          position: "relative",
          margin: "20px auto",
          backgroundColor: "#fff",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}>
          <img
            src={config.image}
            alt="Certificate"
            onError={handleImageError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1
            }}
          />
          <div style={config.nameStyle}>
            {name}
          </div>
          <div style={config.dateStyle}>
            {isMDP ? `Date: ${formatDate(date)}` : formatDate(date)}
          </div>
        </div>
      </div>

      {/* Debug information */}
      <div style={{ display: "none" }}>
        <p>Debug Info:</p>
        <p>Name: {name}</p>
        <p>Date: {date}</p>
        <p>Type: {certificateType}</p>
        <p>Image Path: {config.image}</p>
      </div>
    </div>
  );
};

export default Certificate;
