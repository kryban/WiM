using System;
using TechTalk.SpecFlow;
using WiM.Core;
using WiM.Core.Repositories;
using Moq;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using System.Collections.Generic;
using NUnit.Framework;
using WiM.Core.Enums;

namespace WiM.Specs
{
    [Binding]
    public class TaskSteps
    {
        private int workitemId = 0;
        private WorkItemWrapper workItemWrapper = null;
        private string testTitle = "testTitle";
        Mock<WorkitemRepository> workitemRepo;
        Mock<IWitApi> witApiMock;

        public TaskSteps()
        {
            witApiMock = new Mock<IWitApi>();
            workitemRepo = new Mock<WorkitemRepository>(witApiMock.Object);
        }

        [Given(@"i have entered a valid number as searchcriteria")]
        public void GivenIHaveEnteredAValidNumberAsSearchcriteria()
        {
            workitemId = 1;
        }

        [Given(@"that number equals with an id of a PBI")]
        public void GivenThatNumberEqualsWithAnIdOfAPBI()
        {
            witApiMock.Setup(x => x.GetWorkItemById(1)).Returns(GetFakeWorkItem());
        }
        
        [When(@"i press search")]
        public void WhenIPressSearch()
        {
            TfsController sut = new TfsController(workitemRepo.Object, Team.Committers);
            workItemWrapper = sut.GetById(1);
        }

        [Then(@"the PBI is selected as the current PBI")]
        public void ThenThePBIIsSelectedAsTheCurrentPBI()
        {
            var wiTitle = workItemWrapper.wi.Fields[WorkItemFields.Title].ToString();
            Assert.IsNotNull(workItemWrapper);
            Assert.AreEqual(wiTitle, testTitle);
        }

        [Given(@"that number does not equals with an id of a PBI")]
        public void GivenThatNumberDoesNotEqualsWithAnIdOfAPBI()
        {
            witApiMock.Setup(x => x.GetWorkItemById(1)).Throws(new Exception());        
        }

        [Then(@"the system returns a message that the PBI could not be found")]
        public void ThenTheSystemReturnsAMessageThatThePBICouldNotBeFound()
        {
            var wiTitle = workItemWrapper.wi.Fields[WorkItemFields.Title].ToString();
            Assert.IsNotNull(workItemWrapper);
            Assert.AreEqual(wiTitle, "Geen WorkItem gevonden met id 1");
        }

        private WorkItem GetFakeWorkItem()
        {
            var wi = new WorkItem();
            wi.Fields = new Dictionary<string, object>();
            wi.Fields.Add(WorkItemFields.Title, testTitle);
            wi.Fields.Add(WorkItemFields.WorkItemType, "testType");

            return wi;
        }
    }
}
