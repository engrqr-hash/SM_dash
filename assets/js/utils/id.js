export function nanoid(size = 10) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  crypto.getRandomValues(new Uint8Array(size)).forEach(c => {
    id += chars[c % chars.length];
  });
  return id;
}