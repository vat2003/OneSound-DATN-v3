import {
  AnimationDriver,
  AnimationEngine,
  AnimationRendererFactory,
  AnimationStyleNormalizer,
  NoopAnimationDriver,
  WebAnimationsDriver,
  WebAnimationsStyleNormalizer
} from "./chunk-A63OV27X.js";
import {
  BrowserModule,
  DomRendererFactory2
} from "./chunk-LMSBQYLV.js";
import "./chunk-OO7JOUVN.js";
import "./chunk-Q4XA6PI2.js";
import {
  DOCUMENT
} from "./chunk-E4EC6XH2.js";
import {
  ANIMATION_MODULE_TYPE,
  ApplicationRef,
  Inject,
  Injectable,
  NgModule,
  NgZone,
  RendererFactory2,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-N4TOIXMS.js";
import "./chunk-GRLKULYS.js";
import "./chunk-DDZSJGOH.js";
import "./chunk-QKENJYJC.js";
import "./chunk-PQ2ATPLD.js";

// ../../node_modules/@angular/platform-browser/fesm2022/animations.mjs
var _InjectableAnimationEngine = class _InjectableAnimationEngine extends AnimationEngine {
  // The `ApplicationRef` is injected here explicitly to force the dependency ordering.
  // Since the `ApplicationRef` should be created earlier before the `AnimationEngine`, they
  // both have `ngOnDestroy` hooks and `flush()` must be called after all views are destroyed.
  constructor(doc, driver, normalizer, appRef) {
    super(doc, driver, normalizer);
  }
  ngOnDestroy() {
    this.flush();
  }
};
_InjectableAnimationEngine.ɵfac = function InjectableAnimationEngine_Factory(t) {
  return new (t || _InjectableAnimationEngine)(ɵɵinject(DOCUMENT), ɵɵinject(AnimationDriver), ɵɵinject(AnimationStyleNormalizer), ɵɵinject(ApplicationRef));
};
_InjectableAnimationEngine.ɵprov = ɵɵdefineInjectable({
  token: _InjectableAnimationEngine,
  factory: _InjectableAnimationEngine.ɵfac
});
var InjectableAnimationEngine = _InjectableAnimationEngine;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InjectableAnimationEngine, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: AnimationDriver
  }, {
    type: AnimationStyleNormalizer
  }, {
    type: ApplicationRef
  }], null);
})();
function instantiateDefaultStyleNormalizer() {
  return new WebAnimationsStyleNormalizer();
}
function instantiateRendererFactory(renderer, engine, zone) {
  return new AnimationRendererFactory(renderer, engine, zone);
}
var SHARED_ANIMATION_PROVIDERS = [{
  provide: AnimationStyleNormalizer,
  useFactory: instantiateDefaultStyleNormalizer
}, {
  provide: AnimationEngine,
  useClass: InjectableAnimationEngine
}, {
  provide: RendererFactory2,
  useFactory: instantiateRendererFactory,
  deps: [DomRendererFactory2, AnimationEngine, NgZone]
}];
var BROWSER_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useFactory: () => new WebAnimationsDriver()
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "BrowserAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useClass: NoopAnimationDriver
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "NoopAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var _BrowserAnimationsModule = class _BrowserAnimationsModule {
  /**
   * Configures the module based on the specified object.
   *
   * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
   * @see {@link BrowserAnimationsModuleConfig}
   *
   * @usageNotes
   * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
   * function as follows:
   * ```
   * @NgModule({
   *   imports: [BrowserAnimationsModule.withConfig(config)]
   * })
   * class MyNgModule {}
   * ```
   */
  static withConfig(config) {
    return {
      ngModule: _BrowserAnimationsModule,
      providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS : BROWSER_ANIMATIONS_PROVIDERS
    };
  }
};
_BrowserAnimationsModule.ɵfac = function BrowserAnimationsModule_Factory(t) {
  return new (t || _BrowserAnimationsModule)();
};
_BrowserAnimationsModule.ɵmod = ɵɵdefineNgModule({
  type: _BrowserAnimationsModule,
  exports: [BrowserModule]
});
_BrowserAnimationsModule.ɵinj = ɵɵdefineInjector({
  providers: BROWSER_ANIMATIONS_PROVIDERS,
  imports: [BrowserModule]
});
var BrowserAnimationsModule = _BrowserAnimationsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideAnimations() {
  return [...BROWSER_ANIMATIONS_PROVIDERS];
}
var _NoopAnimationsModule = class _NoopAnimationsModule {
};
_NoopAnimationsModule.ɵfac = function NoopAnimationsModule_Factory(t) {
  return new (t || _NoopAnimationsModule)();
};
_NoopAnimationsModule.ɵmod = ɵɵdefineNgModule({
  type: _NoopAnimationsModule,
  exports: [BrowserModule]
});
_NoopAnimationsModule.ɵinj = ɵɵdefineInjector({
  providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
  imports: [BrowserModule]
});
var NoopAnimationsModule = _NoopAnimationsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideNoopAnimations() {
  return [...BROWSER_NOOP_ANIMATIONS_PROVIDERS];
}
export {
  ANIMATION_MODULE_TYPE,
  BrowserAnimationsModule,
  NoopAnimationsModule,
  provideAnimations,
  provideNoopAnimations,
  InjectableAnimationEngine as ɵInjectableAnimationEngine
};
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations.mjs:
  (**
   * @license Angular v17.0.9
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=@angular_platform-browser_animations.js.map
