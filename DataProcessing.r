library(psych)
library(caret)

#A function to fit the SVM to a given X(data matrix) and y(labels)
fit_svm <- function(X, y, learning_rate = 0.01, lambda = 0.001, n_iters = 1000) {
  #Change 0 labels to be labels of -1, others stay as 1
  #Necessary for SVM due to algorithm assuming labels of -1 and 1
  y_ <- ifelse(y <= 0, -1, 1)
  n_samples <- nrow(X)
  n_features <- ncol(X)
  
  #Initialize weights and bias
  w <- rep(0,n_features)
  b <- 0
  
  #Training loop
  for (iter in 1:n_iters) {
    for (i in 1:n_samples) {
      x_i <- X[i, ]
      #Formulate the margins
      margin <- y_[i] * (sum(x_i * w) + b)
      
      #If the point is outside the margin, only regularization term applies
      if (margin >= 1) {
        w <- w - learning_rate * lambda * w
        #If the point is inside the margin or misclassified, the hinge loss plays 
        #a role in the weight updates, plus the bias will get updated
      } else {
        w <- w + learning_rate * (y_[i] * x_i - lambda * w)
        b <- b + learning_rate * y_[i]
      }
    }
  }
  #Returns the weights and biases of the hyperplane
  hyperplane <- list(w = w, b = b)
  return(hyperplane)
}

#A function to take in a model created by fit SVM function and predict on some data
predict_svm <- function(X, model) {
  approx <- as.matrix(X) %*% model$w + model$b
  #Return the predicted labels of the data
  labels <- ifelse(approx >= 0, 1, 0)
  return(labels)
}


#A function to fit the logistic regression model to a given X(data matrix) and y(labels)
fit_logistic_regression <- function(X, y, learning_rate = 0.001, lambda = 0.01, n_iters = 1000) {
  n_samples <- nrow(X)
  
  #Add a bias term
  X <- cbind(1, X)
  n_features <- ncol(X)
  
  #Initialize weights
  weights <- rep(0, n_features)
  
  for (i in 1:n_iters) {
    #Linear combination
    z <- as.matrix(X) %*% weights
    #Clip values to avoid overflow errors
    z <- pmin(pmax(z, -500), 500)
    
    #Probabilities generated using sigmoid function
    probs <- 1 / (1 + exp(-z))
    
    #Gradient calculation to update weights with L2 regularization
    gradient <- (t(X) %*% (probs - y)) / n_samples + lambda * weights
    #Update weights using gradient descent
    weights <- weights - learning_rate * gradient
  }
  
  #Return the list of weights for the model
  return(list(weights = weights))
}


#A function to take in a model created by fit LR function and predict on some data
predict_logistic_regression <- function(X, model) {
  X <- cbind(1, X)
  z <- as.matrix(X) %*% model$weights
  probs <- 1 / (1 + exp(-z))
  labels <- ifelse(probs >= 0.5, 1, 0)
  return(labels)
}

#Read in data
diabetes_data <- read.csv("./diabetes_binary_5050split_health_indicators_BRFSS2015.csv",header=TRUE)
set.seed(25)

#Shuffle rows
diabetes_data <- diabetes_data[sample(nrow(diabetes_data)),]

X_train <- diabetes_data[1:60000, 2:22]
X_test  <- diabetes_data[60001:nrow(diabetes_data), 2:22]
y_train <- diabetes_data[1:60000, 1]
y_test  <- diabetes_data[60001:nrow(diabetes_data), 1]

# PCA on training data
pc <- prcomp(X_train, center = TRUE, scale = TRUE)
saveRDS(pc, file = "pca_model.rds")

num_components <- 2

# Project training data
pc_train <- as.matrix(pc$x[, 1:num_components])

# Scale and project test data using training PCA parameters
X_test_scaled <- scale(X_test, center = pc$center, scale = pc$scale)
pc_test <- as.matrix(X_test_scaled) %*% pc$rotation[, 1:num_components]

idx <- sample(nrow(pc_test), 1500)
X_sample <- pc_test[idx, ]
y_sample <- y_test[idx]
saveRDS(X_sample, "x_sample.rds")
saveRDS(y_sample, "y_sample.rds")

#Run the model
print("Starting logistic training")
model <- fit_logistic_regression(pc_train,y_train,learning_rate = 0.001,lambda = 0.01,n_iters = 1000)
saveRDS(model, file = "logistic_model.rds")
print("Logistic training finished and saved as logistic_model.rds")
predictions_logistic <- predict_logistic_regression(pc_test,model)
accuracy <- mean(predictions_logistic == y_test)
#Print out accuracy
print(accuracy)

#Run the model
print("Starting SVM training")
model <- fit_svm(pc_train,y_train,learning_rate = 0.01,lambda = 0.001,n_iters = 1000)
saveRDS(model, file = "svm_model.rds")
print("SVM training finished and saved as svm_model.rds")
predictions_svm <- predict_svm(pc_test,model)
accuracy <- mean(predictions_svm == y_test)
#Print out accuracy
print(accuracy)
