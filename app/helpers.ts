export function getTime(diff: number) {
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;
  let hh = Math.floor(diff / 1000 / 60 / 60);

  return `${hh < 10 ? "0" : ""}${hh}:${mm < 10 ? "0" : ""}${mm}:${ss < 10 ? "0" : ""}${ss}`;
}

export function timeToMinutesAndSeconds(diff: number) {
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;

  return `${mm < 10 ? "0" : ""}${mm}:${ss < 10 ? "0" : ""}${ss}`;
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
