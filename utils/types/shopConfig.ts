export enum stepType {
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
    ParallelProcess = "ParallelProcess",
    HTMLQuerySelector = "HTMLQuerySelector"
    
}

export interface ShopConfig {
    steps: ParseStep[]
}

export interface ParseStep {
    stepParameters: FetchParameters | LiteralParameters | 
    SetPropParameters | ParseJSONParameters | ForEachParameters |
    CreateArrayParameters | PushToArrayParameters | 
    ParseHTMLParameters | ParallelProcessParameters | 
    HTMLQuerySelectorParameters | ConcatParameters |
    ToStringParameters | HTMLCloneParameters | DeepCopyParameters |
    SliceParameters | SplitParameters | ReplaceParameters |
    SpreadParameters
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
     */
    destination?: string
}

export interface SetPropParameters {
    method: stepType.SetProp
    /**
     * Default value 'data'
     */
    source?: string
    sourceProp?: string | number
    /**
     * Default value 'data'
     */
    destination?: string
    destinationProp?: string
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
    data: string
}

export interface ParseHTMLParameters {
    /**
     * The output HTMLElement can't be used in methods using deepCopy because it contains circular structure
     */
    method: stepType.ParseHTML
}

export interface ParallelProcessParameters {
    /**
     * Untested
     * Uses deepCopy 
     */
    method: stepType.ParallelProcess
    steps: ParseStep[]
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
     */
    first?: string
    /**
     * Default value 'data'
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
     */
    first?: string
    /**
     * Default value 'data'
     */
    second?: string
}