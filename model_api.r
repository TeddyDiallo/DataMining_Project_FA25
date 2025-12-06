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

plot_decision_boundary_svm <- function(model, X, y) {
  w <- model$w
  b <- model$b
  
  cols <- ifelse(y_sample <= 0, 2, 4)   # 2=red, 4=blue
  cols <- adjustcolor(cols, alpha.f = 0.3)
  
  plot(X_sample[,1], X_sample[,2], col = cols,xlab="X_1",y_lab="X_2", pch = 19)
  
  if (abs(w[2]) < 1e-8) {
    abline(v = -b / w[1], col = "blue", lwd = 2)
    return()
  }
  
  x_vals <- seq(min(X[,1]), max(X[,1]), length.out = 600)
  y_vals <- -(b + w[1] * x_vals) / w[2]
  
  lines(x_vals, y_vals, col="blue", lwd=2)
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
  pc <- readRDS("../pca_model.rds")
  
  X_test_scaled <- scale(X_mat, center = pc$center, scale = pc$scale)
  pc_test <- as.matrix(X_test_scaled) %*% pc$rotation[, 1:2]
  
  model <- readRDS("../svm_model.rds")
  pred_svm <- predict_svm(pc_test, model)
  
  model <- readRDS("../logistic_model.rds")
  pred_logistic <- predict_logistic(pc_test, model)
  preds <- list(pred_svm,pred_logistic)
  
  list(predictions = preds, pc_testing = pc_test)
}

#* Draw a plot with the user data on it
#* @post /plot_svm
#* @param pc_test:list The first 2 principal components of user data
#* @param prediction:double The prediction output by the model
#* @png
plot_svm_endpoint <- function(pc_test,prediction) {
  
  pc <- as.numeric(pc_test)
  model <- readRDS("../svm_model.rds")
  X_sample <- readRDS("../x_sample.rds")
  y_sample <- readRDS("../y_sample.rds")
  
  w <- model$w
  b <- model$b
  
  cols <- ifelse(y_sample <= 0, 2, 4)   # 2=red, 4=blue
  cols <- adjustcolor(cols, alpha.f = 0.3)
  
  plot(X_sample[,1], X_sample[,2], col = cols,xlab="X_1", pch = 19)
  print(pc)
  print(pc[1])
  print(pc[2])
  points(pc[1], pc[2], col = "black", bg="yellow", pch=21, cex=2)
  
  if (abs(w[2]) < 1e-8) {
    abline(v = -b / w[1], col = "blue", lwd = 2)
    return()
  }
  
  x_vals <- seq(min(X_sample[,1]), max(X_sample[,1]), length.out = 600)
  y_vals <- -(b + w[1] * x_vals) / w[2]
  
  lines(x_vals, y_vals, col="blue", lwd=2)
  
}


#* Plot logistic regression boundary with new point
#* @post /plot_logistic
#* @param pc_test:list The first 2 principal components of user data
#* @param prediction:double The prediction output by the model
#* @png
plot_logistic_endpoint <- function(pc_test, prediction) {
  
  # Convert testing to numeric vector (PC1, PC2)
  new_point <- as.numeric(unlist(pc_test))
  
  model <- readRDS("../logistic_model.rds")
  X_sample <- readRDS("../x_sample.rds")
  y_sample <- readRDS("../y_sample.rds")
  
  # Colors with transparency
  cols <- ifelse(y_sample == 1, 4, 2)
  cols <- adjustcolor(cols, alpha.f = 0.3)
  
  # Extract weights
  b <- model$weights[1]
  w1 <- model$weights[2]
  w2 <- model$weights[3]
  
  # Plot sampled points
  plot(
    X_sample[,1], X_sample[,2],
    col = cols,
    pch = 19,
    xlab = "PC1", ylab = "PC2"
  )
  
  # Add new point
  points(
    new_point[1], new_point[2],
    pch = 21,
    cex = 2,
    col = "black",
    bg = ifelse(logistic_prediction == 1, "yellow", "white")
  )
  
  # Logistic boundary
  if (abs(w2) < 1e-8) {
    abline(v = -b / w1, col = "blue", lwd = 2)
  } else {
    x_vals <- seq(min(X_sample[,1]), max(X_sample[,1]), length.out = 500)
    y_vals <- -(b + w1 * x_vals) / w2
    lines(x_vals, y_vals, lwd = 2, col = "blue")
  }
}

