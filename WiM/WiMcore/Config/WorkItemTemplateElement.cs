using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core.Config
{
    public class WorkItemTemplateElement : ConfigurationElement
    {
        [ConfigurationProperty("switch", IsRequired = true, IsKey = true)]
        public string Switch => (string) base["switch"];

        [ConfigurationProperty("tasks")]
        public TaskTemplateElementCollection TaskTemplateElements => (TaskTemplateElementCollection) base["tasks"];
    }
}
