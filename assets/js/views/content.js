export function renderContent(root) {
  root.innerHTML = `
    <section class="fade-in">
      <h1>Content Strategy</h1>
      <p class="dim small">Templates, hashtag groups, series buckets, evergreen pools.</p>
      <div class="empty-state">
        <h3>Coming Soon</h3>
        <p>AI topic clustering, competitor gap analysis, and content series planner.</p>
        <button class="btn small">Request Feature</button>
      </div>
    </section>
  `;
}