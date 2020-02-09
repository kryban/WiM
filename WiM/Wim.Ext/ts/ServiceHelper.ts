import { Logger } from "./Logger.js";

export class ServiceHelper {
    async GetDataService() {
        let logger = new Logger();
        let retVal;
        logger.Log("GetDataService", "1->" + retVal);
        retVal = await VSS.getService(VSS.ServiceIds.ExtensionData);
        logger.Log(".GetDataService", "2->" + retVal);
        return retVal;
    }
}