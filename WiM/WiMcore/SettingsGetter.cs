using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using WiMcore.Config;

namespace WiMcore
{
    public static class SettingsGetter
    {
        public static string TfsUrl { get { return ConfigurationManager.AppSettings["TfsUrl"]; } }
        public static string ApiGetWorkitem { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiGetWorkitem)]; } }
        public static string ApiCreateTask { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiCreateTask)]; } }
        public static string ApiWorkitemUrl { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiWorkitemUrl)]; } }

        public static CustomObservableCollection<ChildItem> GetChildItemsFromSection(string switchSelector)
        {
            try
            {
                if (ConfigurationManager.GetSection("workItemTemplateSection") is WorkItemTemplateSection section)
                {
                    var template = section.WorkItemTemplates.Single(t => t.Switch == switchSelector);

                    var foo = template.TaskTemplateElements.Select(t =>
                        new ChildItem {Key = t.Title, Title = t.Title, ActivityType = t.ActivityType}).ToList();

                    var retval = new CustomObservableCollection<ChildItem>();

                    foreach (var item in foo)
                    {
                        retval.Add(item);
                    }

                    return retval;
                }
            }
            catch
            {
                return new CustomObservableCollection<ChildItem>();
            }

            return new CustomObservableCollection<ChildItem>();
        }
    }
}
