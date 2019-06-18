using System;
using System.Collections.Generic;
using WiM.Core.Enums;
using WiM.Core.Repositories;

namespace WiM.Core
{
    public class TfsController : ITfsController
    {
        private IWorkitemRepository workitemRepo;
        private Team team;

        public TfsController(IWorkitemRepository workitemRepository, Team team)
        {
            workitemRepo = workitemRepository;
            this.team = team;
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

        public int VoegGeselecteerdeTakenToe(WorkItemWrapper workItemWrapper, IEnumerable<ChildItem> geselecteerdeTaken)
        {
            int aantalTakenToegevoegd = 0; 

            foreach (var item in geselecteerdeTaken)
            {
                WorkItemWrapper newTask = new WorkItemWrapper();

                newTask.Title = item.Title;
                newTask.WorkItemIterationPath = workItemWrapper.WorkItemIterationPath;
                newTask.WorkItemAreaPath = workItemWrapper.WorkItemAreaPath;
                newTask.WorkItemType = "Task";

                if (team == Team.Xtreme)
                {
                    newTask.WorkItemTaskActivity = item.ActivityType;
                }

                WorkItemWrapper result = CreateTaskAndLinkToWorkItem(newTask, Convert.ToInt32(workItemWrapper.Id), workItemWrapper.WorkItemProjectName);

                if (result != null)
                    aantalTakenToegevoegd++;
            }

            return aantalTakenToegevoegd;
        }
    }
}
