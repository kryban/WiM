using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiMcore.Config
{
    public class TaskTemplateElementCollection : ConfigurationElementCollection, IEnumerable<TaskElement>
    {
        private const string PropertyName = "task";

        public override ConfigurationElementCollectionType CollectionType =>
            ConfigurationElementCollectionType.BasicMapAlternate;

        protected override string ElementName => PropertyName;

        protected override ConfigurationElement CreateNewElement()
        {
            return new TaskElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((TaskElement)element).Title;
        }

        public TaskElement this[int index] => (TaskElement)BaseGet(index);

        public new IEnumerator<TaskElement> GetEnumerator()
        {
            return Enumerable.Range(0, Count).Select(i => this[i]).GetEnumerator();
        }
    }
}
