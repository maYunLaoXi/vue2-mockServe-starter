<template>
  <div class="mock">
    forceMock
  </div>
</template>
<script>
import { forceMockApi } from '@/api'

export default {
  name: 'ForceMock',
  data() {},
  created() {
    forceMockApi({}).then(console.log)
  }
}
</script>