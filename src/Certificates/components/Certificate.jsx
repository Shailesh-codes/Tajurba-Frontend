import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import "../public/Styles/style.css";

// Import certificate images
import businessImage from "../../../src/Certificates/public/assets/businessImage.jpg";
import visitorImage from "../../../src/Certificates/public/assets/visitorImage.jpg";
import elevatorImage from "../../../src/Certificates/public/assets/elevatorImage.jpg";
import refImage from "../../../src/Certificates/public/assets/refImage.jpg";
import mdpImage from "../../../src/Certificates/public/assets/mdpImage.jpg";

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
      console.log(
        "Before printing - Certificate content:",
        certificateRef.current
      );
    },
    onPrintError: (error) => {
      console.error("Print Error:", error);
    },
  });

  const certificateConfig = {
    highest_business: {
      image: businessImage,
      nameStyle: {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "32px",
        textAlign: "center",
        color: "#000",
        fontFamily: "cursive",
        fontWeight: "bold",
        zIndex: 2,
        textTransform: "capitalize",
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "18px",
        textAlign: "center",
        color: "#000",
        zIndex: 2,
      },
    },
    highest_visitor: {
      image: visitorImage,
      nameStyle: {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "32px",
        textAlign: "center",
        color: "#000",
        fontFamily: "cursive",
        fontWeight: "bold",
        zIndex: 2,
        textTransform: "capitalize",
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "18px",
        textAlign: "center",
        color: "#000",
        zIndex: 2,
      },
    },
    best_elevator_pitch: {
      image: elevatorImage,
      nameStyle: {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "32px",
        textAlign: "center",
        color: "#000",
        fontFamily: "cursive",
        fontWeight: "bold",
        zIndex: 2,
        textTransform: "capitalize",
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "18px",
        textAlign: "center",
        color: "#000",
        zIndex: 2,
      },
    },
    maximum_referrals: {
      image: refImage,
      nameStyle: {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "32px",
        textAlign: "center",
        color: "#000",
        fontFamily: "cursive",
        fontWeight: "bold",
        zIndex: 2,
        textTransform: "capitalize",
      },
      dateStyle: {
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "18px",
        textAlign: "center",
        color: "#000",
        zIndex: 2,
      },
    },
    mdp_attended: {
      image: mdpImage,
      nameStyle: {
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        fontSize: "32px",
        textAlign: "center",
        color: "#000",
        fontFamily: "cursive",
        fontWeight: "bold",
        zIndex: 2,
        textTransform: "capitalize",
      },
      dateStyle: {
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "200px",
        fontSize: "18px",
        textAlign: "center",
        color: "#595959",
        backgroundColor: "transparent",
        padding: "5px 10px",
        zIndex: 2,
      },
    },
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
    console.error(
      `No configuration found for certificate type: ${certificateType}`
    );
    return <div>Invalid certificate type</div>;
  }

  // Handle image loading error
  const handleImageError = (error) => {
    console.error("Image loading error:", error);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handlePrint}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
      >
        Download Certificate
      </button>

      <div
        ref={certificateRef}
        className="certificate-container"
        style={{
          width: "1024px",
          height: "681px",
          position: "relative",
          margin: "20px auto",
          backgroundColor: "#fff",
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={config.image}
            alt="Certificate Template"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
            onLoad={() => console.log("Certificate image loaded successfully")}
            onError={(e) => {
              console.error("Error loading certificate image:", e);
              console.log("Attempted image path:", config.image);
            }}
          />
          <div style={config.nameStyle}>{name || "Name not provided"}</div>
          <div style={config.dateStyle}>
            {date
              ? isMDP
                ? `Date: ${formatDate(date)}`
                : formatDate(date)
              : "Date not provided"}
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
