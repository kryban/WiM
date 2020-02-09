export class Logger {
    Log(callerName, logTekst) {
        var tekst = (logTekst !== null && typeof logTekst !== "undefined") ? logTekst : "";
        console.log(callerName + ": " + tekst);
    }
}
