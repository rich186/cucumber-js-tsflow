"use strict";

import { ContextType } from "./Types";

/**
 * Provides information about a running Cucumber scenario.
 */
export class ScenarioInfo {
    /**
     * Initializes the [[ScenarioInfo]] object.
     * 
     * @param scenarioTitle The string title of the currently running Cucumber scenario.
     * @param tags An array of strings representing the tags that are in scope for the currently
     * running Cucumber scenario.
     */
    constructor(public scenarioTitle: string, public tags: string[]) {
    }
}


/**
 * Provides context for the currently running Cucumber scenario.
 */
export interface ScenarioContext {
    /**
     * Gets information about the scenario.
     *
     */
    scenarioInfo: ScenarioInfo;
    
    /**
     * Gets or sets an arbitary object within the running scenario.
     */
    [key: string]: any;
}


export class ManagedScenarioContext implements ScenarioContext {
    private _scenarioInfo: ScenarioInfo;
    private _activeObjects = new WeakMap<any, any>();
    
    constructor(scenarioTitle: string, tags: string[]) {
        this._scenarioInfo = new ScenarioInfo(scenarioTitle, tags);
    }
    
    public get scenarioInfo(): ScenarioInfo {
        return this._scenarioInfo;
    }
    
    public getOrActivateBindingClass(targetPrototype: any, contextTypes: ContextType[]): any {
        return this.getOrActivateObject(targetPrototype, () => {
            return this.activateBindingClass(targetPrototype, contextTypes);
        });
    }
    
    public dispose(): void {
        
    }
    
    private activateBindingClass(targetPrototype: any, contextTypes: ContextType[]): any {
       let invokeBindingConstructor = (args: any[]): any => {
            switch (contextTypes.length) {
                case 0:  return new (<any>targetPrototype.constructor)();
                case 1:  return new (<any>targetPrototype.constructor)(args[0]);
                case 2:  return new (<any>targetPrototype.constructor)(args[0], args[1]);
                case 3:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2]);
                case 4:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3]);
                case 5:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3], args[4]);
                case 6:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                case 8:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
                case 9:  return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                case 10: return new (<any>targetPrototype.constructor)(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
            }
        };
       
        let contextObjects = _.map(contextTypes, (contextType) => this.getOrActivateObject(contextType.prototype, () => {
            return new contextType();
        }));
        
        return invokeBindingConstructor(contextObjects);
    }
    
    private getOrActivateObject(targetPrototype: any, activatorFunc: (...args: any[]) => any): any {
        let activeObject = this._activeObjects.get(targetPrototype);
        
        if (activeObject) return activeObject;
        
        activeObject = activatorFunc();
        
        this._activeObjects.set(targetPrototype, activeObject);
        
        return activeObject;
    }
}
