<template>
  <section>
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="caches"
      highlight-current-row
      style="width: 100%;height:100%;"
    >
      <el-table-column type="index" width="80" />
      <el-table-column prop="name" label="键名" width />
      <el-table-column prop="value" label="键值" width />
      <el-table-column prop="description" label="描述" width />
      <el-table-column label="操作" width="180">
        <template v-slot="{ $index, row }">
          <confirm-button
            type="delete"
            :loading="row._loading"
            :icon="'el-icon-delete'"
            @click="onClearCache($index, row)"
          >
            <p slot="content">确定要清除该缓存吗？</p>清除
          </confirm-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getCacheList, clearCache } from '@/api/admin/cache'
import ConfirmButton from '@/components/ConfirmButton'
export default {
  name: 'Cache',
  components: {
    ConfirmButton
  },
  data() {
    return {
      filter: {
        name: ''
      },
      caches: [],
      listLoading: false
    }
  },
  mounted() {
    this.getCaches()
  },
  methods: {
    // 获取缓存列表
    async getCaches() {
      this.listLoading = true
      const res = await getCacheList()
      this.listLoading = false

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return
      }

      const data = res.data
      data.forEach(d => {
        d._loading = false
      })
      this.caches = data
    },
    // 清除缓存
    async onClearCache(index, row) {
      row._loading = true
      const para = { cacheKey: row.value }
      const res = await clearCache(para)
      row._loading = false

      if (!res.success) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
        return
      }
      this.$message({
        message: '缓存清除成功',
        type: 'success'
      })

      this.getCaches()
    }
  }
}
</script>
