let initialized = false;

export async function ensureDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  initialized = true;
}
