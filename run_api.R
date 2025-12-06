library(plumber)

pr("model_api.r")$run(host = "0.0.0.0", port = 9559)
