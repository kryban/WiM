using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core
{
    public static class WorkItemFields
    {
        public static string AreaPath { get { return "System.AreaPath"; } }
        public static string TeamProject { get { return "System.TeamProject"; } }
        public static string IterationPath { get { return "System.IterationPath"; } }
        public static string WorkItemType { get { return "System.WorkItemType"; } }
        public static string State { get { return "System.State"; } }
        public static string Reason { get { return "System.Reason"; } }
        public static string CreatedDate { get { return "System.CreatedDate"; } }
        public static string CreatedBy { get { return "System.CreatedBy"; } }
        public static string ChangedDate { get { return "System.ChangedDate"; } }
        public static string ChangedBy { get { return "System.ChangedBy"; } }
        public static string Title { get { return "System.Title"; } }
        public static string BoardColumn { get { return "System.BoardColumn"; } }
        public static string BoardColumnDone { get { return "System.BoardColumnDone"; } }
        public static string BacklogPriority { get { return "Microsoft.VSTS.Common.BacklogPriority"; } }
        public static string Severity { get { return "Microsoft.VSTS.Common.Severity"; } }
        public static string KanBanColumn { get { return "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column"; } }
        public static string KanBanColumnDone { get { return "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done"; } }
        public static string TopDeskWijzigingNr { get { return "dSZW.Socrates.TopDeskWijzigingNr"; } }
        public static string SystemInfo { get { return "Microsoft.VSTS.TCM.SystemInfo"; } }
        public static string ReproSteps { get { return "Microsoft.VSTS.TCM.ReproSteps"; } }
        public static string TaskActivity { get { return "Microsoft.VSTS.Common.Activity"; } }
        public static string url { get { return "url"; } }
        public static string AllRelations { get { return "/relations/-"; } }
        public static string SpecficRelations { get { return "/relations/"; } }

    }
}
