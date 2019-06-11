using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core
{
    public class WorkitemHelper
    {
        public bool AllowToAddToPbi(string wrapperWorkItemType, WorkItemWrapper workItemWrapper)
        {
            return workItemWrapper != null &&
                wrapperWorkItemType != null && 
                (wrapperWorkItemType == "Product Backlog Item" || wrapperWorkItemType == "Bug");
        }
    }
}
