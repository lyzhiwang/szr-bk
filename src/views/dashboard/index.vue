<template>
  <div class="app-container">
    <tip title="暂无" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      data: {}
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
