/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface JQuery {
   roundSlider(options?: any) : any;
}

declare module 'flatten';