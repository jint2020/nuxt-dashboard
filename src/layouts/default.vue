<!--
 * @Author: jint jintang23@outlook.com
 * @Date: 2026-05-08 21:52:54
 * @LastEditors: jint jintang23@outlook.com
 * @LastEditTime: 2026-05-08 22:36:02
 * @FilePath: \nuxt-app\src\layouts\default.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [[{
  label: '首页',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}])
</script>

<template>
  <UDashboardGroup unit="rem" storage="local">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <RouterLink to="/" class="flex items-center gap-2 px-4 py-3 hover:bg-elevated/50 rounded-md transition-colors" :class="{ 'justify-center px-2': collapsed }">
          <UIcon name="akar-icons:vue-fill" class="size-7 shrink-0 rounded bg-linear-to-tr from-primary to-secondary" />
          <span v-if="!collapsed" class="font-semibold text-lg tracking-wide">工单系统</span>
        </RouterLink>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <RouterView />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
