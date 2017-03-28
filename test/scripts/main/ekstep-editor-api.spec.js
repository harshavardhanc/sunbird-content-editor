describe("Ekstep editor test", function() {
    beforeAll(function() {
        var corePlugins = {
            "org.ekstep.stage": "1.0",
            "org.ekstep.copypaste": "1.0"
        };

        // test plugins
        EkstepEditor.config.plugins = {
            "org.ekstep.test1": "1.0",
            "org.ekstep.test2": "1.0",
            "org.ekstep.test3": "1.0",
            "org.ekstep.test4": "1.0",
            "org.ekstep.test5": "1.0",
            "org.ekstep.test6": "1.0"
        };

        //load core plugins from s3
        EkstepEditorAPI.setConfig('pluginRepo', "https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/content-plugins");
        _.forIn(corePlugins, function(value, key) {
            EkstepEditor.pluginManager.loadPlugin(key, value);
        });

        EkstepEditor.publishedRepo.basePath = "base/test/data/published";
        EkstepEditorAPI.setConfig('pluginRepo', "base/test/data/published");
        EkstepEditor.hostRepo.basePath = "base/test/data/hosted";
        EkstepEditor.draftRepo.basePath = "base/test/data/draft";
        EkstepEditor.hostRepo.connected = true;

        EkstepEditor.stageManager.canvas = canvas = new fabric.Canvas('canvas', { backgroundColor: "#FFFFFF", preserveObjectStacking: true, width: 720, height: 405 });
        EkstepEditor.stageManager.registerEvents();
    });

    afterAll(function() {
        EkstepEditor.pluginManager.cleanUp();
        EkstepEditor.stageManager.cleanUp();
    });

    it('should load plugin', function() {
        spyOn(EkstepEditorAPI, "loadPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "loadPlugin").and.callThrough();
        EkstepEditorAPI.loadPlugin("org.ekstep.test1", "1.0");
        expect(EkstepEditorAPI.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadPlugin).toHaveBeenCalledWith("org.ekstep.test1", "1.0");
    });

    it('should get plugin repo', function() {
        spyOn(EkstepEditorAPI, "getPluginRepo").and.callThrough();
        var returnValue = EkstepEditorAPI.getPluginRepo();
        expect(returnValue).toBe(EkstepEditor.config.pluginRepo);
        expect(EkstepEditorAPI.getPluginRepo).toHaveBeenCalled();
    });

    it('should call loadAndInitPlugin', function() {
        spyOn(EkstepEditorAPI, "loadAndInitPlugin").and.callThrough();
        spyOn(EkstepEditor.pluginManager, "loadAndInitPlugin").and.callThrough();
        EkstepEditorAPI.loadAndInitPlugin("org.ekstep.test1", "1.0");
        var returnValue = EkstepEditor.pluginManager.loadAndInitPlugin("rg.ekstep.test1-1.0");
        expect(returnValue).toBe(1);
        expect(EkstepEditorAPI.loadAndInitPlugin).toHaveBeenCalled();
        expect(EkstepEditor.pluginManager.loadAndInitPlugin).toHaveBeenCalled();
    });

    it("should load help for plugin", function(done) {
        spyOn(EkstepEditorAPI, "loadPluginResource").and.callThrough();
        EkstepEditorAPI.loadPluginResource("org.ekstep.test2", "1.0", "editor/help.md", "text", function(err, res) {
            done();
        })
    });

    it('should return canvas for rendering on the editor', function() {
        spyOn(EkstepEditorAPI, "getCanvas").and.callThrough();
        var returnValue = EkstepEditorAPI.getCanvas();
        expect(EkstepEditorAPI.getCanvas).toHaveBeenCalled();
        expect(returnValue).toBeDefined();
    });

    it('should return respective services', function() {
        spyOn(EkstepEditorAPI, "getService").and.callThrough();
        expect(EkstepEditorAPI.getService("popup")).toBe(EkstepEditor.popupService);
        expect(EkstepEditorAPI.getService("content")).toBe(EkstepEditor.contentService);
        expect(EkstepEditorAPI.getService("assessment")).toBe(EkstepEditor.assessmentService);
        expect(EkstepEditorAPI.getService("language")).toBe(EkstepEditor.languageService);
        expect(EkstepEditorAPI.getService("search")).toBe(EkstepEditor.searchService);
        expect(EkstepEditorAPI.getService("meta")).toBe(EkstepEditor.metaService);
        expect(EkstepEditorAPI.getService("asset")).toBe(EkstepEditor.assetService);
        expect(EkstepEditorAPI.getService("telemetry")).toBe(EkstepEditor.telemetryService);
    });

    it('should call updateContextMenu', function() {
        spyOn(EkstepEditorAPI, "updateContextMenus").and.callThrough();
        EkstepEditorAPI.updateContextMenus([{ id: 'paste', state: 'SHOW', data: {} }]);
        expect(EkstepEditorAPI.updateContextMenus).toHaveBeenCalled();
        expect(EkstepEditor.toolbarManager.contextMenuItems.length).toEqual(3);
        expect(EkstepEditor.toolbarManager.contextMenuItems[0].id).toBe("copy");
    });

    it('should set contentid in config ', function() {
        spyOn(EkstepEditorAPI, "setConfig").and.callThrough();
        EkstepEditorAPI.setConfig('contentId', 'do_1122069161408757761139');
        expect(EkstepEditorAPI.setConfig).toHaveBeenCalled();
    });

    it('should return all config values', function() {
        spyOn(EkstepEditorAPI, "getAllConfig").and.callThrough();
        EkstepEditorAPI.setConfig('contentId', 'do_1122069161408757761139');
        var returnValue = EkstepEditorAPI.getAllConfig();
        expect(EkstepEditorAPI.getAllConfig).toHaveBeenCalled();
        expect(returnValue.contentId).toEqual('do_1122069161408757761139');
    });

    it('should return all global context values', function() {
        spyOn(EkstepEditorAPI, "getAllContext").and.callThrough();
        EkstepEditorAPI.setContext('contentId', 'do_1122069161408757761139');
        var returnValue = EkstepEditorAPI.getAllContext();
        expect(EkstepEditorAPI.getAllContext).toHaveBeenCalled();
        expect(returnValue.contentId).toEqual('do_1122069161408757761139');
    });

    it('should remove event listener', function() {
        spyOn(EkstepEditorAPI, "addEventListener").and.callThrough();
        spyOn(EkstepEditorAPI, "removeEventListener").and.callThrough();
        EkstepEditorAPI.addEventListener("stage:delete", function(){}, undefined);
        EkstepEditorAPI.removeEventListener("stage:delete", function(){}, undefined);
        expect(EkstepEditorAPI.removeEventListener).toHaveBeenCalled();
        expect(EkstepEditorAPI.addEventListener).toHaveBeenCalled();
    });

    describe('when stage plugin instantiated', function() {
        var stagePlugin = 'org.ekstep.stage',
            test1Plugin = 'org.ekstep.test1',
            stageInstance,
            test1pluginInstance,
            stageECML,
            test1ECML;
        var callbackInvoked = false;

        beforeAll(function() {
            stageECML = {
                "config": {
                    "__cdata": '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"genieControls":true,"instructions":""}'
                },
                "param": {
                    "name": "next",
                    "value": "splash"
                },
                "x": "0",
                "y": "0",
                "w": "100",
                "h": "100",
                "id": "d2646852-8114-483b-b5e1-29e604b69cac",
                "rotate": ""
            };
            test1ECML = {
                "config": {
                    "__cdata": '{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"color":"#FFFF00"}',
                },
                "type": "rect",
                "x": "10",
                "y": "20",
                "fill": "#FFFF00",
                "w": "14",
                "h": "25",
                "stroke": "rgba(255, 255, 255, 0)",
                "strokeWidth": "1",
                "opacity": "1",
                "rotate": "0",
                "z-index": "0",
                "id": "2113ee4e-b090-458e-a0b0-5ee6668cb6dc"
            };
            stageInstance = EkstepEditorAPI.instantiatePlugin(stagePlugin, stageECML);
            stageInstance.setCanvas(canvas);
            spyOn(EkstepEditorAPI, 'getAngularScope').and.returnValue({ enableSave: function() {}, $safeApply: function() {} });
            spyOn(EkstepEditorAPI, 'dispatchEvent');

            test1pluginInstance = EkstepEditorAPI.instantiatePlugin(test1Plugin, test1ECML, stageInstance, {
                added: function(instance, options, event) {
                    callbackInvoked = true;
                }
            }); 
        });

        afterAll(function() {
            EkstepEditor.pluginManager.cleanUp();
            EkstepEditor.stageManager.cleanUp();
        });

        it('should retrns the current stage', function() {
            spyOn(EkstepEditorAPI, "getCurrentStage").and.callThrough();
            var returnValue = EkstepEditorAPI.getCurrentStage();
            expect(EkstepEditorAPI.getCurrentStage).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should retrns the specified stage', function() {
            spyOn(EkstepEditorAPI, "getStage").and.callThrough();
            var returnValue = EkstepEditorAPI.getStage(stageInstance.id);
            expect(EkstepEditorAPI.getStage).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should return currently selected active object on the canvas', function() {
            spyOn(EkstepEditorAPI, "getCurrentObject").and.callThrough();
            spyOn(EkstepEditorAPI, "getPluginInstance").and.callThrough();
            var currentObject = EkstepEditorAPI.getCurrentObject();
            var currentObject = EkstepEditorAPI.getPluginInstance(currentObject.id);
            expect(EkstepEditorAPI.getCurrentObject).toHaveBeenCalled();
            expect(EkstepEditorAPI.getPluginInstance).toHaveBeenCalled();
            expect(currentObject).toBeDefined();
        });

        it('should return false there is no selected object on the canvas', function() {
            spyOn(EkstepEditorAPI, "getCurrentObject").and.callThrough();
            EkstepEditor.stageManager.canvas.deactivateAll().renderAll();
            var currentObject = EkstepEditorAPI.getCurrentObject();
            expect(EkstepEditorAPI.getCurrentObject).toHaveBeenCalled();
        });

        it('should retrns current group', function() {
            spyOn(EkstepEditorAPI, "getEditorGroup").and.callThrough();
            var returnValue = EkstepEditorAPI.getEditorGroup();
            expect(EkstepEditorAPI.getEditorGroup).toHaveBeenCalled();
            expect(returnValue).toBe(null);
        });

        it('should retrns current object on the fabric canvas', function() {
            spyOn(EkstepEditorAPI, "getEditorObject").and.callThrough();
            var returnValue = EkstepEditorAPI.getEditorObject();
            expect(EkstepEditorAPI.getEditorObject).toHaveBeenCalled();
            expect(returnValue).toBeDefined();
        });

        it('should refresh the canvas', function() {
            spyOn(EkstepEditorAPI, "render").and.callThrough();
            EkstepEditorAPI.render();
            expect(EkstepEditorAPI.render).toHaveBeenCalled();
        });

        it('should return plugin instance', function() {
            spyOn(EkstepEditorAPI, "getPlugin").and.callThrough();
            var pluginid = EkstepEditorAPI.getPlugin("org.ekstep.test1");
            expect(EkstepEditorAPI.getPlugin).toHaveBeenCalled();
            expect(pluginid).toBeDefined();
        });

        it('should adds a plugin instance to the manager', function() {
            spyOn(EkstepEditorAPI, "addPluginInstance").and.callThrough();
            EkstepEditorAPI.addPluginInstance(test1pluginInstance);
            expect(EkstepEditorAPI.addPluginInstance).toHaveBeenCalled();
            expect(Object.keys(EkstepEditor.pluginManager.pluginInstances).length).toEqual(2);
        });

        it("should remove plugin instance by calling removePluginInstance", function() {
            var PIlength = Object.keys(EkstepEditor.pluginManager.pluginInstances).length;
            var lastPI = EkstepEditor.pluginManager.pluginInstances[Object.keys(EkstepEditor.pluginManager.pluginInstances)[0]];
            spyOn(EkstepEditorAPI, "removePluginInstance").and.callThrough();
            EkstepEditorAPI.removePluginInstance(lastPI);
            expect(EkstepEditorAPI.removePluginInstance).toHaveBeenCalled();
            expect(Object.keys(EkstepEditor.pluginManager.pluginInstances).length).not.toEqual(PIlength);
        });

        it('should get all stages', function() {
            spyOn(EkstepEditorAPI, "getAllStages").and.callThrough();
            EkstepEditorAPI.getAllStages();
            expect(EkstepEditorAPI.getAllStages).toHaveBeenCalled();
            expect(EkstepEditor.stageManager.stages.length).toEqual(1);
        });

        it('should copy of the given plugin object', function() {
            spyOn(EkstepEditorAPI, "cloneInstance").and.callThrough();
            spyOn(EkstepEditorAPI, "instantiatePlugin").and.callThrough();
            EkstepEditorAPI.cloneInstance(test1pluginInstance);
            expect(EkstepEditorAPI.cloneInstance).toHaveBeenCalled();
            expect(EkstepEditorAPI.instantiatePlugin).toHaveBeenCalled();
            expect(test1pluginInstance.parent.id).toEqual(EkstepEditorAPI.getCurrentStage().id);
        });

        it('should call getStagePluginInstances without includeTypes', function() {
            spyOn(EkstepEditorAPI, "getStagePluginInstances").and.callThrough();
            spyOn(EkstepEditorAPI, "getStage").and.callThrough()
            var returnValue = EkstepEditorAPI.getStagePluginInstances(EkstepEditorAPI.getCurrentStage().id, null, ['org.ekstep.audio'], [EkstepEditorAPI.getCurrentObject().id]);
            expect(returnValue.length).toBeGreaterThan(0);
            expect(EkstepEditorAPI.getStage).toHaveBeenCalled();
            expect(EkstepEditorAPI.getStage).toHaveBeenCalledWith(EkstepEditorAPI.getCurrentStage().id);
        });

        it('should call getStagePluginInstances with includeTypes', function() {
            spyOn(EkstepEditorAPI, "getStagePluginInstances").and.callThrough();
            spyOn(EkstepEditorAPI, "getStage").and.callThrough()
            var returnValue = EkstepEditorAPI.getStagePluginInstances(EkstepEditorAPI.getCurrentStage().id, ['org.ekstep.test2'], ['org.ekstep.audio'], [EkstepEditorAPI.getCurrentObject().id]);
            expect(returnValue.length).toBe(0);
            expect(EkstepEditorAPI.getStage).toHaveBeenCalled();
            expect(EkstepEditorAPI.getStage).toHaveBeenCalledWith(EkstepEditorAPI.getCurrentStage().id);
        });

        it('should call getStagePluginInstances without excludeTypes and excludeIds', function() {
            spyOn(EkstepEditorAPI, "getStagePluginInstances").and.callThrough();
            spyOn(EkstepEditorAPI, "getStage").and.callThrough()
            var returnValue = EkstepEditorAPI.getStagePluginInstances(EkstepEditorAPI.getCurrentStage().id, ['org.ekstep.test2']);
            expect(returnValue.length).toBe(0);
            expect(EkstepEditorAPI.getStage).toHaveBeenCalled();
            expect(EkstepEditorAPI.getStage).toHaveBeenCalledWith(EkstepEditorAPI.getCurrentStage().id);
        });

        it('should call getPluginInstances without includeTypes', function() {
            spyOn(EkstepEditorAPI, "getPluginInstances").and.callThrough();
            var returnValue = EkstepEditorAPI.getPluginInstances(null, ['org.ekstep.audio'], [EkstepEditorAPI.getCurrentObject().id]);
            expect(returnValue.length).toBeGreaterThan(0);
        });

        it('should call getPluginInstances without includeTypes', function() {
            spyOn(EkstepEditorAPI, "getPluginInstances").and.callThrough();
            var returnValue = EkstepEditorAPI.getPluginInstances(['org.ekstep.test1'], ['org.ekstep.audio'], [EkstepEditorAPI.getCurrentObject().id]);
            expect(returnValue.length).toBe(1);
        });

        it('should call getPluginInstances without excludeTypes and excludeIds', function() {
            spyOn(EkstepEditorAPI, "getPluginInstances").and.callThrough();
            var returnValue = EkstepEditorAPI.getPluginInstances(['org.ekstep.test1']);
            expect(returnValue.length).toBeGreaterThan(0);
        });

        it("should return help.md path by calling resolvePluginResource", function() {
            spyOn(EkstepEditorAPI, "resolvePluginResource").and.callThrough();
            spyOn(EkstepEditor.pluginManager, "resolvePluginResource").and.callThrough();
            var src = EkstepEditorAPI.resolvePluginResource("org.ekstep.test2", "1.0", "editor/help.md");
            expect(EkstepEditor.pluginManager.resolvePluginResource).toHaveBeenCalled();
            expect(src).toBe("base/test/data/published/org.ekstep.test2-1.0/editor/help.md");
        });

        it("should return media object", function() {
            var audio = '{"asset" : "do_10095959","assetMedia" : {"id" : "do_10095959", "name" : "test ","preload" : "true","src : https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/1475505176audio_1475505049712.mp3","type" : "audio"}}';
            EkstepEditor.mediaManager.mediaMap["do_10095959"] = audio;
            spyOn(EkstepEditorAPI, "getMedia").and.callThrough();
            var returnValue = EkstepEditorAPI.getMedia("do_10095959");
            expect(EkstepEditorAPI.getMedia).toHaveBeenCalled();
            expect(returnValue).toEqual(audio);
        });

        it("should return the plugins group array", function() {
            var canvas = EkstepEditor.stageManager.canvas,
                group = new fabric.Group();
            group.add(EkstepEditor.stageManager.canvas.getObjects()[0]);
            group.add(EkstepEditor.stageManager.canvas.getObjects()[1]);
            canvas.setActiveGroup(group);
            canvas.add(group);
            spyOn(EkstepEditorAPI, "getCurrentGroup").and.callThrough();
            expect(EkstepEditorAPI.getCurrentGroup().length).toEqual(2);
        });

        it('should override functions dynamically while instantiating a plugin', function() {
            test1pluginInstance.added();
            expect(callbackInvoked).toBe(true);
        })
    });


});