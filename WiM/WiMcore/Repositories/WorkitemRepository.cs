using System;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using System.Collections.Generic;

namespace WiM.Core.Repositories
{
    public class WorkitemRepository : IWorkitemRepository
    {
        public IWitApi witApi;

        public WorkitemRepository()
        {
            witApi = new WitApi();
        }

        public WorkitemRepository(IWitApi witApi)
        {
            this.witApi = witApi;
        }

        public WorkItem GetWorkitemById(int id)
        {
            WorkItem wi;

            try
            {
                wi = witApi.GetWorkItemById(id);
            }
            catch (Exception e)
            {
                wi = new WorkItem();
                wi.Fields = new Dictionary<string, object>();
                wi.Fields.Add(WorkItemFields.Title, $"Geen WorkItem gevonden met id {id}");// "Geen PBI gevonden met Id "+id+"!");
                wi.Fields.Add(WorkItemFields.WorkItemType, "onbekend type");
            }

            return wi;
        }
    }
}
