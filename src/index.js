import { EMPTY, fromEvent } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  tap,
  catchError,
  filter
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

const url = "https://api.github.com/search/users?q=";

const input = document.querySelector("#search");
const result = document.querySelector("#result");

const stream$ = fromEvent(input, "input").pipe(
  map((e) => e.target.value),
  debounceTime(1000),
  distinctUntilChanged(),
  tap(() => result.innerHTML = ''),
  filter(v => v.trim()),
  switchMap((value) => ajax.getJSON(url + value).pipe(
    catchError(err => EMPTY)
  )),
  map((res) => res.items),
  mergeMap((items) => items)
);

stream$.subscribe({
  next: (user) => {
    result.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
        <div class="card-image">
          <img src="${user.avatar_url}" />
          <span class="card-title">${user.login}</span>
        </div>
        <div class="card-action">
            <a href="${user.html_url}" target="_blank">Open github</a>
        </div>
      </div>`
    );
  },
});
