<template>
  <div class="cell" @click="showInput">
    <a-input ref="input" v-model="inputValue" @input="onInput" @blur="onBlur" v-if="isEdit" />
    <template v-else>
      <span v-if="value">{{ value }}</span>
      <span class="placeholder" v-else>点击设置号源数量</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  },
  data () {
    return {
      isEdit: false,
      inputValue: ''
    }
  },
  computed: {
    isEmpty ({ value }) {
      return value == null || String(value).length === 0
    }
  },
  watch: {
    value: {
      handler (val) {
        this.inputValue = val
      },
      immediate: true
    }
  },
  methods: {
    showInput () {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    onInput (val) {
      console.log('onInput', val)
      const r = /\d+/.exec(this.inputValue)
      if (r && r[0]) {
        this.inputValue = parseInt(r[0])
      } else {
        this.inputValue = ''
      }
    },
    onBlur () {
      this.isEdit = false
      this.$emit('input', this.inputValue)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default.less';
.cell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .ant-input {
    display: block;
  }
  .placeholder {
    color: @text-color-secondary;
  }
}
</style>
