library(caTools)
library(caret)

data <- read.csv("../archive/diabetes_binary_5050split_health_indicators_BRFSS2015.csv",header=TRUE)

# factor variables
data$Diabetes_binary <- as.factor(data$Diabetes_binary)
data <- data[sample(nrow(data)),]
num_folds <- 10
fold_size <- floor(nrow(data)/num_folds)

fold_accuracies_knn <- numeric(num_folds)
fold_accuracies_svm <- numeric(num_folds)
fold_accuracies_log <- numeric(num_folds)

for (i in 1:num_folds){
  test_start <- (i - 1) * fold_size + 1
  test_end <- if (i == num_folds) nrow(data) else i * fold_size
  
  test <- data[test_start:test_end,]
  
  # Safely handle edge cases for training split
  if (test_start == 1) {
    train <- data[(test_end + 1):nrow(data), ]
  } else if (test_end == nrow(data)) {
    train <- data[1:(test_start - 1), ]
  } else {
    train <- rbind(data[1:(test_start - 1), ], data[(test_end + 1):nrow(data), ])
  }
  
  
  # Separate features and labels
  X_train <- train[, -1]
  y_train <- train[, 1]
  X_test  <- test[, -1]
  y_test  <- test[, 1]
  
  # PCA on training fold
  num_components <- 3
  pc <- prcomp(X_train, center = TRUE, scale = TRUE)  # already scaled
  trainTransformed <- as.data.frame(pc$x[, 1:num_components])
  trainTransformed$Label <- y_train  # Add label column for caret
  
  # Project test fold using training PCA rotation
  X_test_scaled <- scale(X_test, center = pc$center, scale = pc$scale)
  testTransformed <- as.data.frame(as.matrix(X_test_scaled) %*% pc$rotation[, 1:num_components])
  testTransformed$Label <- y_test
  
  print("Training KNN")
  # KNN, best accuracy: 0.7350, k = 35
  knnModel <- train(
    Label ~ ., 
    data = trainTransformed, 
    method = "knn",
    tuneGrid = data.frame(k = 25)
  )
  print("Finished Training KNN")
  knn_preds <- predict(knnModel, newdata = testTransformed)
  fold_accuracies_knn[i] <- mean(knn_preds == testTransformed$Label)
  
  print("Training SVM")
  # svm Linear boundary, best accuracy: 0.74069, C = 0.3
  # fyi: the svm training takes about 10 min to run
  svmModel <- train(
    Label ~ ., 
    data = trainTransformed, 
    method = "svmLinear",
    tuneGrid = data.frame(C = 0.3),
    trControl = trainControl(method = "none")
  )
  print("Finished Training SVM")
  svm_preds <- predict(svmModel, newdata = testTransformed)
  fold_accuracies_svm[i] <- mean(svm_preds == testTransformed$Label)
  
  print("Training Logistic Regression")
  # logistic regression, best accuracy 0.74145
  logModel <- train(
    Label ~ ., 
    data = trainTransformed, 
    method = "glm",
    family = "binomial")
  print("Finished Training Logistic Regression")
  log_preds <- predict(logModel, newdata = testTransformed)
  fold_accuracies_log[i] <- mean(log_preds == testTransformed$Label)
  
}

# After your cross-validation loop

# Mean and standard deviation
cat("KNN:  Mean =", mean(fold_accuracies_knn), " SD =", sd(fold_accuracies_knn), "\n")
cat("SVM:  Mean =", mean(fold_accuracies_svm), " SD =", sd(fold_accuracies_svm), "\n")
cat("Log:  Mean =", mean(fold_accuracies_log), " SD =", sd(fold_accuracies_log), "\n")

# Paired t-tests
# KNN vs SVM
t_knn_svm <- t.test(fold_accuracies_knn, fold_accuracies_svm, paired = TRUE)
cat("\nPaired t-test KNN vs SVM:\n")
print(t_knn_svm)

# KNN vs Logistic
t_knn_log <- t.test(fold_accuracies_knn, fold_accuracies_log, paired = TRUE)
cat("\nPaired t-test KNN vs Logistic:\n")
print(t_knn_log)

# SVM vs Logistic
t_svm_log <- t.test(fold_accuracies_svm, fold_accuracies_log, paired = TRUE)
cat("\nPaired t-test SVM vs Logistic:\n")
print(t_svm_log)
