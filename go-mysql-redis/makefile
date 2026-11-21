.DEFAULT_GOAL=help
help:
	@echo "Usage:"
	@echo "  make [target...]"
	@echo ""
	@echo "Useful commands:"
	@grep -Eh '^[a-zA-Z._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(cyan)%-30s$(term-reset) %s\n", $$1, $$2}'
	@echo ""

runLocal:  ## to run the app locally
	@go run main.go

compose: pruneVolume build ## to run the containers
	@echo "running containers"
	@docker-compose up -d

build: ## to build the project again after making changes
	@echo "building the project again"
	@docker-compose build --no-cache

pruneVolume: ## remove all dangling volumes
	@echo "removing all dangling volumes"
	@docker volume prune -f

down: ## docker-compose down
	@docker-compose down