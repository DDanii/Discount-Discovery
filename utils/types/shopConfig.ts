export enum StepType {
    If = "If",
    Fetch = "Fetch",
    Slice = "Slice",
    Split = "Split",
    Concat = "Concat",
    Spread = "Spread",
    SetProp = "SetProp",
    Literal = "Literal",
    ForEach = "ForEach",
    Replace = "Replace",
    ToString = "ToString",
    DeepCopy = "DeepCopy",
    ParseHTML = "ParseHTML",
    ParseJSON = "ParseJSON",
    HTMLClone = "HTMLClone",
    CreateArray = "CreateArray",
    PushToArray = "PushToArray",
    HTMLQuerySelector = "HTMLQuerySelector"
    
}

export interface ShopConfig {
    /** If true, will automatically correct the year
     * around the start of a new year.
     * example if the date is 2025.12.23 and end date is 2025.1.5 -> 2026.1.5
     * Default value: false
     */
    autoCorrectYears?: boolean

    name: string
    /** Cron defined time when to run the steps
    *  Default 6 oclock in the morning
    */
    cron?: string
    /** Timezone for the cron job */
    timezone?: string
    /** Shop icon url */
    icon?: string
    /** Custom input from user to be used in steps */
    arguments?: Argument[]
    steps: ParseStep[]
}

export interface Argument {
    /** Unique identifier determines the property the user value will be in */
    argument: string
    /** Label to show the user at the input field */
    label: string
    /** If true, the user must provide a value */
    required?: boolean
    defaultValue?: string
}

export interface ParseStep {
    stepParameters: FetchParameters | LiteralParameters | 
    SetPropParameters | ParseJSONParameters | ForEachParameters |
    CreateArrayParameters | PushToArrayParameters | 
    ParseHTMLParameters | 
    HTMLQuerySelectorParameters | ConcatParameters |
    ToStringParameters | HTMLCloneParameters | DeepCopyParameters |
    SliceParameters | SplitParameters | ReplaceParameters |
    SpreadParameters | IfParameters
}

export interface IfParameters {
    method: StepType.If
    /** Default value 'data' */
    data?: string
    steps: ParseStep[]
    elseSteps?: ParseStep[]
}


export interface FetchParameters {
    /**
     * Fetches the url in the data
     */
    method: StepType.Fetch
    /**
     * Expects the source for an array with key value pairs
     * example data: data.Accept = json
     */
    headersSource?: string
}

export interface LiteralParameters {
    method: StepType.Literal
    data: string
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    destination?: string
}

export interface SetPropParameters {
    method: StepType.SetProp
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    source?: string
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    destination?: string
}

export interface ParseJSONParameters {
    method: StepType.ParseJSON
}

export interface ForEachParameters {
    method: StepType.ForEach
    source: string
    steps: ParseStep[]
}

export interface CreateArrayParameters {
    method: StepType.CreateArray
    name: string
}

export interface PushToArrayParameters {
    /**
     * Uses deepCopy 
     */
    method: StepType.PushToArray
    array: string
        /**
     * Default value 'data'
     * Compatible with doted path
     */
    data?: string
}

export interface ParseHTMLParameters {
    /**
     * The output HTMLElement can't be used in methods using deepCopy because it contains circular structure
     */
    method: StepType.ParseHTML
}

export interface HTMLQuerySelectorParameters {
    method: StepType.HTMLQuerySelector
    all?: boolean
    selector: string
}

export interface ConcatParameters {
    method: StepType.Concat
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    first?: string
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    second?: string
}

export interface ToStringParameters {
    method: StepType.ToString
}

export interface HTMLCloneParameters {
    method: StepType.HTMLClone
    destination: string
}

export interface DeepCopyParameters {
    method: StepType.DeepCopy

}

export interface SliceParameters {
    method: StepType.Slice
    start: number
    end?: number
}

export interface SplitParameters {
    method: StepType.Split
    separator?: string
    limit?: number
}

export interface ReplaceParameters {
    method: StepType.Replace
    searchValue: string
    newValue: string
    all?: boolean
}

export interface SpreadParameters {
    /**
     * data = {...first, ...second}
     */
    method: StepType.Spread
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    first?: string
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    second?: string
}