<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()
const appConfig = useAppConfig()

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'] as const
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone'] as const
</script>

<template>
  <!-- 外观 -->
  <UPageCard title="外观" description="选择界面明暗模式。">
    <div class="flex items-center gap-3">
      <UButton
        :label="'浅色'"
        :color="colorMode === 'light' ? 'primary' : 'neutral'"
        :variant="colorMode === 'light' ? 'solid' : 'outline'"
        icon="i-lucide-sun"
        @click="colorMode = 'light'"
      />
      <UButton
        :label="'深色'"
        :color="colorMode === 'dark' ? 'primary' : 'neutral'"
        :variant="colorMode === 'dark' ? 'solid' : 'outline'"
        icon="i-lucide-moon"
        @click="colorMode = 'dark'"
      />
    </div>
  </UPageCard>

  <!-- 主色 -->
  <UPageCard title="主题色" description="选择界面的主色调。">
    <div class="grid grid-cols-8 sm:grid-cols-9 lg:grid-cols-17 gap-2">
      <button
        v-for="color in colors"
        :key="color"
        class="size-8 rounded-md ring-1 ring-inset ring-border cursor-pointer transition-shadow"
        :class="appConfig.ui.colors.primary === color ? 'ring-2 ring-primary shadow-sm' : 'hover:ring-2'"
        :style="{ backgroundColor: `var(--color-${color}-500)` }"
        :title="color"
        @click="appConfig.ui.colors.primary = color"
      />
    </div>
  </UPageCard>

  <!-- 中性色 -->
  <UPageCard title="中性色" description="选择界面的中性色调。">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="neutral in neutrals"
        :key="neutral"
        class="size-8 rounded-md ring-1 ring-inset ring-border cursor-pointer transition-shadow"
        :class="appConfig.ui.colors.neutral === neutral ? 'ring-2 ring-primary shadow-sm' : 'hover:ring-2'"
        :style="{ backgroundColor: `var(--color-${neutral === 'neutral' ? 'old-neutral' : neutral}-500)` }"
        :title="neutral"
        @click="appConfig.ui.colors.neutral = neutral"
      />
    </div>
  </UPageCard>
</template>
