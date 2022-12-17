import storage, { VALIDATORS, CounterPeriod, Schema } from "./storage";
import getBlockedMessage from "./helpers/get-blocked-message";

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const rule = params.get("rule");
  if (!rule) {
    return;
  }

  const count = params.get("count");
  const period = params.get("period");

  const message = getBlockedMessage({
    rule,
    count: count || undefined,
    period: VALIDATORS.counterPeriod(period) ? period as CounterPeriod : undefined,
  });

  (document.getElementById("message") as HTMLParagraphElement).innerHTML = message;

  const disableButton = document.getElementById("disable-btn") as HTMLButtonElement;
  // add event listener to disable button
  disableButton.addEventListener("click", () => {
    storage.get(["blocked"], (blocked) => {
      // remove rule from blocked list
      blocked.blocked = blocked.blocked.filter((blockedRule) => blockedRule !== rule);
      // add a new value to blocked.blocked
      blocked.blocked.push(`!${rule}`);
      // save new blocked list
      storage.set<Pick<Schema, "blocked">>({ blocked: blocked.blocked });
      // navigate to options page
      window.location.href = `https://${rule}`;
    });
  });
});
