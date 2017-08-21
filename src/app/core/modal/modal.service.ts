import { Injectable } from '@angular/core'

export interface IModalContent {
  header?: string
  body?: string
  cancelButtonText?: string
  OKButtonText?: string
  cancelButtonVisible?: boolean
}

@Injectable()
export class ModalService {

    constructor() {/* ignore */}

    show: (modalContent: IModalContent) => Promise<boolean>
    hide: () => void
}