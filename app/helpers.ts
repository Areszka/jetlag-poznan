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

export async function fetcherPost(url: string) {
  return fetch(url, { method: "POST" }).then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.statusText);
    }
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
