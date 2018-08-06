using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiMcore.Config
{
    public class TaskElement : ConfigurationElement
    {
        [ConfigurationProperty("title", IsRequired = true, IsKey = true)]
        public string Title => (string) base["title"];

        [ConfigurationProperty("activityType", IsRequired = false)]
        public string ActivityType => (string) base["activityType"];
    }
}
