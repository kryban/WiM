var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VssWorkers } from "./VssWorkers.js";
import { Logger } from "./Logger.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";
import { ButtonHelper } from "./ButtonHelper.js";
import { EventHandlerRegister } from "./EventHandlerRegister.js";
import { ServiceHelper } from "./ServiceHelper.js";
import { MenuBuilder } from "./MenuBuilder.js";
import { ViewHelper } from "./ViewHelper.js";
export class PreLoader {
    constructor(vssWorkers) {
        this.vssWorkers = vssWorkers;
    }
    FindCollection() {
        let logger = new Logger();
        logger.Log("FindCollection", "3: " + this.vssWorkers.vssDataService);
        this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName)
            .then((docs) => {
            if (docs.length < 1) {
                this.CreateFirstTimeCollection();
            }
            logger.Log("FindCollection", "Number of docs found: " + docs.length);
        }, // on reject
        (err) => {
            this.CreateFirstTimeCollection();
            logger.Log("FindCollection", "Nothing found. Default Created.");
        });
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
    LoadPreConditions(window) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.LoadRequired();
            var name = window.location.pathname.split('/').slice(-1);
            new CheckBoxHelper(this.vssWorkers.parentWorkItem).DisableCheckBoxes();
            new ButtonHelper(this.vssWorkers.parentWorkItem).DisableAddButton();
            new EventHandlerRegister(this.vssWorkers).RegisterEvents();
            new Logger().Log("window.onload", "DocumentReady:" + name);
        });
    }
    LoadRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            this.vssWorkers = new VssWorkers();
            logger.Log("LoadRequired()", "Begin of LoadRequired()");
            VSS.ready(() => __awaiter(this, void 0, void 0, function* () {
                yield VSS.require(["VSS/Controls", "VSS/Controls/StatusIndicator", "VSS/Service", "TFS/WorkItemTracking/RestClient", "VSS/Controls/Menus"], (c, i, s, r, m) => __awaiter(this, void 0, void 0, function* () {
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
                    this.vssWorkers.vssDataService = yield new ServiceHelper().GetDataService();
                    yield new MenuBuilder(this.vssWorkers).BuildMenu(this.vssWorkers.vssControls, this.vssWorkers.vssMenus);
                    new ViewHelper(this.vssWorkers).CreateTeamSelectElementInitially();
                    VSS.notifyLoadSucceeded();
                }));
            }));
        });
    }
}
