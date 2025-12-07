import React, { useState } from "react";
import "../styles/DataCollection.css";
import { useNavigate } from "react-router-dom";

//Bucketizes age to align with the dataset
function ageToBRFSS(age) {
    if (age < 18) return null; // BRFSS only codes 18+
    if (age >= 80) return 13;

    // Each bucket is 5 years except the first (18–24 = 7 years)
    if (age <= 24) return 1;

    // For 25–79, compute bucket mathematically:
    return Math.floor((age - 25) / 5) + 2;
}

const DataCollection = () => {
    const navigate = useNavigate();

    const [highBp, setHighBp] = useState(null);          // true/false
    const [highChol, setHighChol] = useState(null);      // true/false
    const [cholChecked5yr, setCholChecked5yr] = useState(null); // true/false
    const [bmi, setBmi] = useState("");
    const [smoker, setSmoker] = useState(null);
    const [stroke, setStroke] = useState(null);  
    const [heartIssues, setHeartIssues] = useState(null); // Binary
    const [physActivity, setPhysActivity] = useState(null); // Binary
    const [fruits, setFruits] = useState(null);          // Binary
    const [veggies, setVeggies] = useState(null);        // Binary
    const [alcohol, setAlcohol] = useState(null);
    const [healthCoverage, sethealthCoverage] = useState(null);
    const [doctorCost, setdoctorCost] = useState(null);
    const [genHlth, setGenHlth] = useState("");          // 1–5
    const [mentHlth, setMentHlth] = useState("");          // 1–5
    const [physHlth, setPhysHlth] = useState("");          // 1–5
    const [difWalking, setdifWalking] = useState(null); 
    const [sex, setSex] = useState(null); 
    const [age, setAge] = useState(null); 
    const [education, setEducation] = useState(null);
    const [income, setIncome] = useState(null);

    // ensure all fields are filled out
    const allFilled =
        highBp !== null &&
        highChol !== null &&
        cholChecked5yr !== null &&
        bmi !== "" &&
        smoker !== null &&
        stroke !== null &&
        heartIssues !== null &&
        physActivity !== null &&
        fruits !== null &&
        veggies !== null &&
        alcohol !== null &&
        healthCoverage !== null &&
        doctorCost !== null &&
        genHlth !== "" &&
        mentHlth !== "" &&
        physHlth !== "" && 
        difWalking !== null &&
        sex !== null &&
        age !== null &&
        education !== null &&
        income !== null;

    const handleBmiChange = (e) => {
        const value = e.target.value;
        setBmi(value === "" ? "" : parseFloat(value));
    };
    const handlePredictAPI = async () => {
    const X = [
        [
        highBp ? 1 : 0,
        highChol ? 1 : 0,
        cholChecked5yr ? 1 : 0,
        bmi,
        smoker ? 1 : 0,
        stroke ? 1 : 0,
        heartIssues ? 1 : 0,
        physActivity ? 1 : 0,
        fruits ? 1 : 0,
        veggies ? 1 : 0,
        alcohol ? 1 : 0,
        healthCoverage ? 1 : 0,
        doctorCost ? 1 : 0,
        genHlth,
        mentHlth,
        physHlth ,
        difWalking ? 1 : 0,
        sex,
        ageToBRFSS(age),
        education,
        income
        ]
    ];

    try {
        //Call predict endpoint
        const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ X })
        });

        const data = await response.json();

        // Call SVM plot endpoint
        const plotSVMResponse = await fetch("http://localhost:8000/plot_svm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pc_test: data.pc_testing,
        })
        });
        const svmBlob = await plotSVMResponse.blob();
        const svmPlotURL = URL.createObjectURL(svmBlob);

        // Call logistic plot endpoint
        const plotLogisticResponse = await fetch("http://localhost:8000/plot_logistic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pc_test: data.pc_testing,
        })
        });
        const logisticBlob = await plotLogisticResponse.blob();
        const logisticPlotURL = URL.createObjectURL(logisticBlob);

        navigate("/results", {
            state: {
                probs: data.probs,
                predictions: data.predictions,
                svm_plot_url: svmPlotURL,
                logistic_plot_url: logisticPlotURL
            }
        });

    } catch (error) {
        console.error("API error:", error);
    }
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

                        {/* 5. Smoker */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Have you smoked at least 100 cigarettes in your life(100 cigarettes = 5 packs)
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${smoker === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setSmoker(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${smoker === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setSmoker(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 6. Stroke */}
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

                        {/* 7. Heart disease/heart attack */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you have heart disease, or have you had a heart attack in the past?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${heartIssues === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setHeartIssues(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${heartIssues === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setHeartIssues(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 8. Physical activity in past 30 days */}
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

                        {/* 9. Fruit consumption */}
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

                        {/* 10. Vegetable consumption */}
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

                        {/* 11. Heavy Alcohol Consumption*/}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you drink heavily? For men, this is 14 drinks on average per week, and for women this is 7 drinks on average per week.
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${alcohol === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setAlcohol(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${alcohol === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setAlcohol(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 12. Health coverage*/}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you have any kind of health care coverage, including health insurance, prepaid plans such as HMO
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${healthCoverage === true ? "dc-btn-active" : ""}`}
                                    onClick={() => sethealthCoverage(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${healthCoverage === false ? "dc-btn-active" : ""}`}
                                    onClick={() => sethealthCoverage(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 13. Could not see a doctor due to cost */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Was there a time in the past 12 months when you needed to see a doctor but could not because of cost?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${doctorCost === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setdoctorCost(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${doctorCost === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setdoctorCost(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 14. General health 1–5 */}
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

                        {/* 15. Mental health days 1–30 */}
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



                        {/* 16. Physical Health */}
                        <div className="dc-row">
                            <span className="dc-question">
                                During the past 30 days, for how many days was your physical health not good?
                            </span>
                            <div className="dc-controls">
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    step="1"
                                    className="dc-input"
                                    placeholder="1–30"
                                    value={physHlth === "" ? "" : physHlth}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setPhysHlth(v === "" ? "" : parseInt(v, 10));
                                    }}
                                />
                            </div>
                        </div>

                        {/* 17. Difficulty walking */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Do you have serious difficulty walking or climbing stairs?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${difWalking === true ? "dc-btn-active" : ""}`}
                                    onClick={() => setdifWalking(true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${difWalking === false ? "dc-btn-active" : ""}`}
                                    onClick={() => setdifWalking(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* 18. Sex */}
                        <div className="dc-row">
                            <span className="dc-question">
                                Please select your sex. 
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${sex === 1 ? "dc-btn-active" : ""}`}
                                    onClick={() => setSex(1)}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${sex === 0 ? "dc-btn-active" : ""}`}
                                    onClick={() => setSex(0)}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        {/* 19. Age */}
                        <div className="dc-row">
                            <span className="dc-question">
                                What is your age?
                               </span>
                            <div className="dc-controls">
                                <input
                                    type="number"
                                    min="1"
                                    max="130"
                                    step="1"
                                    className="dc-input"
                                    placeholder="Enter your age"
                                    value={age === "" ? "" : age}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setAge(v === "" ? "" : parseInt(v, 10));
                                    }}
                                />
                            </div>
                        </div>

                        {/* 20. Education */}
                        <div className="dc-row">
                            <span className="dc-question">
                                What is your level of education?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${education === 1 ? "dc-btn-active" : ""}`}
                                    onClick={() => setEducation(1)}
                                >
                                    Never attended school or only kindegarten
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${education === 2 ? "dc-btn-active" : ""}`}
                                    onClick={() => setEducation(2)}
                                >
                                    Elementary and middle school
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${education === 3 ? "dc-btn-active" : ""}`}
                                    onClick={() => setEducation(3)}
                                >
                                    Some high school
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${education === 4 ? "dc-btn-active" : ""}`}
                                    onClick={() => setEducation(4)}
                                >
                                    High school graduate or equivalent(GED)
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${education === 5 ? "dc-btn-active" : ""}`}
                                    onClick={() => setEducation(5)}
                                >
                                    Some college
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${education === 6 ? "dc-btn-active" : ""}`}
                                    onClick={() => setEducation(6)}
                                >
                                    College graduate
                                </button>
                            </div>
                        </div>

                        {/* 21. Income */}
                        <div className="dc-row">
                            <span className="dc-question">
                                What is your income range?
                            </span>
                            <div className="dc-controls">
                                <button
                                    type="button"
                                    className={`dc-btn ${income === 1 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(1)}
                                >
                                Less than $10,000
                                </button>
                                <button
                                    type="button"
                                    className={`dc-btn ${income === 2 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(2)}
                                >
                                $10,000 - $14,999
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${income === 3 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(3)}
                                >
                                $15,000 - $19,999
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${income === 4 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(4)}
                                >
                                $20,000 - $24,999
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${income === 5 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(5)}
                                >
                                $25,000 - $34,999
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${income === 6 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(6)}
                                >
                                $35,000 - $49,999
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${income === 7 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(7)}
                                >
                                $50,000 - $74,999
                                </button>
                                                                <button
                                    type="button"
                                    className={`dc-btn ${income === 8 ? "dc-btn-active" : ""}`}
                                    onClick={() => setIncome(8)}
                                >
                                $75,000 or more
                                </button>
                            </div>
                        </div>

                        <div className="dc-next-container">
                            <button
                                type="button"
                                disabled={!allFilled}
                                className={`dc-next-btn ${allFilled ? "enabled" : "disabled"}`}
                                onClick={() => handlePredictAPI()}
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