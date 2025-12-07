# No Sugarcoating - Project by Emma Stubby, Teddy Diallo, and Aidan Foreman
 
This project was completed for the Data Mining class at the University of Oklahoma in Fall 2025. The project required using any dataset to answer a data mining question using algorithms and methods learned in class. Our project uses the "CDC Diabetes Health Indicators" dataset found at https://www.kaggle.com/datasets/alexteboul/diabetes-health-indicators-dataset. Our project implements two chosen machine learning models for predicting diabetes risk, along with visualization of model decision boundaries.

We used various methods to preprocess the dataset - we created a correlation matrix to test if features needed to be removed, we plotted features on parallel coordinates to see if any trends could be discovered, and we used principal component analysis(PCA) to reduce the number of dimensions down to 2 for plotting purposes. We then created the logistic regression and support vector machine models from scratch in R to do classification prediction of data points as either 0(healthy) or 1(prediabetic or diabetic). Our models achieved around 73% accuracy on this task, which may be due to using linear models to attempt to fit the data. Accuracy could likely be improved using 1) kernalized SVM, 2) soft-margin SVM, or 3) some other nonlinear classificaton algorithm.

---

## Setup

Follow these steps to get the project environment ready:

1. **Clone this repository**
Clone this repository using
```bash
git clone https://github.com/TeddyDiallo/DataMining_Project_FA25.git
```
2. **Download the diabetes dataset**  
Go to https://www.kaggle.com/datasets/alexteboul/diabetes-health-indicators-dataset and download the dataset as a zip file.  
3. **Extract the diabetes dataset**  
Extract the zip file and then take the archive/diabetes_binary_5050split_health_indicators_BRFSS2015.csv file and place it in the DataMining_Project_FA25 directory of the cloned repository.  
4. **Set up the R environment**  
Run the setup.r file  
5. **Create the machine learning models**  
Run the DataProcessing.r file  
6. **Run the API server locally**  
Run the run_api.r file to start up the R API server on port 8000.  
7. **Run the website server**  
Navigate to the data-mining-project folder  
Run 
```bash
npm i
npm start
```
## Using the application

Use the application by going to http://localhost:3000/ in your web browser.

## Application Screenshots
<img width="1302" height="655" alt="TitlePage" src="https://github.com/TeddyDiallo/DataMining_Project_FA25/blob/AidanUI/ProjectImages/TitlePage.png" />  
<img width="1302" height="655" alt="TitlePage" src="https://github.com/TeddyDiallo/DataMining_Project_FA25/blob/AidanUI/ProjectImages/DataCollectionPage.png" />  
<img width="1302" height="655" alt="TitlePage" src="https://github.com/TeddyDiallo/DataMining_Project_FA25/blob/AidanUI/ProjectImages/ResultsPage.png" />  
<img width="1302" height="655" alt="TitlePage" src="https://github.com/TeddyDiallo/DataMining_Project_FA25/blob/AidanUI/ProjectImages/Visualizations.png" />  
