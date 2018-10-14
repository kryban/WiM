using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiMcore
{
    public class ChildItem: INotifyPropertyChanged
    {
        public string Key { get; set; }
        public string Title { get; set; }

        public event PropertyChangedEventHandler PropertyChanged;

        private void NotifyChange(string propName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
        }

        private bool isSelected = true;

        public bool IsSelected
        {
            get { return isSelected; }
            set
            {
                isSelected = value;
                NotifyChange("IsSelected");
            }
        }

        public string ActivityType { get; set; }
    }
}
