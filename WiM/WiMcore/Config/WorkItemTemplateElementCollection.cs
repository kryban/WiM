using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core.Config
{
    public class WorkItemTemplateElementCollection : ConfigurationElementCollection, IEnumerable<WorkItemTemplateElement>
    {
        private const string PropertyName = "workItemTemplate";

        public override ConfigurationElementCollectionType CollectionType =>
            ConfigurationElementCollectionType.BasicMapAlternate;

        protected override string ElementName => PropertyName;

        protected override ConfigurationElement CreateNewElement()
        {
            return new WorkItemTemplateElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((WorkItemTemplateElement) element).Switch;
        }

        public WorkItemTemplateElement this[int index] => (WorkItemTemplateElement) BaseGet(index);

        public new IEnumerator<WorkItemTemplateElement> GetEnumerator()
        {
            return Enumerable.Range(0, Count).Select(i => this[i]).GetEnumerator();
        }
    }

}
