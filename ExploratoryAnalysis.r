library(GGally)
library(psych)
library(caret)
data <- read.csv("../archive/diabetes_binary_5050split_health_indicators_BRFSS2015.csv",header=TRUE)

correlations <- cor(data)

#Largest correlation is between general health and physical health
indices <- which(correlations >= 0.5, arr.ind=T)

indices2 <- which(correlations <= -0.5, arr.ind=T)

data$Diabetes_binary <- as.factor(data$Diabetes_binary)
set.seed(122)
train_control <- trainControl(method = "cv", number = 10)

#nonbinaryattrs <- c(5,15,16,17,20,21,22)
#data[nonbinaryattrs] <- as.data.frame(scale(data[nonbinaryattrs],center=TRUE,scale=TRUE))

pc <- prcomp(data[2:22],
             center = TRUE,
             scale = TRUE)

std_dev <- pc$sdev

# Variance explained by each component
pr_var <- std_dev^2

# Proportion of variance explained
prop_var <- pr_var / sum(pr_var)

# Print proportions
print(prop_var)

pc_data <- data.frame(pc$x[,1:10], Label = data$Diabetes_binary)

print(model_lr)
attributes <- c(1,5,20,15,16,17)
#Random seed for replicating results
sampled_rows <- data[sample(nrow(data), 1000, replace = TRUE), attributes]
#Plot the pairs of attributes
pairs(sampled_rows,
      labels = attributes,
      main = paste("Scatterplot matrix sample"),
      col = sampled_rows$Diabetes_binary)
p <- ggparcoord(sampled_rows,
           scale="uniminmax",
          columns = 2:6, 
           groupColumn = 1,
           alphaLines = 0.3
)
p_ <- GGally::print_if_interactive
p_(p)