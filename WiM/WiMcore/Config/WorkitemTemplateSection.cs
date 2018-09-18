using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiMcore.Config
{
    public class WorkItemTemplateSection : ConfigurationSection
    {
        [ConfigurationProperty("workItemTemplates")]
        public WorkItemTemplateElementCollection WorkItemTemplates
        {
            get => (WorkItemTemplateElementCollection) base["workItemTemplates"];
            set => base["workItemTemplates"] = value;
        }
    }
}
