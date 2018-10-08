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
        private string key;
        public string Key
        {
            get => key;
            set
            {
                key = value;
                //NotifyOfChange("Key");
            }
        }

        private string title;
        public string Title
        {
            get => title;
            set
            {
                title = value;
                //NotifyOfChange("Title");
            }
        }

        private bool isSelected;
        public bool IsSelected
        {
            get => isSelected;
            set
            {
                isSelected = value;
                //NotifyOfChange("IsSelected");
            }
        }

        private string activityType;
        public string ActivityType
        {
            get => activityType;
            set
            {
                activityType = value;
                //NotifyOfChange("ActivityType");
            }
        }


    private bool isEnabled;
        public bool IsEnabled
        {
            get => isEnabled;
            set
            {
                isEnabled = value;
                //NotifyOfChange("IsEnabled");
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        //private void NotifyOfChange(string propertyName)
        //{
        //    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        //}
    }
}
