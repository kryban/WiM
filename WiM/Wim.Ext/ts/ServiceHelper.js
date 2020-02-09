var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from "./Logger.js";
export class ServiceHelper {
    GetDataService() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            let retVal;
            logger.Log("GetDataService", "1->" + retVal);
            retVal = yield VSS.getService(VSS.ServiceIds.ExtensionData);
            logger.Log(".GetDataService", "2->" + retVal);
            return retVal;
        });
    }
}
