<script setup lang="ts">
import { useDashboard } from '../composables/useDashboard'

const { isNotificationsSlideoverOpen } = useDashboard()
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    title="Notifications"
  >
    <template #body>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <UIcon name="i-lucide-bell-off" class="size-12 text-muted mb-3" />
        <p class="text-sm text-dimmed">
          No notifications yet.
        </p>
      </div>
    </template>
  </USlideover>
</template>
