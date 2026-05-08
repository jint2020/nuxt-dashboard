<!--
 * @Author: jint jintang23@outlook.com
 * @Date: 2026-05-08 21:52:54
 * @LastEditors: jint jintang23@outlook.com
 * @LastEditTime: 2026-05-08 23:18:51
 * @FilePath: \nuxt-app\src\layouts\default.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { computed, ref } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(false);

const links = [
  [
    {
      label: "首页",
      icon: "i-lucide-house",
      to: "/",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "设置",
      icon: "i-lucide-settings",
      to: "/settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "通用",
          to: "/settings",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "权限配置",
          to: "/settings/permissions",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
      ],
    },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.flat(),
  },
]);
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
        <RouterLink
          to="/"
          class="flex items-center px-3 py-3 hover:bg-elevated/50 rounded-md transition-colors w-full"
          :class="collapsed ? 'justify-center px-0' : 'gap-2'"
        >
          <UIcon
            name="akar-icons:vue-fill"
            class="size-7 shrink-0 rounded bg-linear-to-tr from-primary to-secondary"
          />
          <span
            v-if="!collapsed"
            class="font-semibold text-lg tracking-wide"
          >工单系统</span>
        </RouterLink>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-default"
        />

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
