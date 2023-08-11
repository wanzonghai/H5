"use strict";
exports.__esModule = true;
var csharp_1 = require("csharp");
var CodeWriter_1 = require("./CodeWriter");
function genCode(handler) {
    var settings = handler.project.GetSettings("Publish").codeGeneration;
    var codePkgName = handler.ToFilename(handler.pkg.name); //convert chinese to pinyin, remove special chars etc.
    var exportCodePath = handler.exportCodePath + '/' + codePkgName;
    var namespaceName = codePkgName;
    var ns = "fgui";
    var isThree = handler.project.type == csharp_1.FairyEditor.ProjectType.ThreeJS;
    if (settings.packageName)
        namespaceName = settings.packageName + '.' + namespaceName;
   
    //CollectClasses(stripeMemeber, stripeClass, fguiNamespace)
    var classes = handler.CollectClasses(settings.ignoreNoname, settings.ignoreNoname, ns);
    handler.SetupCodeFolder(exportCodePath, "ts"); //check if target folder exists, and delete old files
    var getMemberByName = settings.getMemberByName;
    var classCnt = classes.Count;
    var writer = new CodeWriter_1["default"]({ blockFromNewLine: false, usingTabs: true });
    for (var i = 0; i < classCnt; i++) {
        var classInfo = classes.get_Item(i);
        var members = classInfo.members;
        var references = classInfo.references;
        writer.reset();
        var refCount = references.Count;
        if (refCount > 0) {
            for (var j = 0; j < refCount; j++) {
                var ref = references.get_Item(j);
                writer.writeln('import %s from "./%s";', ref, ref);
            }
            writer.writeln();
        }
        if (isThree) {
            writer.writeln('import * as fgui from "fairygui-three";');
            if (refCount == 0)
                writer.writeln();
        }
        writer.writeln('export default class %s extends %s', classInfo.className, classInfo.superClassName);
        writer.startBlock();
        writer.writeln();
        var memberCnt = members.Count;
        for (var j = 0; j < memberCnt; j++) {
            var memberInfo = members.get_Item(j);
            writer.writeln('public %s:%s;', memberInfo.varName, memberInfo.type);
        }
        writer.writeln('public static URL:string = "ui://%s%s";', handler.pkg.id, classInfo.resId);
        writer.writeln();
        writer.writeln('public static createInstance():%s', classInfo.className);
        writer.startBlock();
        writer.writeln('return <%s>(%s.UIPackage.createObject("%s", "%s"));', classInfo.className, ns, handler.pkg.name, classInfo.resName);
        writer.endBlock();
        writer.writeln();
        writer.writeln('protected onConstruct():void');
        writer.startBlock();
        for (var j = 0; j < memberCnt; j++) {
            var memberInfo = members.get_Item(j);
            if (memberInfo.group == 0) {
                if (getMemberByName)
                    writer.writeln('this.%s = <%s>(this.getChild("%s"));', memberInfo.varName, memberInfo.type, memberInfo.name);
                else
                    writer.writeln('this.%s = <%s>(this.getChildAt(%s));', memberInfo.varName, memberInfo.type, memberInfo.index);
            }
            else if (memberInfo.group == 1) {
                if (getMemberByName)
                    writer.writeln('this.%s = this.getController("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.getControllerAt(%s);', memberInfo.varName, memberInfo.index);
            }
            else {
                if (getMemberByName)
                    writer.writeln('this.%s = this.getTransition("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.getTransitionAt(%s);', memberInfo.varName, memberInfo.index);
            }
        }
        writer.endBlock();
        writer.endBlock(); //class
        writer.save(exportCodePath + '/' + classInfo.className + '.ts');
    }
    writer.reset();
    var binderName = codePkgName + 'Binder';
    for (var i = 0; i < classCnt; i++) {
        var classInfo = classes.get_Item(i);
        writer.writeln('import %s from "./%s";', classInfo.className, classInfo.className);
    }
    if (isThree) {
        writer.writeln('import * as fgui from "fairygui-three";');
        writer.writeln();
    }
    writer.writeln();
    writer.writeln('export default class %s', binderName);
    writer.startBlock();
    writer.writeln('public static bindAll():void');
    writer.startBlock();
    for (var i = 0; i < classCnt; i++) {
        var classInfo = classes.get_Item(i);
        writer.writeln('%s.UIObjectFactory.setExtension(%s.URL, %s);', ns, classInfo.className, classInfo.className);
    }
    writer.endBlock(); //bindall
    writer.endBlock(); //class
    writer.save(exportCodePath + '/' + binderName + '.ts');
}
exports.genCode = genCode;
