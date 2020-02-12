import { WimWorkItem } from "./wimworkitem";
import { WorkItemTrackingHttpClient4_1 } from "TFS/WorkItemTracking/RestClient";

export class VssWorkers {
public parentWorkItem: WimWorkItem;
public witClient: WorkItemTrackingHttpClient4_1;
public selectedTeam: string;
public vssControls: any;
public vssStatusindicator;
public vssService;
public vssWiTrackingClient;
public vssMenus;
public vssDataService: IExtensionDataService;
}