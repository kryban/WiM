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

        private bool isSelected = true;
        public bool IsSelected
        {
            get { return isSelected; }
            set { isSelected = value; }
        }
    }
}
