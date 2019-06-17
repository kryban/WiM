using System;
using WiM.Core.Repositories;

namespace WiM.Core
{
    public class TfsController : ITfsController
    {
        private IWorkitemRepository workitemRepo;

        public TfsController(IWorkitemRepository workitemRepository)
        {
            workitemRepo = workitemRepository;
        }

        public WorkItemWrapper CreateTaskAndLinkToWorkItem(WorkItemWrapper workitemToCreate, int linkedWorkitemId, string linkedWorkItemProjectName)
        {
            return new WorkItemWrapper(
                workitemRepo.CreateTaskAndLinkToWorkItem(workitemToCreate, linkedWorkitemId, linkedWorkItemProjectName)
            );
        }

        public WorkItemWrapper GetById(object id)
        {
            return new WorkItemWrapper(
                workitemRepo.GetWorkitemById(Convert.ToInt32(id))
                );
        }
    }
}
