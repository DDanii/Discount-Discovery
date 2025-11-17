export enum stepType {
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
    arguments?: argument[]
    steps: ParseStep[]
}

export interface argument {
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
    method: stepType.If
    /** Default value 'data' */
    data?: string
    steps: ParseStep[]
    elseSteps?: ParseStep[]
}


export interface FetchParameters {
    /**
     * Fetches the url in the data
     */
    method: stepType.Fetch
    headersSource?: string
}

export interface LiteralParameters {
    method: stepType.Literal
    data: string
    /**
     * Default value 'data'
     * Compatible with doted path
     */
    destination?: string
}

export interface SetPropParameters {
    method: stepType.SetProp
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
    method: stepType.ParseJSON
}

export interface ForEachParameters {
    method: stepType.ForEach
    source: string
    steps: ParseStep[]
}

export interface CreateArrayParameters {
    method: stepType.CreateArray
    name: string
}

export interface PushToArrayParameters {
    /**
     * Uses deepCopy 
     */
    method: stepType.PushToArray
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
    method: stepType.ParseHTML
}

export interface HTMLQuerySelectorParameters {
    method: stepType.HTMLQuerySelector
    all?: boolean
    selector: string
}

export interface ConcatParameters {
    method: stepType.Concat
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
    method: stepType.ToString
}

export interface HTMLCloneParameters {
    method: stepType.HTMLClone
    destination: string
}

export interface DeepCopyParameters {
    method: stepType.DeepCopy

}

export interface SliceParameters {
    method: stepType.Slice
    start: number
    end?: number
}

export interface SplitParameters {
    method: stepType.Split
    separator?: string
    limit?: number
}

export interface ReplaceParameters {
    method: stepType.Replace
    searchValue: string
    newValue: string
    all?: boolean
}

export interface SpreadParameters {
    /**
     * data = {...first, ...second}
     */
    method: stepType.Spread
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