install.packages("caret", dependencies = TRUE)
install.packages("psych")
library(psych)
library(caret)

#Read in data
data <- read.csv("../archive/diabetes_binary_5050split_health_indicators_BRFSS2015.csv",header=TRUE)
set.seed(25)

#Turn binary diabetes label into a factor for classification - otherwise the 
#function will try to do regression
data$Diabetes_binary <- as.factor(data$Diabetes_binary)

#Set num folds for cross validation and num components for PCA
num_folds <- 10
num_components <- 10

train_control <- trainControl(method = "cv", number = num_folds)

pc <- prcomp(data[2:22],
             center = TRUE,
             scale = TRUE)

pc_data <- data.frame(pc$x[,1:num_components], Label = data$Diabetes_binary)

#Train model using logistic regression and binary classification
model_lr <- train(
  Label ~ ., 
  data = pc_data,
  method = "glm", 
  family = "binomial",
  trControl = train_control
)

#Print results
print(model_lr)