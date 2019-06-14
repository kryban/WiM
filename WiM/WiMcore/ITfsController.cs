namespace WiM.Core
{
    public interface ITfsController
    {
        WorkItemWrapper CreateTaskAndLinkToWorkItem(WorkItemWrapper workitemToCreate, int linkedWorkitemId, string linkedWorkItemProjectName);
        WorkItemWrapper GetById(object id);
    }
}