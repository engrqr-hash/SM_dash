export const EventBus = {
  _handlers: {},
  on(evt, fn) {
    (this._handlers[evt] ||= []).push(fn);
  },
  off(evt, fn) {
    this._handlers[evt] = (this._handlers[evt]||[]).filter(f=>f!==fn);
  },
  emit(evt, payload) {
    (this._handlers[evt]||[]).forEach(fn=>fn(payload));
  }
};