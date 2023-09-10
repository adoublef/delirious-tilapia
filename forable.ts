import { createAbility } from "@github/catalyst/src/ability";
import { CustomElement, CustomElementClass } from "@github/catalyst/src/custom-element";

interface ForableInput {
    forElementChangedCallback(newForElement: Element): void;
}

interface Forable extends CustomElement {
    htmlFor: string;
    forElementChangedCallback(newForElement: Element): void;
}

interface Constructor<T> {
    // TS mandates Constructors that get mixins have `...args: any[]`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new(...args: any[]): T;
}

const observer = new IntersectionObserver(intersections => {
    for (const entry of intersections) {
        if (entry.isIntersecting) {
            control(entry.target as Forable);
        }
    }
});

async function control(element: Forable) {
    // if()
}

export const forable = createAbility(
    <T extends CustomElementClass & Constructor<ForableInput>>(Class: T): T & Constructor<ForableInput> =>
        class extends Class {
            static observedAttributes = ['for', ...(Class.observedAttributes || [])];

            get htmlFor(): string {
                const htmlFor = this.getAttribute("for") || "";
                return htmlFor;
            }

            set htmlFor(value: unknown | null) {
                this.setAttribute("for", `${value}`);
            }

            // TS mandates Constructors that get mixins have `...args: any[]`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            constructor(...args: any[]) {
                super(...args);
            }

            // forElementChangedCallback
            connectedCallback() {
                // if (this.loading === 'eager' || this.loading === 'auto') {
                control(this);
                // } else {
                // observer.observe(this);
                // }
            }

            attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
                super.attributeChangedCallback?.(name, oldValue, newValue);

                if (oldValue !== newValue) {
                    if (name === "for") {
                        control(this);
                    }
                }
            }
        }
);