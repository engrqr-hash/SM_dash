export function migrateState(state, targetVersion) {
  if (!state._version) state._version = 1;
  let current = state._version;

  while (current < targetVersion) {
    if (current === 1) {
      // Example migration: introduce approvals, drafts arrays if missing
      state.drafts = state.drafts || [];
      state.approvals = state.approvals || [];
      state.marketplace = state.marketplace || { purchased: [] };
      state.settings = state.settings || { notifications: { email:true, slack:false, whatsapp:false }};
      current = 2;
      state._version = 2;
    } else {
      break;
    }
  }
  return state;
}