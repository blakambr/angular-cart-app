import { Injectable } from '@angular/core'

@Injectable()
export class GrowlerService {

    constructor() {/* ignore */}

    growl: (message: string, growlType: GrowlerMessageType) => number
}

export enum GrowlerMessageType {
  Success,
  Danger,
  Warning,
  Info
}