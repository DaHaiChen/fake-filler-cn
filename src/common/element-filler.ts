import dataGenerator from './data-generator'
import type { Options } from '../types'
import { fillAllOrchestrated, fillFormOrchestrated, fillSingleOrchestrated } from '../fill/orchestrator'
import { NativeControls } from '../fill/native'
import type { ElementFillerSession } from '../fill/types'

/**
 * 对外入口：组合 `fill/orchestrator` 与 `fill/native`，供 content-script 与选项页更新后的实例化使用。
 */
export class ElementFiller {
    private readonly session: ElementFillerSession
    private readonly native: NativeControls

    constructor(options: Options) {
        this.session = {
            options,
            generator: dataGenerator,
            previousValue: '',
            previousPassword: '',
            previousUsername: '',
            previousFirstName: '',
            previousLastName: '',
        }
        this.native = new NativeControls(this.session)
    }

    fillAll(container: Document | HTMLElement): void {
        fillAllOrchestrated(container, this.session, this.native)
    }

    fillForm(element: HTMLElement): void {
        fillFormOrchestrated(element, this.session, this.native)
    }

    fillSingle(element: HTMLElement): void {
        fillSingleOrchestrated(element, this.session, this.native)
    }
}

export default ElementFiller
