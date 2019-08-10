# This grabs the function app name (assuming you set up a remote called "production" correctly)
FUNCTION_APP_NAME?=$(shell git remote get-url production | awk -F[/:] '{print $$4}' | cut -f 1 -d.)
# This assumes the function app lives in a resource group with the same name
RESOURCE_GROUP?=${FUNCTION_APP_NAME}
# Sanity setting for when I run this from a machine with zsh
SHELL=bash

# Safe default
debug:
	@echo $(FUNCTION_APP_NAME)

# Sync the sample content to the incoming blob container
sync:
	# Grab the storage connection string and set the environment so we don't have to keep auth keys around
	@$(eval export AZURE_STORAGE_CONNECTION_STRING := $(shell az webapp config appsettings list \
													--name $(FUNCTION_APP_NAME) \
													--resource-group $(RESOURCE_GROUP) \
											  		| jq -r '.[] | select (.name == "AzureWebJobsStorage").value'))
	# Sync requires azcopy to be installed
	az storage blob sync --source sampleContent --container raw-markup

git-rewind-%:
	git reset --soft HEAD~$* && git commit