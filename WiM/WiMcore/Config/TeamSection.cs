using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core.Config
{
    class TeamSection : ConfigurationSection
    {
        [ConfigurationProperty("teams")]
        public TeamElementCollection Teams
        {
            get => (TeamElementCollection)base["teams"];
            set => base["teams"] = value;
        }
    }
}
