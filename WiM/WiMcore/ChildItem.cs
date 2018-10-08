using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiMcore
{
    public class ChildItem
    {
        public string Key { get; set; }
        public string Title { get; set; }

        public bool IsSelected { get; set; }// = true;

        public string ActivityType { get; set; }

        public bool IsEnabled { get; set; }
    }
}
