using System;
using TechTalk.SpecFlow;
using WiM.Core;
using mock

namespace WiM.Specs
{
    [Binding]
    public class TaskSteps
    {
        private TfsController sut = new TfsController();
        private int workitemId = 0;

        [Given(@"i have entered a valid number as searchcriteria")]
        public void GivenIHaveEnteredAValidNumberAsSearchcriteria()
        {
            workitemId = 1;
        }

        [Given(@"that number equals with an id of a PBI")]
        public void GivenThatNumberEqualsWithAnIdOfAPBI()
        {
            ScenarioContext.Current.Pending();
        }
        
        [When(@"i press search")]
        public void WhenIPressSearch()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"the PBI is selected as the current PBI")]
        public void ThenThePBIIsSelectedAsTheCurrentPBI()
        {
            ScenarioContext.Current.Pending();
        }
    }
}
