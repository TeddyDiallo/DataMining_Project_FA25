library(plumber)

pr <- pr("model_api.r")

#Makes it so the Swagger UI docs don't automatically pop up
#This can be disabled to see the 3 endpoints and test if needed
pr$setDocs(FALSE)

pr$run(host = "0.0.0.0", port = 8000)
