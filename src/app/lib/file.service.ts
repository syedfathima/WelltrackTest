
import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
    private setting = {
        element: {
            dynamicDownload: null as HTMLElement
        }
    }

    dyanmicDownloadByHtmlTag(fileName: string, text: string) {
        text = JSON.stringify(text);
        if (!this.setting.element.dynamicDownload) {
            this.setting.element.dynamicDownload = document.createElement('a');
        }
        const element = this.setting.element.dynamicDownload;
        const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
        element.setAttribute('download', fileName);

        var event = new MouseEvent("click");
        element.dispatchEvent(event);
    }

}