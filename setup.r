packages <- c(
  "plumber",
  "jsonlite",
  "ggplot2",
  "dplyr"
)

install_if_missing <- function(pkg) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    install.packages(pkg)
  }
}

invisible(lapply(packages, install_if_missing))