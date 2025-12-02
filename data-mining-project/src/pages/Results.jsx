import React from "react";
import "../styles/Results.css";
import { useNavigate } from "react-router-dom";

const Results = ({ healthGroup = "Diabetic" }) => {
    const navigate = useNavigate();

    let message;

    switch (healthGroup) {
        case "Healthy":
            message =
                "Our model indicates that you are currently at low risk for diabetes. Maintain your healthy lifestyle and continue regular check-ups with your doctor.";
            break;
        case "Prediabetic":
            message =
                "Our model indicates that you may be at increased risk for developing diabetes. Lifestyle changes and early intervention can significantly reduce your risk. Please consult your doctor for personalized advice.";
            break;
        case "Diabetic":
        default:
            message =
                "Our model indicates that you are at risk for diabetes. These results do not replace a real medical diagnosis. See your doctor for a proper diagnosis and treatment plan.";
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