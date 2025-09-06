import { aiForecastPerformance } from "../features/aiEngine.js";
import { Store } from "../core/store.js";
import { toast } from "../ui/toast.js";

export function renderForecast(root) {
  root.innerHTML = `
    <section class="fade-in">
      <h1>Performance Forecast</h1>
      <p class="dim small">AI projection for engagement & reach (simulated).</p>
      <div class="flex gap-sm" style="margin:.7rem 0;">
        <button class="btn small" id="runForecastBtn">Run Forecast</button>
        <button class="btn outline small" id="clearForecastBtn">Clear</button>
      </div>
      <div id="forecastArea">
        ${Store.state.forecastCache ? renderChart(Store.state.forecastCache) : `<div class="empty-state"><h3>No forecast yet</h3><p>Click Run Forecast to generate.</p></div>`}
      </div>
    </section>
  `;

  document.getElementById("runForecastBtn").addEventListener("click", async () => {
    toast("Generating forecast...");
    const data = await aiForecastPerformance();
    Store.update("forecastCache", data);
    renderForecast(root);
    toast("Forecast ready");
  });

  document.getElementById("clearForecastBtn").addEventListener("click", () => {
    Store.update("forecastCache", null);
    renderForecast(root);
  });
}

function renderChart(data) {
  // Simple textual placeholder
  return `
    <div class="card">
      <div class="card-header"><div class="card-title">Projection (Next ${data.length} days)</div></div>
      <div class="chart-placeholder">
        <div style="max-width:90%; font-size:.6rem; line-height:1.4;">
          ${data.map(p => new Date(p.t).toLocaleDateString().slice(0,5)+": ER "+p.engagement+"% Reach "+p.reach).join("<br/>")}
        </div>
      </div>
    </div>
  `;
}