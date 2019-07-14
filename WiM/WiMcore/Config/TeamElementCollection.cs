using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core.Config
{
    public class TeamElementCollection : ConfigurationElementCollection, IEnumerable<TeamElement>
    {
        private const string PropertyName = "team";

        public override ConfigurationElementCollectionType CollectionType =>
            ConfigurationElementCollectionType.BasicMapAlternate;

        protected override string ElementName => PropertyName;

        protected override ConfigurationElement CreateNewElement()
        {
            return new TeamElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((TeamElement)element).Name;
        }

        public TeamElement this[int index] => (TeamElement)BaseGet(index);

        public new IEnumerator<TeamElement> GetEnumerator()
        {
            return Enumerable.Range(0, Count).Select(i => this[i]).GetEnumerator();
        }

    }
}
