/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "f6cc03d03feb1d913e67";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "server";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! morgan */ \"morgan\");\n/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _routes_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes/index */ \"./routes/index.js\");\n\n //import favicon from 'serve-favicon';\n\n\n\n\n\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()(); // view engine setup\n\napp.set('views', path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, 'views'));\napp.set('view engine', 'jade'); // uncomment after placing your favicon in /public\n//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));\n\napp.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('dev'));\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_4___default.a.json());\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_4___default.a.urlencoded({\n  extended: false\n}));\napp.use(cookie_parser__WEBPACK_IMPORTED_MODULE_3___default()());\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default.a.static(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, 'public')));\napp.use('/api', _routes_index__WEBPACK_IMPORTED_MODULE_5__[\"default\"]); // catch 404 and forward to error handler\n\napp.use((req, res, next) => {\n  const err = new Error('Not Found');\n  err.status = 404;\n  next(err);\n}); // error handler\n\napp.use((err, req, res, next) => {\n  // set locals, only providing error in development\n  res.locals.message = err.message;\n  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page\n\n  res.status(err.status || 500);\n  res.render('error');\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./bin/www.js":
/*!********************!*\
  !*** ./bin/www.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app */ \"./app.js\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _models_getDB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/getDB */ \"./models/getDB.js\");\n/**\n * Module dependencies.\n */\n//import 'babel-polyfill';\n\n\nvar debug = __webpack_require__(/*! debug */ \"debug\")('taskworld-assignment:server');\n\n\n\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n/**\n * Get port from environment and store in Express.\n */\n\n\nconst port = normalizePort(process.env.PORT || '3000');\n_app__WEBPACK_IMPORTED_MODULE_0__[\"default\"].set('port', port);\n/**\n * Create HTTP server.\n */\n\nconst server = http__WEBPACK_IMPORTED_MODULE_1___default.a.createServer(_app__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\nlet currentApp = _app__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n/**\n * Listen on provided port, on all network interfaces.\n */\n\nObject(_models_getDB__WEBPACK_IMPORTED_MODULE_2__[\"default\"])().once('open', () => {\n  console.log('database connected');\n  server.listen(port);\n  server.on('error', onError);\n  server.on('listening', onListening);\n});\n/**\n * Normalize a port into a number, string, or false.\n */\n\nfunction normalizePort(val) {\n  const port = parseInt(val, 10);\n\n  if (isNaN(port)) {\n    // named pipe\n    return val;\n  }\n\n  if (port >= 0) {\n    // port number\n    return port;\n  }\n\n  return false;\n}\n/**\n * Event listener for HTTP server \"error\" event.\n */\n\n\nfunction onError(error) {\n  if (error.syscall !== 'listen') {\n    throw error;\n  }\n\n  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages\n\n  switch (error.code) {\n    case 'EACCES':\n      console.error(bind + ' requires elevated privileges');\n      process.exit(1);\n      break;\n\n    case 'EADDRINUSE':\n      console.error(bind + ' is already in use');\n      process.exit(1);\n      break;\n\n    default:\n      throw error;\n  }\n}\n/**\n * Event listener for HTTP server \"listening\" event.\n */\n\n\nfunction onListening() {\n  var addr = server.address();\n  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;\n  debug('Listening on ' + bind);\n}\n\nif (true) {\n  module.hot.accept(/*! ../app */ \"./app.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app */ \"./app.js\");\n(() => {\n    server.removeListener('request', currentApp);\n    server.on('request', _app__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n    currentApp = _app__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));\n}\n\n//# sourceURL=webpack:///./bin/www.js?");

/***/ }),

/***/ "./controllers/addShip.js":
/*!********************************!*\
  !*** ./controllers/addShip.js ***!
  \********************************/
/*! exports provided: checkOceanCondition, addShip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkOceanCondition\", function() { return checkOceanCondition; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addShip\", function() { return addShip; });\n/* harmony import */ var _battle_board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./battle-board */ \"./controllers/battle-board.js\");\n/* harmony import */ var _models_Battle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/Battle */ \"./models/Battle.js\");\n/* harmony import */ var _models_History__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/History */ \"./models/History.js\");\n\n\n\nconst BATTLESHIP_LENGTH = 4;\nconst CRUISERS_LENGTH = 3;\nconst DESTROYERS_LENGTH = 2;\nconst SUBMARINES_LENGTH = 1;\nconst checkOceanCondition = coordinate => {\n  return coordinate.x < 0 || coordinate.x >= _battle_board__WEBPACK_IMPORTED_MODULE_0__[\"Board\"].column || coordinate.y >= _battle_board__WEBPACK_IMPORTED_MODULE_0__[\"Board\"].row || coordinate.y < 0;\n}; /// Function to test whether a specific coordinate is surrounded by other fleets.\n\nconst checkSurroundingGrids = async coordinate => {\n  //console.log( 'checkSurroundingGrids', coordinate )\n  const battle = await _models_Battle__WEBPACK_IMPORTED_MODULE_1__[\"default\"].findOne().sort({\n    createdDate: -1\n  }).lean(); //console.log(battle);\n\n  const hostingShips = battle ? battle.ships : []; //console.log( 'hostingShips', hostingShips )\n\n  let BreakException = {};\n\n  try {\n    hostingShips.forEach(fleet => {\n      fleet.coordinates.forEach(coord => {\n        //console.log( 'check condition', coordinate.x, coordinate.y, coord.x, coord.y, checkDiagonalNeighborCoordinate( coordinate, coord ) )\n        if (checkDuplicateCoordinate(coordinate, coord) || checkSideNeighborCoordinate(coordinate, coord) || checkDiagonalNeighborCoordinate(coordinate, coord)) throw BreakException;\n      });\n    });\n  } catch (e) {\n    if (e !== BreakException) throw e;\n    return true;\n  }\n}; //// Check diagonal grids\n\n\nconst checkDiagonalNeighborCoordinate = (coordinate, coord) => coordinate.x + 1 === coord.x && coordinate.y - 1 === coord.y || coordinate.x - 1 === coord.x && coordinate.y - 1 === coord.y || coordinate.x - 1 === coord.x && coordinate.y + 1 === coord.y || coordinate.x + 1 === coord.x && coordinate.y + 1 === coord.y; /// Check top,right,bottom, and left grids\n\n\nconst checkSideNeighborCoordinate = (coordinate, coord) => coordinate.x + 1 === coord.x && coordinate.y === coord.y || coordinate.x - 1 === coord.x && coordinate.y === coord.y || coordinate.x === coord.x && coordinate.y - 1 === coord.y || coordinate.x === coord.x && coordinate.y + 1 === coord.y; /// Check if the ship is placed in duplicated position\n\n\nconst checkDuplicateCoordinate = (coordinate, coord) => coordinate.x === coord.x && coordinate.y === coord.y;\n\nconst createShip = async (blocks, coordinate, direction) => {\n  //console.log('createShip', direction)\n  let ship = [];\n\n  if (direction === 'horizontal') {\n    let unableToGoRight = false;\n\n    for (let x = coordinate.x; x < coordinate.x + blocks; x++) {\n      if (checkOceanCondition({\n        x: x,\n        y: coordinate.y\n      }) || (await checkSurroundingGrids({\n        x: x,\n        y: coordinate.y\n      }))) {\n        unableToGoRight = true;\n        ship = []; //console.log( 'Illegal Placement' )\n\n        break;\n      } else {\n        //console.log( 'push', x, coordinate.y )\n        ship.push({\n          x: x,\n          y: coordinate.y\n        });\n      }\n    }\n\n    if (unableToGoRight) {\n      console.log('go left');\n\n      for (let x = coordinate.x; x > coordinate.x - blocks; x--) {\n        if (checkOceanCondition({\n          x: x,\n          y: coordinate.y\n        }) || (await checkSurroundingGrids({\n          x: x,\n          y: coordinate.y\n        }))) {\n          //console.log( 'Illegal Placement 2' )\n          return null;\n        } else {\n          //console.log( 'push here', x, coordinate.y )\n          ship.push({\n            x: x,\n            y: coordinate.y\n          });\n        }\n      }\n    }\n  } else {\n    let unableToGoDown = false;\n\n    for (let y = coordinate.y; y < coordinate.y + blocks; y++) {\n      if (checkOceanCondition({\n        x: coordinate.x,\n        y: y\n      }) || (await checkSurroundingGrids({\n        x: coordinate.x,\n        y: y\n      }))) {\n        unableToGoDown = true;\n        ship = []; //console.log( 'Illegal Placement' )\n\n        break;\n      } else {\n        //console.log( 'push', x, coordinate.y )\n        ship.push({\n          x: coordinate.x,\n          y: y\n        });\n      }\n    }\n\n    if (unableToGoDown) {\n      //console.log( 'go up' )\n      for (let y = coordinate.y; y > coordinate.y - blocks; y--) {\n        if (checkOceanCondition({\n          x: coordinate.x,\n          y: y\n        }) || (await checkSurroundingGrids({\n          x: coordinate.x,\n          y: y\n        }))) {\n          //console.log( 'Illegal Placement 2' )\n          return null;\n        } else {\n          //console.log( 'push here', x, coordinate.y )\n          ship.push({\n            x: coordinate.x,\n            y: y\n          });\n        }\n      }\n    }\n  } //console.log( 'ship', ship );\n\n\n  return ship;\n};\n\nconst addShip = async (req, res) => {\n  const {\n    shipType,\n    coordinate,\n    shipDirection\n  } = req.body;\n\n  if (checkOceanCondition(coordinate)) {\n    res.status(400).json({\n      message: 'Out of Ocean'\n    });\n  } else {\n    if (shipDirection === 'horizontal' || shipDirection === 'vertical') {\n      let addedShip, shipLength;\n\n      switch (shipType) {\n        case \"Battleship\":\n          {\n            addedShip = await createShip(BATTLESHIP_LENGTH, coordinate, shipDirection);\n            shipLength = BATTLESHIP_LENGTH;\n            break;\n          }\n\n        case \"Cruisers\":\n          {\n            addedShip = await createShip(CRUISERS_LENGTH, coordinate, shipDirection);\n            shipLength = CRUISERS_LENGTH;\n            break;\n          }\n\n        case \"Destroyers\":\n          {\n            addedShip = await createShip(DESTROYERS_LENGTH, coordinate, shipDirection);\n            shipLength = DESTROYERS_LENGTH;\n            break;\n          }\n\n        case \"Submarines\":\n          {\n            addedShip = await createShip(SUBMARINES_LENGTH, coordinate, shipDirection);\n            shipLength = SUBMARINES_LENGTH;\n            break;\n          }\n\n        default:\n          res.status(400).json({\n            message: 'Ship Type is invalid'\n          });\n      } //console.log( 'addedShip', addedShip );\n\n\n      if (addedShip) {\n        _models_Battle__WEBPACK_IMPORTED_MODULE_1__[\"default\"].findOne().sort({\n          createdDate: -1\n        }).exec((err, battle) => {\n          if (err) throw err; //console.log(battle)\n\n          let newShip = {\n            shipType: shipType,\n            coordinates: addedShip,\n            length: shipLength\n          };\n\n          if (battle) {\n            battle.ships.push(newShip);\n          } else {\n            battle = new _models_Battle__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n              ships: newShip,\n              attacked: []\n            });\n          }\n\n          Promise.resolve(battle.save()).then(result => {\n            console.log(result);\n            let history = new _models_History__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n              board_id: result._id,\n              coordinates: addedShip,\n              message: `${shipType} was placed`\n            });\n            return history.save();\n          }).then(result => res.status(200).json({\n            message: `${shipType} is placed.`\n          })); //battle.save( (err) =>  );\n        });\n      } else {\n        res.status(400).json({\n          message: \"The ship placement is illegal or not allowed.\"\n        });\n      }\n    } else {\n      res.status(400).json({\n        message: 'Placement direction is invalid'\n      });\n    }\n  }\n};\n\n//# sourceURL=webpack:///./controllers/addShip.js?");

/***/ }),

/***/ "./controllers/attack.js":
/*!*******************************!*\
  !*** ./controllers/attack.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_Battle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/Battle */ \"./models/Battle.js\");\n/* harmony import */ var _models_History__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/History */ \"./models/History.js\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _addShip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addShip */ \"./controllers/addShip.js\");\n\n\n\n\n\nconst attack = (req, res, next) => {\n  const {\n    coordinate: attackCoord\n  } = req.body;\n\n  if (Object(_addShip__WEBPACK_IMPORTED_MODULE_3__[\"checkOceanCondition\"])(attackCoord)) {\n    res.status(400).json({\n      message: 'Out of Ocean'\n    });\n  } else {\n    Promise.resolve(_models_Battle__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne().sort({\n      createdDate: -1\n    }).lean()).then(battle => {\n      const {\n        ships,\n        attacked\n      } = battle; //console.log(battle)\n\n      if (ships.length < 1) {\n        res.status(401).json({\n          message: 'Unauthorized to attack empty fleet. Setup the fleet first.'\n        });\n      } else {\n        //console.log( attacked.findIndex( idx => idx.x === attackCoord.x && idx.y === attackCoord.y ) )\n        if (attacked.findIndex(idx => idx.x === attackCoord.x && idx.y === attackCoord.y) !== -1) {\n          res.status(400).json({\n            message: 'This coordinate has been attacked already.'\n          });\n        } else {\n          let BreakException = {};\n          let hitShip = \"\";\n          let hit = false;\n          let isSank = false;\n\n          try {\n            ships.forEach((ship, shipIdx) => {\n              ship.coordinates.forEach((coordinate, coordIndx) => {\n                //console.log( coordinate )\n                if (coordinate.x === attackCoord.x && coordinate.y === attackCoord.y) {\n                  //console.log( 'inside:', ships[shipIdx] )\n                  hitShip = ships[shipIdx].shipType;\n                  ships[shipIdx].coordinates.splice(coordIndx, 1);\n                  isSank = ships[shipIdx].coordinates.length < 1;\n\n                  if (isSank) {\n                    ships.splice(shipIdx, 1);\n                  }\n\n                  hit = true;\n                  throw BreakException;\n                }\n              });\n            });\n          } catch (e) {\n            console.log(\"A ship has been hit\");\n          }\n\n          attacked.push({ ...attackCoord,\n            hit: hit ? true : false\n          });\n          Promise.resolve(_models_Battle__WEBPACK_IMPORTED_MODULE_0__[\"default\"].updateOne({\n            \"_id\": mongoose__WEBPACK_IMPORTED_MODULE_2__[\"Types\"].ObjectId(battle._id)\n          }, {\n            $set: {\n              \"ships\": ships,\n              \"attacked\": attacked\n            }\n          })).then(result => {\n            let message = \"\";\n\n            if (hit) {\n              if (!isSank) {\n                message = \"Hit\"; //res.json({message: \"Hit\"})\n              } else {\n                if (ships.length > 0) {\n                  message = `You just sank the ${hitShip}`; //res.json({message: `You just sank the ${hitShip}`})\n                } else {\n                  message = `Game Over, required shots: ${attacked.length}, missed shots: ${attacked.filter(item => item.hit === false).length}`; //res.json({message: 'Game Over', requiredShots: attacked.length, missedShots: attacked.filter( item => item.hit === false ).length });\n                }\n              }\n            } else {\n              message = \"Miss\"; //res.json({ message: \"Miss\" })\n            }\n\n            const history = new _models_History__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n              board_id: battle._id,\n              coordinates: attackCoord,\n              message: message\n            });\n            history.save(result => {\n              res.json({\n                message: message\n              });\n            });\n          });\n        }\n      }\n    }).catch(err => {\n      console.log('Find battle', err);\n    });\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (attack);\n\n//# sourceURL=webpack:///./controllers/attack.js?");

/***/ }),

/***/ "./controllers/battle-board.js":
/*!*************************************!*\
  !*** ./controllers/battle-board.js ***!
  \*************************************/
/*! exports provided: Board */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Board\", function() { return Board; });\n/// This file is created to work with board\n/// We may initialize board with different number of rows and columns\nconst Board = {\n  row: 10,\n  column: 10\n};\n\n//# sourceURL=webpack:///./controllers/battle-board.js?");

/***/ }),

/***/ "./controllers/home.js":
/*!*****************************!*\
  !*** ./controllers/home.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_Battle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/Battle */ \"./models/Battle.js\");\n/* harmony import */ var _battle_board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./battle-board */ \"./controllers/battle-board.js\");\n\n\n\nconst home = (req, res, next) => {\n  Promise.resolve(_models_Battle__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne().sort({\n    createdDate: -1\n  })).then(battle => {\n    console.log(battle);\n    const boardSize = _battle_board__WEBPACK_IMPORTED_MODULE_1__[\"Board\"].row * _battle_board__WEBPACK_IMPORTED_MODULE_1__[\"Board\"].column;\n    const {\n      ships\n    } = battle;\n    res.json({\n      board: `Board size: ${boardSize} grids`,\n      BattleshipAlive: ships.filter(ship => ship.shipType === 'Battleship').length,\n      CruisersAlive: ships.filter(ship => ship.shipType === 'Cruisers').length,\n      DestroyersAlive: ships.filter(ship => ship.shipType === 'Destroyers').length,\n      SubmarinesAlive: ships.filter(ship => ship.shipType === 'Submarines').length,\n      attackedCount: battle.attacked.length,\n      attackedSlot: battle.attacked\n    });\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (home);\n\n//# sourceURL=webpack:///./controllers/home.js?");

/***/ }),

/***/ "./controllers/reset.js":
/*!******************************!*\
  !*** ./controllers/reset.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_Battle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/Battle */ \"./models/Battle.js\");\n\n\nconst reset = (req, res, next) => {\n  const battle = new _models_Battle__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n    ships: [],\n    attacked: []\n  });\n  battle.save(err => {\n    if (err) throw err;\n    res.json({\n      message: 'reset succesfully'\n    });\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (reset);\n\n//# sourceURL=webpack:///./controllers/reset.js?");

/***/ }),

/***/ "./models/Battle.js":
/*!**************************!*\
  !*** ./models/Battle.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Coordinates = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  x: Number,\n  y: Number\n}, {\n  _id: false\n});\nconst Attacked = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  x: Number,\n  y: Number,\n  hit: {\n    type: Boolean,\n    default: false\n  }\n}, {\n  _id: false\n});\nconst EachShip = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  shipType: String,\n  coordinates: [Coordinates],\n  length: Number\n}, {\n  _id: false\n});\nconst Battle = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  createdDate: {\n    type: Date,\n    default: Date.now\n  },\n  ships: [EachShip],\n  attacked: [Attacked]\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Battle', Battle));\n\n//# sourceURL=webpack:///./models/Battle.js?");

/***/ }),

/***/ "./models/History.js":
/*!***************************!*\
  !*** ./models/History.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Coordinates = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  x: Number,\n  y: Number\n}, {\n  _id: false\n});\nconst History = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  board_id: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId,\n  createdDate: {\n    type: Date,\n    default: Date.now\n  },\n  coordinates: [Coordinates],\n  message: String\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('History', History));\n\n//# sourceURL=webpack:///./models/History.js?");

/***/ }),

/***/ "./models/getDB.js":
/*!*************************!*\
  !*** ./models/getDB.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nlet db = null;\n\nconst getDB = () => {\n  if (!db) {\n    mongoose__WEBPACK_IMPORTED_MODULE_0__[\"connect\"](process.env.MONGODB_URI, {\n      useNewUrlParser: true\n    });\n    db = mongoose__WEBPACK_IMPORTED_MODULE_0__[\"connection\"];\n    return db;\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (getDB);\n\n//# sourceURL=webpack:///./models/getDB.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + (err.stack || err.message));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\n\t\t\t\t\t\t\t\"warning\",\n\t\t\t\t\t\t\t\"[HMR] Update failed: \" + (err.stack || err.message)\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?1000\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_addShip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/addShip */ \"./controllers/addShip.js\");\n/* harmony import */ var _controllers_attack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/attack */ \"./controllers/attack.js\");\n/* harmony import */ var _controllers_reset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/reset */ \"./controllers/reset.js\");\n/* harmony import */ var _controllers_home__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../controllers/home */ \"./controllers/home.js\");\n\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\n/* GET home page. */\n\nrouter.get('/', _controllers_home__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\nrouter.get('/reset', _controllers_reset__WEBPACK_IMPORTED_MODULE_3__[\"default\"]);\nrouter.post('/ship', _controllers_addShip__WEBPACK_IMPORTED_MODULE_1__[\"addShip\"]);\nrouter.post('/attack', _controllers_attack__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n/* harmony default export */ __webpack_exports__[\"default\"] = (router);\n\n//# sourceURL=webpack:///./routes/index.js?");

/***/ }),

/***/ 0:
/*!*********************************************!*\
  !*** multi webpack/hot/poll?1000 ./bin/www ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?1000 */\"./node_modules/webpack/hot/poll.js?1000\");\nmodule.exports = __webpack_require__(/*! ./bin/www */\"./bin/www.js\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"debug\");\n\n//# sourceURL=webpack:///external_%22debug%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });