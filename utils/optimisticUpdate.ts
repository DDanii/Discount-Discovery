import { deepCopy } from "./utils";

export type updateFunction = {
    (): void;
}

let previousData = {} as any

export default async function optimisticUpdate(path: string, body: any, key: string, update: updateFunction) {
    await $fetch(path, {
        method: "POST",
        body: body,
        onRequest() {
            const { data } = useNuxtData(key)
            previousData[key] = deepCopy(data.value)

            update()

            data.value = [...data.value ?? []]
        },
        async onResponse() {
            await refreshNuxtData(key)
        },
        onResponseError() {
            errorHandling(key)
        },
        onRequestError() {
            errorHandling(key)
        }
    }).catch((error) => {
        console.error("Error updating preference:", error);
    });
}

function errorHandling(key: string) {
    const { data } = useNuxtData(key)
    data.value = deepCopy(previousData[key])
    useToast().error({
        image: "noSave.png",
        icon: '',
        closeOnClick: true,
        displayMode: 2,
        backgroundColor: 'red'
    })
}
