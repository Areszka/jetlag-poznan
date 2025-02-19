export function formatTime(ms: number, options: { showHours: boolean } = { showHours: false }) {
  const ss = Math.floor(ms / 1000) % 60;
  const mm = Math.floor(ms / 1000 / 60) % 60;
  const hh = Math.floor(ms / 1000 / 60 / 60);

  const formatedSeconds = ss.toString().padStart(2, "0");
  const formatedMinutes = mm.toString().padStart(2, "0");
  const formatedHours = hh.toString().padStart(2, "0");

  if (hh || options.showHours) {
    return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
  }

  return `${formatedMinutes}:${formatedSeconds}`;
}

export async function fetcher(url: string) {
  return fetch(url).then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.statusText);
    }
  });
}

export async function fetcherPost<T>(url: string, options?: { arg: T }) {
  return fetch(url, { method: "POST", body: JSON.stringify(options?.arg) }).then(async (res) => {
    if (!res.ok) {
      const { error } = await res.json();
      if (error) {
        throw new Error(error);
      }
      throw new Error(res.statusText);
    }
    return res.json();
  });
}

export async function fetcherDelete(url: string) {
  return fetch(url, { method: "DELETE" }).then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.statusText);
    }
  });
}
