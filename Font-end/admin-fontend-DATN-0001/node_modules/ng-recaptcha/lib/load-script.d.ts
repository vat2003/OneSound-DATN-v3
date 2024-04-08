/// <reference types="grecaptcha" />
import { RecaptchaLoaderOptions } from "./tokens";
declare global {
    interface Window {
        ng2recaptchaloaded?(): void;
    }
}
export type RenderMode = "explicit" | {
    key: string;
};
declare function loadScript(renderMode: RenderMode, onBeforeLoad: (url: URL) => {
    url: URL;
    nonce?: string;
}, onLoaded: (grecaptcha: ReCaptchaV2.ReCaptcha) => void, { url, lang, nonce }?: {
    url?: string;
    lang?: string;
    nonce?: string;
}): void;
declare function newLoadScript({ v3SiteKey, onBeforeLoad, onLoaded, }: {
    v3SiteKey: string | undefined;
    onLoaded(recaptcha: ReCaptchaV2.ReCaptcha): void;
} & Pick<Required<RecaptchaLoaderOptions>, "onBeforeLoad">): void;
export declare const loader: {
    loadScript: typeof loadScript;
    newLoadScript: typeof newLoadScript;
};
export {};
