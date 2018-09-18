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
        public static string TaskTitle1 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle1)]; } }
        public static string TaskTitle2 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle2)]; } }
        public static string TaskTitle3 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle3)]; } }
        public static string TaskTitle4 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle4)]; } }
        public static string TaskTitle5 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle5)]; } }
        public static string TaskTitle6 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle6)]; } }
        public static string TaskTitle7 { get { return ConfigurationManager.AppSettings[nameof(TaskTitle7)]; } }
        public static string TaskActivity1 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity1)]; } }
        public static string TaskActivity2 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity2)]; } }
        public static string TaskActivity3 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity3)]; } }
        public static string TaskActivity4 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity4)]; } }
        public static string TaskActivity5 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity5)]; } }
        public static string TaskActivity6 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity6)]; } }
        public static string TaskActivity7 { get { return ConfigurationManager.AppSettings[nameof(TaskActivity7)]; } }

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
