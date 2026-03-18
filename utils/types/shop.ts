import type { Argument } from "./shopConfig"

export type Shop = {
    _id: string, // [auto generated]
    name: string,
    source: string,
    enabled: boolean,
    icon: string | null,
    country: string | null,
    lastUpdated: number | null,
    shopArguments: Argument[] | null
}
