import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class XmlBuddyService {

  parseXml(xmlString: string): Promise<any> {
    return xml2js.parseStringPromise(xmlString);
  }

  buildXml(jsonObject: any): string {
    const builder = new xml2js.Builder();
    return builder.buildObject(jsonObject);
  }
}
