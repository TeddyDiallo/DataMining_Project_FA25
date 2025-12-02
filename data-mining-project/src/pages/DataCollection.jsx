import React, { useState } from "react";
import "../styles/DataCollection.css";
import { useNavigate } from "react-router-dom";

const DataCollection = () => {
    const navigate = useNavigate();

    const [highBp, setHighBp] = useState(null);          // true/false
    const [highChol, setHighChol] = useState(null);      // true/false
    const [cholChecked5yr, setCholChecked5yr] = useState(null); // true/false
    const [bmi, setBmi] = useState("");
    const [stroke, setStroke] = useState(null);          // Binary
    const [physActivity, setPhysActivity] = useState(null); // Binary
    const [genHlth, setGenHlth] = useState("");          // 1–5
    const [fruits, setFruits] = useState(null);          // Binary
    const [veggies, setVeggies] = useState(null);        // Binary
    const [mentHlth, setMentHlth] = useState("");

    // ensure all fields are filled out
    const allFilled =
        highBp !== null &&
        highChol !== null &&
        cholChecked5yr !== null &&
        bmi !== "" &&
        stroke !== null &&
        physActivity !== null &&
        genHlth !== "" &&
        fruits !== null &&
        veggies !== null &&
        mentHlth !== "";

    const handleBmiChange = (e) => {
        const value = e.target.value;
        setBmi(value === "" ? "" : parseFloat(value));
    };

    return (
        <div className="dc-root">
            <div className="dc-card">
                <div className="dc-gradient-bar" />
                <div className="dc-inner">
                    <h1 className="dc-title">Data Collection:</h1>
                    <p className="dc-subtitle">
                        Tell us about your health and lifestyle, so we can
                        predict whether you are at risk for diabetes.
                    </p>

                    <hr style={{ border: 'none', height: '1px', backgroundColor: 'lightgray' }} />

                    <div className="dc-rows">
                        {/* 1. High blood pressure */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you have high blood pressure?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${highBp === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setHighBp(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${highBp === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setHighBp(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 2. High cholesterol */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you have high cholesterol?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${highChol === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setHighChol(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${highChol === false ? "dc-btn-active" : ""
                                        }`}
                                    onClick={() => setHighChol(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 3. Cholesterol checked in last 5 years */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Have you had your cholesterol checked in the last 5 years?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${cholChecked5yr === true ? "dc-btn-active" : ""
                                        }`}
                                    onClick={() => setCholChecked5yr(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${cholChecked5yr === false ? "dc-btn-active" : ""
                                        }`}
                                    onClick={() => setCholChecked5yr(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 4. BMI */}
                        <div className="dc-row">
                            <span className="dc-question">
                                What is your Body Mass Index (BMI)?
                            </span>
                            <div className="dc-controls">
                                <input
                                    type="number"
                                    step="0.1"
                                    className="dc-input"
                                    placeholder="0.0"
                                    value={bmi === "" ? "" : bmi}
                                    onChange={handleBmiChange}
                                />
                            </div>
                        </div>

                        {/* 5. Stroke */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Have you ever had a stroke?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${stroke === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setStroke(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${stroke === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setStroke(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 6. Physical activity in past 30 days */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Have you done any physical activity in the past 30 days (not including your job)?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${physActivity === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setPhysActivity(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${physActivity === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setPhysActivity(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 7. General health 1–5 */}
                        <div className="dc-row">
                            <span className="dc-question">
                                In general, how would you rate your health? (1 = excellent, 5 = poor)
                            </span>
                            <div className="dc-controls">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="1"
                                    className="dc-input"
                                    placeholder="1–5"
                                    value={genHlth === "" ? "" : genHlth}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setGenHlth(v === "" ? "" : parseInt(v, 10));
                                    }}
                                />
                            </div>
                        </div>

                        {/* 8. Fruit consumption */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you consume fruit 1 or more times per day?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${fruits === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setFruits(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${fruits === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setFruits(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 9. Vegetable consumption */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you consume vegetables 1 or more times per day?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${veggies === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setVeggies(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${veggies === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setVeggies(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 10. Mental health days 1–30 */}
                        <div className="dc-row">
                            <span className="dc-question">
                                During the past 30 days, for how many days was your mental health not good?
                            </span>
                            <div className="dc-controls">
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    step="1"
                                    className="dc-input"
                                    placeholder="1–30"
                                    value={mentHlth === "" ? "" : mentHlth}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setMentHlth(v === "" ? "" : parseInt(v, 10));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="dc-next-container">
                            <button
                                type="button"
                                disabled={!allFilled}
                                className={`dc-next-btn ${allFilled ? "enabled" : "disabled"}`}
                                onClick={() => navigate("/results")}
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataCollection;