Feature: Task
In order to link taks to the correct PBI
As a Azure DevOps user
I want to be able to search for a specific PBI

@mytag
Scenario: Find PBI with number
	Given i have entered a valid number as searchcriteria
	And that number equals with an id of a PBI
	When i press search
	Then the PBI is selected as the current PBI

@mytag
Scenario: Return error message when PBI cannot be found
	Given i have entered a valid number as searchcriteria
	And that number does not equals with an id of a PBI
	When i press search
	Then the system returns a message that the PBI could not be found
