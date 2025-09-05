export function renderTeam(root) {
  root.innerHTML = `
    <section class="fade-in">
      <h1>Team & Collaboration</h1>
      <p class="dim small">Roles, approvals, client portal, internal notes.</p>
      <div class="empty-state">
        <h3>No Team Members Yet</h3>
        <p>Invite collaborators to streamline approvals and production workflow.</p>
        <button class="btn small">Invite User</button>
      </div>
    </section>
  `;
}