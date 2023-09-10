```ts
/*
The forable mixin:
 - adds `htmlFor` property (mapping to `for` attribute)
 - watches for `for` attribute changes.
 - calls `forElementChangedCallback` with the new for element
*/ 
import {forable} from '@github/catalyst'

/*
The loadable mixin:
 - adds `src` and `loading` property
 - watches for `src` and `loading` attribute changes.
 - calls `load()` when `src` changes (if connected)
 - calls load on `connectedCallback` if `loading = eager`
 - calls load when visible if `loading = lazy`
 - `load()` calls get debounced to microtask
 - emits `loadstart, `load`, `loadend`, and`error` events, where appropriate
    * / ;
import { loadable } from '@github/catalyst';

@forable
@loadable
@controller
class AutoCompleteElement extends HTMLElement {

    forElementChangedCallback(newForElement: Element) {
        this.htmlFor; // returns '#for' 
    }

    load(request: Request) {
    }

}
```