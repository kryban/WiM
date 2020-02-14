import { VssWorkers } from "./VssWorkers.js";
import { Logger } from "./Logger.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";
import { ButtonHelper } from "./ButtonHelper.js";
import { EventHandlerRegister } from "./EventHandlerRegister.js";
import { ServiceHelper } from "./ServiceHelper.js";
import { MenuBuilder } from "./MenuBuilder.js";
import { ViewHelper } from "./ViewHelper.js";

export class PreLoader {
    vssWorkers: VssWorkers;

    constructor(vssWorkers: VssWorkers) {
        this.vssWorkers = vssWorkers;
    }

    FindCollection() {

        let logger = new Logger();
        logger.Log("FindCollection", "3: " + this.vssWorkers.vssDataService);

        this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName)
            .then(
                (docs) => {
                    if (docs.length < 1) {
                        this.CreateFirstTimeCollection();
                    }
                    logger.Log("FindCollection", "Number of docs found: " + docs.length);
                }, // on reject
                (err) => {
                    this.CreateFirstTimeCollection();
                    logger.Log("FindCollection", "Nothing found. Default Created.");
                }
            );

        logger.Log("FindCollection", "Found");
    }

    CreateFirstTimeCollection() {
        let logger = new Logger();
        logger.Log("CreateFirstTimeCollection", "4: " + this.vssWorkers.vssDataService);
        var newDoc = {
            type: "team",
            text: "DefaultTeam"
        };

        this.vssWorkers.vssDataService.createDocument(this.vssWorkers.TeamSettingsCollectionName, newDoc).then(function (doc) {
            logger.Log("CreateFirstTimeCollection", "Default document created: " + doc.text);
        });

        logger.Log("CreateFirstTimeCollection", "Done");
    }

    CreateDefaultSettingsWhenEmpty() {
        try {
            this.FindCollection();
        }
        catch (e) {
            this.CreateFirstTimeCollection();
        }
    }

    //LoadPreState() {
    //    let modalHelper: ModalHelper = new ModalHelper();

    //    if (document.readyState == "complete") {
    //        var name = window.location.pathname.split('/').slice(-1);

    //        new CheckBoxHelper(parentWorkItem).DisableCheckBoxes();
    //        new ButtonHelper(parentWorkItem).DisableAddButton();

    //        //this.registerTasksModelButtonEvents(modalHelper);
    //        //this.registerTeamsModelButtonEvents(modalHelper);

    //        this.LoadRequired();

    //        new Logger().Log("window.onload", "DocumentReady:" + name);
    //    }
    //}

    async LoadPreConditions(window) {

        await this.LoadRequired();

        var name = window.location.pathname.split('/').slice(-1);

        new CheckBoxHelper(this.vssWorkers.parentWorkItem).DisableCheckBoxes();
        new ButtonHelper(this.vssWorkers.parentWorkItem).DisableAddButton();
        new EventHandlerRegister(this.vssWorkers).RegisterEvents();

        new Logger().Log("window.onload", "DocumentReady:" + name);
    }

    async LoadRequired() {
        let logger: Logger = new Logger();
        this.vssWorkers = new VssWorkers();

        logger.Log("LoadRequired()", "Begin of LoadRequired()");
        VSS.ready(async () => {
            await VSS.require(["VSS/Controls", "VSS/Controls/StatusIndicator", "VSS/Service", "TFS/WorkItemTracking/RestClient", "VSS/Controls/Menus"],
                async (c, i, s, r, m) => {
                    this.vssWorkers.vssControls = c;
                    this.vssWorkers.vssStatusindicator = i;
                    this.vssWorkers.vssService = s;
                    this.vssWorkers.vssWiTrackingClient = r;
                    this.vssWorkers.vssMenus = m;

                    logger.Log("LoadRequired", "Required vssControls: " + this.vssWorkers.vssControls);
                    logger.Log("LoadRequired", "Required vssStatusIndicator: " + this.vssWorkers.vssStatusindicator);
                    logger.Log("LoadRequired", "Required vssService: " + this.vssWorkers.vssService);
                    logger.Log("LoadRequired", "Required vssWiTrackingClient: " + this.vssWorkers.vssWiTrackingClient);
                    logger.Log("LoadRequired", "Required vssMenus: " + this.vssWorkers.vssMenus);

                    this.vssWorkers.vssDataService = await new ServiceHelper().GetDataService();
                    await new MenuBuilder(this.vssWorkers.vssDataService, this.vssWorkers.TeamSettingsCollectionName,
                        this.vssWorkers.parentWorkItem, this.vssWorkers.defaultTeamName, this.vssWorkers.defaultTaskTitle)
                        .BuildMenu(this.vssWorkers.vssControls, this.vssWorkers.vssMenus);
                    new ViewHelper(this.vssWorkers.vssDataService, this.vssWorkers.TeamSettingsCollectionName, this.vssWorkers.parentWorkItem,
                        this.vssWorkers.defaultTeamName, this.vssWorkers.defaultTaskTitle).CreateTeamSelectElementInitially();

                    VSS.notifyLoadSucceeded();
                });
        });
    }
}