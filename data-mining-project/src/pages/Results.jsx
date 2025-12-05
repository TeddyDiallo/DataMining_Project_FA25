import React from "react";
import "../styles/Results.css";
import { useNavigate, useLocation } from "react-router-dom";

const Results = ({ healthGroup = "Diabetic" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const prediction = location.state?.prediction;
    let message;

    switch (prediction) {
        case 0:
        default:
            message =
                "Our model indicates that you are currently at low risk for diabetes. Maintain your healthy lifestyle and continue regular check-ups with your doctor.";
            healthGroup = "Healthy"
            break;
        case 1:
            message =
                "Our model indicates that you may be at increased risk for developing diabetes. Lifestyle changes and early intervention can significantly reduce your risk. Please consult your doctor for personalized advice.";
            healthGroup = "At risk for diabetes"
            break;
    }

    return (
        <div className="res-root">
            <div className="res-card">
                <div className="res-gradient-bar" />

                <div className="res-inner">
                    <h1 className="res-title">Diabetes Risk Results</h1>

                    <p className="res-classification">
                        Health Group Classification:{" "}
                        <span className="res-classification-value">{healthGroup}</span>
                    </p>

                    <p className="res-message">{message}</p>

                    <div className="res-models">
                        {/* Logistic Regression */}
                        <div className="res-model-section">
                            <h2 className="res-model-title">Logistic Regression:</h2>
                            <div className="res-placeholder large">
                                <span>Plot Placeholder</span>
                            </div>
                        </div>

                        {/* Support Vector Machine */}
                        <div className="res-model-section">
                            <h2 className="res-model-title">Support Vector Machine:</h2>
                            <div className="res-svm-grid">
                                <div className="res-placeholder small">
                                    <span>Plot</span>
                                </div>
                                <div className="res-placeholder small">
                                    <span>Plot</span>
                                </div>
                                <div className="res-placeholder small">
                                    <span>Plot</span>
                                </div>
                                <div className="res-placeholder small">
                                    <span>Plot</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="res-home-container">
                        <button
                            className="res-home-btn"
                            onClick={() => navigate("/")}
                        >
                            Return to Start
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Results;