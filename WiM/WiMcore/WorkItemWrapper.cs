using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiMcore
{
    public class WorkItemWrapper// : INotifyPropertyChanged
    {
        public WorkItem wi { get; private set; }

        public WorkItemWrapper(){}

        public WorkItemWrapper(WorkItem workItem)
        {
            wi = workItem;
            Title = wi.Fields[WorkItemFields.Title].ToString();
            WorkItemType = wi.Fields[WorkItemFields.WorkItemType].ToString();
            WorkItemProjectName = AddProjectName();
            WorkItemIterationPath = AddIterationPath();
            WorkItemAreaPath = AddAreaPath();
            workItemTaskActivity = AddTaskActivity();
            id = wi.Id.ToString();
        }

        private string AddTaskActivity()
        {
            try
            {
                return wi.Fields[WorkItemFields.TaskActivity].ToString();
            }
            catch (Exception)
            {

                return string.Empty;
            }
        }

        private string AddAreaPath()
        {
            try
            {
                return wi.Fields[WorkItemFields.AreaPath].ToString();
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        private string AddIterationPath()
        {
            try
            {
                return wi.Fields[WorkItemFields.IterationPath].ToString();
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        private string AddProjectName()
        {
            try
            {
                return wi.Fields[WorkItemFields.TeamProject].ToString();
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        //        public event PropertyChangedEventHandler PropertyChanged;

        private string id;
        public string Id
        {
            get
            {
                return id;
            }
            set
            {
                id = value;
                    //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Id"));
            }
        }

        private string title;
        public string Title
        {
            get
            {
                return title;
            }
            set
            {
                if (title != value)
                {
                    title = value;
                    //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Title"));
                }
            }
        }

        private string workItemType;
        public string WorkItemType
        {
            get
            {
                return workItemType;
            }
            set
            {
                workItemType = value;
                //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("TaskType"));
            }
        }

        private string workItemProjectName;
        public string WorkItemProjectName
        {
            get
            {
                return workItemProjectName;
            }
            set
            {
                workItemProjectName = value;
                //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("TaskType"));
            }
        }

        private string workItemIterationPath;
        public string WorkItemIterationPath
        {
            get
            {
                return workItemIterationPath;
            }
            set
            {
                workItemIterationPath = value;
                //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("TaskType"));
            }
        }

        private string workItemAreaPath;
        public string WorkItemAreaPath
        {
            get
            {
                return workItemAreaPath;
            }
            set
            {
                workItemAreaPath = value;
                //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("TaskType"));
            }
        }

        private string workItemTaskActivity;
        public string WorkItemTaskActivity
        {
            get
            {
                return workItemTaskActivity;
            }
            set
            {
                workItemTaskActivity = value;
                //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("TaskType"));
            }
        }
    }
}
