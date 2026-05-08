<!--
 * @Author: jint jintang23@outlook.com
 * @Date: 2026-05-08 21:56:10
 * @LastEditors: jint jintang23@outlook.com
 * @LastEditTime: 2026-05-08 22:01:19
 * @FilePath: \nuxt-app\src\pages\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="首页">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold tracking-tight">
          欢迎来到工单系统！
        </h1>
      </div>
    </template>
  </UDashboardPanel>
</template>
