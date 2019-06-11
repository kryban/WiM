using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core
{
    public static class WorkitemPaths
    {
        public static string AreaPath { get {return "/fields/System.AreaPath"; } }
        public static string TeamProject { get {return "/fields/System.TeamProject"; } }
        public static string IterationPath { get {return "/fields/System.IterationPath"; } }
        public static string WorkItemType { get {return "/fields/System.WorkItemType"; } }
        public static string State { get {return "/fields/System.State"; } }
        public static string Reason { get {return "/fields/System.Reason"; } }
        public static string CreatedDate { get {return "/fields/System.CreatedDate"; } }
        public static string CreatedBy { get {return "/fields/System.CreatedBy"; } }
        public static string ChangedDate { get {return "/fields/System.ChangedDate"; } }
        public static string ChangedBy { get {return "/fields/System.ChangedBy"; } }
        public static string Title { get {return "/fields/System.Title"; } }
        public static string BoardColumn { get {return "/fields/System.BoardColumn"; } }
        public static string BoardColumnDone { get {return "/fields/System.BoardColumnDone"; } }
        public static string BacklogPriority { get {return "/fields/Microsoft.VSTS.Common.BacklogPriority"; } }
        public static string Severity { get {return "/fields/Microsoft.VSTS.Common.Severity"; } }
        public static string KanBanColumn { get {return "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column"; } }
        public static string KanBanColumnDone { get {return "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done"; } }
        public static string TopDeskWijzigingNr { get {return "/fields/dSZW.Socrates.TopDeskWijzigingNr"; } }
        public static string SystemInfo { get {return "/fields/Microsoft.VSTS.TCM.SystemInfo"; } }
        public static string ReproSteps { get {return "/fields/Microsoft.VSTS.TCM.ReproSteps"; } }
        public static string TaskActivity { get { return "/fields/Microsoft.VSTS.Common.Activity"; } }
        public static string url { get {return "/fields/url"; } }
        public static string AllRelations { get { return "/relations/-"; } }
        public static string SpecficRelations { get { return "/relations/"; } }
    }
}
