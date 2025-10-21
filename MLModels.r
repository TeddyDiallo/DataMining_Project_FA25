#A function to fit the SVM to a given X(data matrix) and y(labels)
fit_svm <- function(X, y, learning_rate = 0.001, lambda = 0.01, n_iters = 1000) {
  #Change 0 labels to be labels of -1, others stay as 1
  #Necessary for SVM due to algorithm assuming labels of -1 and 1
  y_ <- ifelse(y <= 0, -1, 1)
  n_samples <- nrow(X)
  n_features <- ncol(X)
  
  #Initialize weights and bias
  w <- rep(0, n_features)
  b <- 0
  
  #Training loop
  for (iter in 1:n_iters) {
    for (i in 1:n_samples) {
      x_i <- as.numeric(X[i, ])
      #The constraint to formulate the margins
      condition <- y_[i] * (sum(x_i * w) + b) >= 1
      #If the point is outside the margin, only regularization term applies
      if (condition) {
        w <- w - learning_rate * (2 * lambda * w)
      } 
      #If the point is inside the margin or misclassified, the hinge loss plays
      #a role in the weight updates, plus the bias will get updated
      else {
        w <- w - learning_rate * (2 * lambda * w - y_[i] * x_i)
        b <- b - learning_rate * y_[i]
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
fit_logistic_regression <- function(X, y, learning_rate = 0.01, n_iters = 1000, lambda = 0) {
  
  n_samples <- nrow(X)
  n_features <- ncol(X)
  
  #Initialize weights
  weights <- rnorm(n_features)
  
  for (i in 1:n_iters) {
    #Linear combination
    z <- as.matrix(X) %*% weights
    
    #Probabilities generated using sigmoid function
    probs <- 1 / (1 + exp(-z))
    
    #Gradient calculation to update weights with L2 regularization
    gradient <- t(X) %*% (probs - y) + lambda * weights
    
    #Update weights using gradient descent
    weights <- weights - learning_rate * gradient
  }
  
  #Return the list of weights for the model
  return(list(weights = weights))
}

#A function to take in a model created by fit LR function and predict on some data
predict_logistic_regression <- function(X, model) {
  z <- as.matrix(X) %*% model$weights
  probs <- 1 / (1 + exp(-z))
  labels <- ifelse(probs >= 0.5, 1, 0)
  return(labels)
}
