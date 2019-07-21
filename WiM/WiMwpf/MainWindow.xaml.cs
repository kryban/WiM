using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using WiM.Core;
using WiM.Core.Repositories;
using WiM.Core.Enums;

namespace WiM.Wpf
{
    public partial class MainWindow : Window, INotifyPropertyChanged
    {
        private TfsController tfsController;
        private WorkItemWrapper workItemWrapper;
        private string searchTextBoxDefaultText = "pbi Id";
        public Team scrumteam;
        private WorkitemHelper workitemHelper;

        public MainWindow()
        {
            Teams = SettingsGetter.GetTeamNamesFromSection();

            // todo: geen enums straks
            scrumteam = Team.Xtreme;

            tfsController = new TfsController(new WorkitemRepository(new WitApi()), scrumteam);
            ConfiguredTasksOrActivities = SettingsGetter.GetChildItemsFromSection(scrumteam.ToString());
            
            DataContext = this;
            workitemHelper = new WorkitemHelper(); //todo: refactor

            EnableAllTaskCheckBoxes();

            InitializeComponent();
        }

        public event PropertyChangedEventHandler PropertyChanged;

        private void NotifyOfChange(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }

        private List<string> teams { get; set; }
        public List<string> Teams
        {
            get { return teams; }
            set
            {
                teams = value;
                NotifyOfChange("Teams");
            }
        }

        private List<ChildItem> configuredTasksOrActivities;
        public List<ChildItem> ConfiguredTasksOrActivities
        {
            get { return configuredTasksOrActivities; }
            set
            {
                configuredTasksOrActivities = value;
                NotifyOfChange("ConfiguredTasksOrActivities");
            }
        }

        private string wrapperTitle;
        public string WrapperTitle
        {
            get { return wrapperTitle; }
            set
            {
                wrapperTitle = value;
                NotifyOfChange("WrapperTitle");
            }
        }

        private string wrapperWorkItemType;
        public string WrapperWorkItemType
        {
            get { return wrapperWorkItemType; }
            set
            {
                wrapperWorkItemType = value;
                NotifyOfChange("WrapperWorkItemType");
            }
        }

        private string wrapperWorkItemProjectName;
        public string WrapperWorkItemProjectName
        {
            get { return wrapperWorkItemProjectName; }
            set
            {
                wrapperWorkItemProjectName = value;
                NotifyOfChange("WrapperWorkItemProjectName");
            }
        }


        private string koppelLabelContent = "Koppel Taak";

        public string KoppelLabelContent
        {
            get => koppelLabelContent;
            set
            {
                koppelLabelContent = value;
                NotifyOfChange("KoppelLabelContent");
            }
        }

        private void SearchedWorkItemId_textBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (SearchedWorkItemId_textBox.Text == searchTextBoxDefaultText)
            {
                SearchedWorkItemId_textBox.Text = String.Empty;
            }

            SearchWorkItemId_button.IsDefault = true;
        }

        private void SearchedWorkItemId_textBox_LostFocus(object sender, RoutedEventArgs e)
        {
            SearchWorkItemId_button.IsDefault = false;
        }

        private void SearchWorkItemId_button_Click(object sender, RoutedEventArgs e)
        {
            workItemWrapper = tfsController.GetById(SearchedWorkItemId_textBox.Text);

            WrapperTitle = workItemWrapper.Title;
            WrapperWorkItemType = workItemWrapper.WorkItemType;
            WrapperWorkItemProjectName = workItemWrapper.WorkItemProjectName;

            if (workitemHelper.AllowToAddToPbi(WrapperWorkItemType, workItemWrapper))
            {
                KoppelLabelContent = "Koppel Taak";
                Koppel_label.Foreground = System.Windows.Media.Brushes.Black;
                EnableAllTaskCheckBoxes();
                Koppel_button.IsEnabled = true;
            }
            else
            {
                KoppelLabelContent = $"Aan de type \"{WrapperWorkItemType}\" mag geen Taak gekoppeld worden.";
                Koppel_label.Foreground = System.Windows.Media.Brushes.Red;
                DisableAllTaskCheckBoxes();
                Koppel_button.IsEnabled = false;
            }
        }

        private void EnableAllTaskCheckBoxes()
        {
            foreach (var checkbox in ConfiguredTasksOrActivities)
            {
                checkbox.IsSelected = true;//.IsChecked = false;
                                            // checkbox.IsEnabled = false;
            }
        }

        private void DisableAllTaskCheckBoxes()
        {
            foreach (var checkbox in ConfiguredTasksOrActivities)
            {
                checkbox.IsSelected = false;//.IsChecked = false;
                //checkbox.IsEnabled = false;
            }
        }

        //private void SetVisibilityOfTaskCheckBoxes()
        //{
        //    foreach (var checkbox in AllTaskCheckBoxes())
        //    {
        //        if (checkbox.Content.ToString().Length < 1)
        //            checkbox.Visibility = Visibility.Hidden;
        //    }
        //}

        //private IEnumerable<CheckBox> AllTaskCheckBoxes()
        //{
        //    return WimMainChecks.Children.OfType<CheckBox>();
        //}

        //private bool AllowedToAddTaskToPbi()
        //{
        //    return workItemWrapper != null &&
        //           WrapperWorkItemType != null &&
        //          (WrapperWorkItemType == "Product Backlog Item" || WrapperWorkItemType == "Bug");
        //}

        private void Koppel_button_Click(object sender, RoutedEventArgs e)
        {
            int numberOfCheckedBoxes = ConfiguredTasksOrActivities.Where(s => s.IsSelected).Count();


            if (numberOfCheckedBoxes > 0)
            {
                string taakTaken = numberOfCheckedBoxes == 1 ? "taak" : "taken";

                ConfirmPopupTextBlock.Text = $"{numberOfCheckedBoxes} {taakTaken} toevoegen?";
                ConfirmPopup.IsOpen = true;
            }
        }

        private void ConfirmPopupCancel_button_Click(object sender, RoutedEventArgs e)
        {
            ConfirmPopup.IsOpen = false;
        }

        private void ConfirmPopupOK_button_Click(object sender, RoutedEventArgs e)
        {
            int aantalTakenToegevoegd = 0;
            IEnumerable<ChildItem> geselecteerdeTaken = ConfiguredTasksOrActivities.Where(s => s.IsSelected);

            aantalTakenToegevoegd = tfsController.VoegGeselecteerdeTakenToe(workItemWrapper, geselecteerdeTaken);

            string taakTaken = aantalTakenToegevoegd == 1 ? "taak" : "taken";

            SearchedWorkItemId_textBox.Text = searchTextBoxDefaultText;
            DisableAllTaskCheckBoxes();
            ConfirmPopup.IsOpen = false;

            ResultPopupTextBlock.Text = $"{aantalTakenToegevoegd} {taakTaken} toegevoegd.";
            ResultPopup.IsOpen = true;
        }

        private void CheckSameTaskExists(string title)
        {
            throw new NotImplementedException();
        }

        private void ResultPopupOK_button_Click(object sender, RoutedEventArgs e)
        {
            ResultPopup.IsOpen = false;
        }

        //private void MenuItem_Xtreme_Click(object sender, RoutedEventArgs e)
        //{
        //    ConfiguredTasksOrActivities = SettingsGetter.GetChildItemsFromSection(Team.Xtreme.ToString());
        //}

        //private void MenuItem_Committers_Click(object sender, RoutedEventArgs e)
        //{
        //    ConfiguredTasksOrActivities = SettingsGetter.GetChildItemsFromSection(Team.Committers.ToString());
        //}

        private void MenuItem_Team_Click(object sender, RoutedEventArgs e)
        {
            MenuItem panel = sender as MenuItem;
            string teamNaam = panel.Header.ToString();
            ConfiguredTasksOrActivities = SettingsGetter.GetChildItemsFromSection(teamNaam);
        }
    }
}
