using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;

namespace WiM.Core.Repositories
{
    public interface IWorkitemRepository
    {
        WorkItem GetWorkitemById(int id);
    }
}
