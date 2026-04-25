<script setup lang="ts">
import { useDBLoggedIn, useDBUrlIsSet } from '~/composable/states';
import { DB, DBLocation, DBName } from '~/database/database';

const loggedIn = useDBLoggedIn()

const showPassword = ref(false)
const password = ref('')
const user = ref('')
const remoteDB = ref(null as DB | null)
const url = ref(localStorage.getItem(dbRemoteUrl_name))
const isUrlSet = useDBUrlIsSet()

async function initialize() {
    remoteDB.value = null
    user.value = ''

    if (!isUrlSet.value) return

    remoteDB.value = new DB(DBLocation.remote, DBName.shop)
    loggedIn.value = await remoteDB.value.isRemoteLoggedIn()
    user.value = await remoteDB.value.getUserName() ?? ''
}
initialize()

async function onLogIn() {
    if (!user.value || !remoteDB.value) return

    try {

        await remoteDB.value.logIn(user.value, password.value).then((response) => {
            if (!response.ok) useToast().error({ message: response.toString() })
            initialize()
        })
    } catch (error: any) {
        let text = error.message ?? error
        
        useToast().error({ message: text, color: "#dc2626" })
    }
}

function onLogOut() {
    remoteDB.value?.logOut().then((response) => {
        if (!response.ok) useToast().error({ message: response.toString(), color: "#dc2626" })
        initialize()
    })
}

function urlUnset() {
    DB.setRemoteUrl('')
    onLogOut()
}

function urlSet() {
    DB.setRemoteUrl(url.value)
    localStorage.setItem(dbRemoteUrl_name, url.value ?? '')
    initialize()
}

</script>
<template>
    <div class="rounded-xl border-2 m-2 overflow-hidden min-h-fit flex flex-col">
        <div class="flex justify-center">
            <IconCouch class="fill-red-600" />
            <IconDatabase />
        </div>
        <div class="flex grow items-center border-t-2">
            <div class="h-full w-full border-r-2 flex items-center">
                <IconUrl class="ml-2 min-h-fit min-w-fit" />
                <text v-if="isUrlSet" class="grow m-2 text-wrap overflow-hidden">{{ url }}</text>
                <input v-else type="text" :disabled="isUrlSet" v-model="url" class="bg-black border-2 h-8 m-2" />
            </div>
            <button v-if="isUrlSet" @click="urlUnset" class="h-full">
                <IconLogout />
            </button>
            <button v-else @click="urlSet" class="h-full">
                <IconLogin />
            </button>
        </div>
        
        <div v-if="isUrlSet" class="flex grow items-center border-t-2">
            <div class="grow border-r-2 h-full flex flex-col justify-center">
                <div class="flex p-2">
                    <IconUser class="mr-2" />
                    <input v-if="!loggedIn" type="text" required name="user" v-model="user"
                        class="bg-black border-2 " />
                    <text v-else>{{ user }}</text>
                </div>
                <div v-if="!loggedIn" class="flex p-2">
                    <button @click="showPassword = !showPassword" class="mr-2">
                        <IconEye v-if="showPassword" />
                        <IconEyeOff v-else />
                    </button>
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" class="bg-black border-2 " />
                </div>
            </div>
            <button v-if="!loggedIn" type="submit" @click="onLogIn" class="h-full">
                <IconLogin />
            </button>
            <button v-else type="submit" @click.prevent="onLogOut" class="h-full">
                <IconLogout />
            </button>
        </div>
    </div>
</template>