#Feature: Taken
#	In order to avoid silly mistakes
#	As a math idiot
#	I want to be told the sum of two numbers

#@mytag
#Scenario: Add two numbers
#	Given I have entered 50 into the calculator
#	And I have entered 70 into the calculator
#	When I press add
#	Then the result should be 120 on the screen

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

