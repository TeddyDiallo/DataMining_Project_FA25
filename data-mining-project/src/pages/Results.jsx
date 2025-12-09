import React from "react";
import "../styles/Results.css";
import { useNavigate, useLocation } from "react-router-dom";

const Results = ({ healthGroup = "Diabetic" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    //Get predictions and plots passed from DataCollection page
    const predictions = location.state?.predictions;
    const svm_plot_url = location.state?.svm_plot_url;
    const svm_prediction = predictions[0][0][0]
    const logistic_plot_url = location.state?.logistic_plot_url;
    const logistic_prediction = predictions[1][0][0]
    const probabilities = location.state?.probs;
    const average_probability = Number(((probabilities[0][0][0] + probabilities[1][0][0]) / 2 * 100).toFixed(1));
    let message;

    //Change message depending on the predictions
    if (svm_prediction === 0 && logistic_prediction === 0) {
            message =
                "Our models indicate that you are currently at low risk for diabetes. Maintain your healthy lifestyle and continue regular check-ups with your doctor.";
            healthGroup = "Healthy"
    }
    //Say user is at risk if either of the two models says they are at risk
    else{
            message =
                "Our models indicate that you may be at increased risk for developing diabetes. Lifestyle changes and early intervention can significantly reduce your risk. Please consult your doctor for personalized advice.";
            healthGroup = "At risk for diabetes"
    }

    let probability_message  = "We estimate that you have a " + average_probability + "% chance of being at risk of diabetes."

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
                    <p className="res-message">{probability_message}</p>

                    <div className="res-models">
                        {/* Logistic Regression */}
                        <div className="res-model-section">
                            <h2 className="res-model-title">Logistic Regression:</h2>
                                <img src={logistic_plot_url} />
                        </div>

                        {/* Support Vector Machine */}
                        <div className="res-model-section">
                            <h2 className="res-model-title">Support Vector Machine:</h2>
                                <img src={svm_plot_url} />
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