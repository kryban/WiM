using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using WiMcore.Config;

namespace WiMcore
{
    public static class SettingsGetter
    {
        public static List<ChildItem> AllTasks { get { return GetSettingsCollection("TaskTitle");}}
        public static string TfsUrl { get { return ConfigurationManager.AppSettings["TfsUrl"]; } }
        public static string ApiGetWorkitem { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiGetWorkitem)]; } }
        public static string ApiCreateTask { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiCreateTask)]; } }
        public static string ApiWorkitemUrl { get { return TfsUrl + ConfigurationManager.AppSettings[nameof(ApiWorkitemUrl)]; } }

        private static List<ChildItem> GetSettingsCollection(string nameStart)
        {
            var temp = new List<ChildItem>();

            foreach (string key in ConfigurationManager.AppSettings.AllKeys)
                temp.Add(new ChildItem()
                                {   Key = key,
                                    Title = ConfigurationManager.AppSettings[key]
                                }
                );

            return temp.Where(c => c.Key.StartsWith(nameStart)).ToList();
        }

        public static List<ChildItem> GetChildItemsFromSection()
        {
            try
            {
                if (ConfigurationManager.GetSection("workItemTemplateSection") is WorkItemTemplateSection section)
                {
                    var xtremeTemplate = section.WorkItemTemplates.Single(t => t.Switch == "Xtreme");
                    return xtremeTemplate.TaskTemplateElements.Select(t =>
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
