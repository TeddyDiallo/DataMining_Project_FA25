// LandingPage.jsx
import React from "react";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="lp-root">
            <div className="lp-card">
                <div className="lp-gradient-bar" />
                <div className="lp-content">
                    <h1 className="lp-title">Welcome To No Sugarcoating!</h1>
                    <button className="lp-button"
                        onClick={() => navigate("/datacollection")}>
                        Click Here to Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;