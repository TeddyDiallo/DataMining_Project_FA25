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
