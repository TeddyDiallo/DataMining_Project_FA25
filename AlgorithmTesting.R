library(caTools)
library(caret)

data <- read.csv("./archive/diabetes_binary_5050split_health_indicators_BRFSS2015.csv",header=TRUE)

# factor variables
data$Diabetes_binary <- as.factor(data$Diabetes_binary)

# get training indices
trainIndex <- createDataPartition(data$Diabetes_binary, 
                                  times=1, 
                                  p = .8, 
                                  list = FALSE)

# split pca data between training and testing
train <- pc_data[trainIndex, ]
test <- pc_data[-trainIndex, ]

# scale and center data
preProcValues <- preProcess(train, method = c("center", "scale"))
trainTransformed <- predict(preProcValues, train)
testTransformed <- predict(preProcValues, test)

# make sure Label is a factor
testTransformed$Label <- as.factor(testTransformed$Label)
trainTransformed$Label <- as.factor(trainTransformed$Label)

# KNN, best accuracy: 0.7350, k = 35
knnModel <- train(
  Label ~ ., 
  data = trainTransformed, 
  method = "knn", 
  trControl = trainControl(method = "cv"), 
  tuneGrid = data.frame(k = c(34, 35, 36, 37, 38))
)

plot(knnModel)

# svm Linear boundary, best accuracy: 0.74069, C = 0.3
# fyi: the svm training takes about 10 min to run
svmModel <- train(
  Label ~ ., 
  data = trainTransformed, 
  method = "svmLinear", 
  trControl = trainControl(method = "cv", number = 3), 
  tuneGrid = expand.grid(C = seq(0.2, 0.5, length = 10))
)

plot(svmModel)

# logistic regression, best accuracy 0.74145
logModel <- train(
  Label ~ ., 
  data = trainTransformed, 
  method = "glm",
  family = "binomial",
  trControl = trainControl(method = "cv"))

print(logModel)
