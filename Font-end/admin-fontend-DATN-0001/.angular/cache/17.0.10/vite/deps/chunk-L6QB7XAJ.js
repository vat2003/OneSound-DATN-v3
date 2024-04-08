import {
  deleteApp,
  getApp,
  getApps,
  initializeApp,
  onLog,
  registerVersion,
  setLogLevel
} from "./chunk-4JPBX5KF.js";
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  PLATFORM_ID,
  VERSION,
  Version,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-EIU4B7KG.js";
import {
  queueScheduler
} from "./chunk-FQ7W6U4F.js";
import {
  Observable,
  asyncScheduler,
  concatMap,
  distinct,
  from,
  observeOn,
  subscribeOn,
  tap,
  timer
} from "./chunk-N6B2ISGR.js";

// node_modules/firebase/app/dist/esm/index.esm.js
var name = "firebase";
var version = "10.8.1";
registerVersion(name, version, "app");

// node_modules/@angular/fire/fesm2022/angular-fire.mjs
var VERSION2 = new Version("ANGULARFIRE2_VERSION");
function ɵgetDefaultInstanceOf(identifier, provided, defaultApp) {
  if (provided) {
    if (provided.length === 1) {
      return provided[0];
    }
    const providedUsingDefaultApp = provided.filter((it) => it.app === defaultApp);
    if (providedUsingDefaultApp.length === 1) {
      return providedUsingDefaultApp[0];
    }
  }
  const defaultAppWithContainer = defaultApp;
  const provider = defaultAppWithContainer.container.getProvider(identifier);
  return provider.getImmediate({
    optional: true
  });
}
var ɵgetAllInstancesOf = (identifier, app) => {
  const apps = app ? [app] : getApps();
  const instances = [];
  apps.forEach((app2) => {
    const provider = app2.container.getProvider(identifier);
    provider.instances.forEach((instance) => {
      if (!instances.includes(instance)) {
        instances.push(instance);
      }
    });
  });
  return instances;
};
var ɵAppCheckInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(ɵAPP_CHECK_PROVIDER_NAME);
  }
};
var ɵAPP_CHECK_PROVIDER_NAME = "app-check";
function noop() {
}
var ɵZoneScheduler = class {
  zone;
  delegate;
  constructor(zone, delegate = queueScheduler) {
    this.zone = zone;
    this.delegate = delegate;
  }
  now() {
    return this.delegate.now();
  }
  schedule(work, delay, state) {
    const targetZone = this.zone;
    const workInZone = function(state2) {
      targetZone.runGuarded(() => {
        work.apply(this, [state2]);
      });
    };
    return this.delegate.schedule(workInZone, delay, state);
  }
};
var BlockUntilFirstOperator = class {
  zone;
  // @ts-ignore
  task = null;
  constructor(zone) {
    this.zone = zone;
  }
  call(subscriber, source) {
    const unscheduleTask = this.unscheduleTask.bind(this);
    this.task = this.zone.run(() => Zone.current.scheduleMacroTask("firebaseZoneBlock", noop, {}, noop, noop));
    return source.pipe(tap({
      next: unscheduleTask,
      complete: unscheduleTask,
      error: unscheduleTask
    })).subscribe(subscriber).add(unscheduleTask);
  }
  unscheduleTask() {
    setTimeout(() => {
      if (this.task != null && this.task.state === "scheduled") {
        this.task.invoke();
        this.task = null;
      }
    }, 10);
  }
};
var ɵAngularFireSchedulers = class _ɵAngularFireSchedulers {
  ngZone;
  outsideAngular;
  insideAngular;
  constructor(ngZone) {
    this.ngZone = ngZone;
    this.outsideAngular = ngZone.runOutsideAngular(() => new ɵZoneScheduler(Zone.current));
    this.insideAngular = ngZone.run(() => new ɵZoneScheduler(Zone.current, asyncScheduler));
    globalThis.ɵAngularFireScheduler ||= this;
  }
  static ɵfac = function ɵAngularFireSchedulers_Factory(t) {
    return new (t || _ɵAngularFireSchedulers)(ɵɵinject(NgZone));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ɵAngularFireSchedulers,
    factory: _ɵAngularFireSchedulers.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵAngularFireSchedulers, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }], null);
})();
function getSchedulers() {
  const schedulers = globalThis.ɵAngularFireScheduler;
  if (!schedulers) {
    throw new Error(`Either AngularFireModule has not been provided in your AppModule (this can be done manually or implictly using
provideFirebaseApp) or you're calling an AngularFire method outside of an NgModule (which is not supported).`);
  }
  return schedulers;
}
function runOutsideAngular(fn) {
  return getSchedulers().ngZone.runOutsideAngular(() => fn());
}
function run(fn) {
  return getSchedulers().ngZone.run(() => fn());
}
function keepUnstableUntilFirst(obs$) {
  return ɵkeepUnstableUntilFirstFactory(getSchedulers())(obs$);
}
function ɵkeepUnstableUntilFirstFactory(schedulers) {
  return function keepUnstableUntilFirst2(obs$) {
    obs$ = obs$.lift(new BlockUntilFirstOperator(schedulers.ngZone));
    return obs$.pipe(
      // Run the subscribe body outside of Angular (e.g. calling Firebase SDK to add a listener to a change event)
      subscribeOn(schedulers.outsideAngular),
      // Run operators inside the angular zone (e.g. side effects via tap())
      observeOn(schedulers.insideAngular)
      // INVESTIGATE https://github.com/angular/angularfire/pull/2315
      // share()
    );
  };
}
var zoneWrapFn = (it, macrotask) => {
  const _this = void 0;
  return function() {
    const _arguments = arguments;
    if (macrotask) {
      setTimeout(() => {
        if (macrotask.state === "scheduled") {
          macrotask.invoke();
        }
      }, 10);
    }
    return run(() => it.apply(_this, _arguments));
  };
};
var ɵzoneWrap = (it, blockUntilFirst) => {
  return function() {
    let macrotask;
    const _arguments = arguments;
    for (let i = 0; i < arguments.length; i++) {
      if (typeof _arguments[i] === "function") {
        if (blockUntilFirst) {
          macrotask ||= run(() => Zone.current.scheduleMacroTask("firebaseZoneBlock", noop, {}, noop, noop));
        }
        _arguments[i] = zoneWrapFn(_arguments[i], macrotask);
      }
    }
    const ret = runOutsideAngular(() => it.apply(this, _arguments));
    if (!blockUntilFirst) {
      if (ret instanceof Observable) {
        const schedulers = getSchedulers();
        return ret.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
      } else {
        return run(() => ret);
      }
    }
    if (ret instanceof Observable) {
      return ret.pipe(keepUnstableUntilFirst);
    } else if (ret instanceof Promise) {
      return run(() => new Promise((resolve, reject) => ret.then((it2) => run(() => resolve(it2)), (reason) => run(() => reject(reason)))));
    } else if (typeof ret === "function" && macrotask) {
      return function() {
        setTimeout(() => {
          if (macrotask && macrotask.state === "scheduled") {
            macrotask.invoke();
          }
        }, 10);
        return ret.apply(this, arguments);
      };
    } else {
      return run(() => ret);
    }
  };
};

// node_modules/@angular/fire/fesm2022/angular-fire-app.mjs
var FirebaseApp = class {
  constructor(app) {
    return app;
  }
};
var FirebaseApps = class {
  constructor() {
    return getApps();
  }
};
var firebaseApp$ = timer(0, 300).pipe(concatMap(() => from(getApps())), distinct());
function defaultFirebaseAppFactory(provided) {
  if (provided && provided.length === 1) {
    return provided[0];
  }
  return new FirebaseApp(getApp());
}
var PROVIDED_FIREBASE_APPS = new InjectionToken("angularfire2._apps");
var DEFAULT_FIREBASE_APP_PROVIDER = {
  provide: FirebaseApp,
  useFactory: defaultFirebaseAppFactory,
  deps: [[new Optional(), PROVIDED_FIREBASE_APPS]]
};
var FIREBASE_APPS_PROVIDER = {
  provide: FirebaseApps,
  deps: [[new Optional(), PROVIDED_FIREBASE_APPS]]
};
function firebaseAppFactory(fn) {
  return (zone, injector) => {
    const app = zone.runOutsideAngular(() => fn(injector));
    return new FirebaseApp(app);
  };
}
var FirebaseAppModule = class _FirebaseAppModule {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(platformId) {
    registerVersion("angularfire", VERSION2.full, "core");
    registerVersion("angularfire", VERSION2.full, "app");
    registerVersion("angular", VERSION.full, platformId.toString());
  }
  static ɵfac = function FirebaseAppModule_Factory(t) {
    return new (t || _FirebaseAppModule)(ɵɵinject(PLATFORM_ID));
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _FirebaseAppModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_FIREBASE_APP_PROVIDER, FIREBASE_APPS_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FirebaseAppModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_FIREBASE_APP_PROVIDER, FIREBASE_APPS_PROVIDER]
    }]
  }], () => [{
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
function provideFirebaseApp(fn, ...deps) {
  return {
    ngModule: FirebaseAppModule,
    providers: [{
      provide: PROVIDED_FIREBASE_APPS,
      useFactory: firebaseAppFactory(fn),
      multi: true,
      deps: [NgZone, Injector, ɵAngularFireSchedulers, ...deps]
    }]
  };
}
var deleteApp2 = ɵzoneWrap(deleteApp, true);
var getApp2 = ɵzoneWrap(getApp, true);
var getApps2 = ɵzoneWrap(getApps, true);
var initializeApp2 = ɵzoneWrap(initializeApp, true);
var onLog2 = ɵzoneWrap(onLog, true);
var registerVersion2 = ɵzoneWrap(registerVersion, true);
var setLogLevel2 = ɵzoneWrap(setLogLevel, true);

export {
  VERSION2 as VERSION,
  ɵgetDefaultInstanceOf,
  ɵgetAllInstancesOf,
  ɵAppCheckInstances,
  ɵAngularFireSchedulers,
  ɵzoneWrap,
  FirebaseApp,
  FirebaseApps,
  firebaseApp$,
  FirebaseAppModule,
  provideFirebaseApp,
  deleteApp2 as deleteApp,
  getApp2 as getApp,
  getApps2 as getApps,
  initializeApp2 as initializeApp,
  onLog2 as onLog,
  registerVersion2 as registerVersion,
  setLogLevel2 as setLogLevel
};
/*! Bundled license information:

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=chunk-L6QB7XAJ.js.map
