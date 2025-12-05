library(plumber)
library(jsonlite)

predict_svm <- function(X, model) {
  approx <- as.matrix(X) %*% model$w + model$b
  labels <- ifelse(approx >= 0, 1, 0)
  return(labels)
}

predict_logistic_regression <- function(X, model) {
  X <- cbind(1, X)
  z <- as.matrix(X) %*% model$weights
  probs <- 1 / (1 + exp(-z))
  labels <- ifelse(probs >= 0.5, 1, 0)
  return(labels)
}

#* @filter cors
cors <- function(req,res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  # Handle OPTIONS preflight request
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())   # MUST return empty list for OK
  }
  
  plumber::forward()
}



#* Predict from the model
#* @post /predict
#* @param X:list The input feature matrix as a list of lists
#* @json
predict_endpoint <- function(X) {
  X_mat <- as.matrix(X)
  pc <- readRDS("pca_model.rds")
  
  X_test_scaled <- scale(X_mat, center = pc$center, scale = pc$scale)
  pc_test <- as.matrix(X_test_scaled) %*% pc$rotation[, 1:10]
  
  model <- readRDS("svm_model.rds")
  preds <- predict_svm(pc_test, model)
  list(predictions = preds)
}

