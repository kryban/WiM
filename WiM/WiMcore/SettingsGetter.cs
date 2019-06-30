using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using WiM.Core.Config;

namespace WiM.Core
{
    public static class SettingsGetter
    {
        public static string TfsUrl { get { return ConfigurationManager.AppSettings["TfsUrl"]; } }
        public static string ApiGetWorkitem { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiGetWorkitem)]; } }
        public static string ApiCreateTask { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiCreateTask)]; } }
        public static string ApiWorkitemUrl { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiWorkitemUrl)]; } }

        public static List<ChildItem> GetChildItemsFromSection(string team)
        {
            try
            {
                if (ConfigurationManager.GetSection("workItemTemplateSection") is WorkItemTemplateSection section)
                {
                    var template = section.WorkItemTemplates.Single(t => t.Switch == team);

                    return template.TaskTemplateElements.Select(t =>
                        new ChildItem {Key = t.Title, Title = t.Title, ActivityType = t.ActivityType}).ToList();
                }
            }
            catch
            {
                return new List<ChildItem>();
            }

            return new List<ChildItem>();
        }
    }
}
