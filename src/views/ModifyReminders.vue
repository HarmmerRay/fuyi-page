<template>
  <div class="add-alarm-container">
    <!-- 头部导航 -->
    <div class="header">
      <div class="left-group">
        <button class="close-btn" @click="goBack">×</button>
        <span class="title">事项修改</span>
      </div>
      <button class="confirm-btn" @click="deleteAlarm">删除</button>
      <button class="confirm-btn" @click="saveAlarm">保存</button>
    </div>

    <!-- 时间选择区域 -->
    <!--    todo bug:没有循环滚动，无法选择一些时间-->
    <div class="time-picker">
      <div class="column hours" ref="hoursColumn" @scroll="handleScroll('hour')">
        <div
          v-for="h in 24"
          :key="h - 1"
          :class="['number', { active: selectedHour === h - 1 }]"
          :data-value="h - 1"
        >
          {{ (h - 1).toString().padStart(2, '0') }}
        </div>
      </div>
      <div class="separator">:</div>
      <div class="column minutes" ref="minutesColumn" @scroll="handleScroll('minute')">
        <div
          v-for="m in 60"
          :key="m - 1"
          :class="['number', { active: selectedMinute === m - 1 }]"
          :data-value="m - 1"
        >
          {{ (m - 1).toString().padStart(2, '0') }}
        </div>
      </div>
    </div>
    <!--任务事项-->
    <div class="intro">事项简介</div>
    <div class="setting-item input-item">
      <input type="text" v-model="briefTask" placeholder="请编辑提醒事项简介" class="task-input" />
    </div>
    <div class="intro-container">
      <div class="intro2">事项完整描述</div>
      <!-- 语音组件 -->
      <div class="audio-component" :class="{ 'has-audio': audio_url }" @click="handleAudioClick">
        <img :src="audio_url ? blueAudio : greyAudio" class="audio-icon" />
        <span class="duration">{{ audioDuration || '00:00' }}s</span>
      </div>
    </div>
    <div class="setting-item input-item">
      <input type="text" v-model="reminderTask" placeholder="请输入提醒事项" class="task-input" />
    </div>
    <!-- 重复设置 -->
    <div class="setting-item" @click="showRepeatPicker = true">
      <span>重复</span>
      <span class="value">{{ repeatText }}</span>
    </div>

    <!-- 提醒方式 -->
    <div class="setting-item" @click="showMethodPicker = true">
      <span>提醒方式</span>
      <span class="value">{{ methodText }}</span>
    </div>

    <!-- 重复选择弹窗 -->
    <van-popup v-model:show="showRepeatPicker" position="bottom">
      <van-picker
        :columns="repeatOptions"
        @confirm="onRepeatConfirm"
        @cancel="showRepeatPicker = false"
      />
    </van-popup>

    <!-- 方式选择弹窗 -->
    <van-popup v-model:show="showMethodPicker" position="bottom">
      <van-picker
        :columns="methodOptions"
        @confirm="onMethodConfirm"
        @cancel="showMethodPicker = false"
      />
    </van-popup>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import { Picker, Popup, showToast } from 'vant'
import router from '@/router/index.js'
import { check_auth, get_cookie } from '@/util/auth.js'
import { delete_tixing_by_id, tixing_item_update, tixing_item_select_id } from '@/api/db.js'
import { useRoute } from 'vue-router'
import blueAudio from '@/assets/audio_blue.png'
import greyAudio from '@/assets/audio_grey.png'
import { upload_audio } from '@/api/aliyun.js'
import WavEncoder from 'wav-encoder'
import { audio_record } from '@/util/audio.js'
export default {
  components: {
    [Picker.name]: Picker,
    [Popup.name]: Popup,
  },
  setup() {
    const audio_url = ref(null)
    const audioDuration = ref('00:00')
    const reminderTask = ref('')
    const briefTask = ref('')
    const selectedHour = ref('')
    const selectedMinute = ref('')
    // 原有状态保持不变
    const hoursColumn = ref(null)
    const minutesColumn = ref(null)
    const itemHeight = 50 // 每个数字项的高度
    const visibleItems = 5 // 可见项数量
    // 添加点击处理
    const handleAudioClick = () => {
      if (audio_url.value) {
        // 播放音频逻辑
        playAudio(audio_url.value)
      } else {
        // 录音逻辑
        audio_record(tixing_id.value, '2')
      }
    }

    // 示例播放函数
    const playAudio = (url) => {
      const audio = new Audio(url)
      audio.play()
    }

    // 计算中间位置索引（第三个可见项）
    const calculateCenterIndex = (scrollTop) => {
      return Math.round(scrollTop / itemHeight) + Math.floor(visibleItems / 2)
    }

    // 滚动处理函数
    const handleScroll = (type) => {
      const container = type === 'hour' ? hoursColumn.value : minutesColumn.value
      const centerIndex = calculateCenterIndex(container.scrollTop)

      if (type === 'hour') {
        selectedHour.value = centerIndex
      } else {
        selectedMinute.value = centerIndex
      }
    }

    // 初始化滚动位置
    const initScrollPosition = (hour, miniute) => {
      const scrollToPosition = (element, value) => {
        element.scrollTop = value * itemHeight - ((visibleItems - 1) / 2) * itemHeight
      }
      scrollToPosition(hoursColumn.value, hour)
      scrollToPosition(minutesColumn.value, miniute)
    }
    const tixing_id = ref('')
    const initData = () => {
      const route = useRoute()
      // 前端页面之间传递数据
      tixing_id.value = route.params.id
      tixing_item_select_id(tixing_id.value).then((res) => {
        selectedHour.value = res.data.target_time.split(':')[0]
        selectedMinute.value = res.data.target_time.split(':')[1]
        briefTask.value = res.data.brief_task
        reminderTask.value = res.data.task
        repeatText.value = res.data.repeat
        methodText.value = res.data.method
        audio_url.value = res.data.audio_url
        audioDuration.value = res.data.audio_duration
        console.log('audio_duration', audioDuration.value, res.data.duration)
        initScrollPosition(selectedHour.value, selectedMinute.value)
      })
    }
    onMounted(() => {
      initData()
    })

    const showRepeatPicker = ref(false)
    const showMethodPicker = ref(false)

    const repeatOptions = [
      { text: '仅一次', value: 'once' },
      { text: '每天', value: 'daily' },
      { text: '工作日', value: 'weekdays' },
      { text: '周末', value: 'weekends' },
    ]

    const methodOptions = [
      { text: '系统推送', value: 'push' },
      { text: '短信', value: 'sms' },
      { text: '振动', value: 'vibrate' },
      { text: '响铃加振动', value: 'ring_vibrate' },
    ]

    const repeatText = ref('仅一次')
    const methodText = ref('系统推送')

    const onRepeatConfirm = ({ selectedOptions }) => {
      repeatText.value = selectedOptions[0].text
      showRepeatPicker.value = false
    }

    const onMethodConfirm = ({ selectedOptions }) => {
      methodText.value = selectedOptions[0].text
      showMethodPicker.value = false
    }

    const tixing_item = ref(null)
    const user_id = get_cookie('user_id')
    const saveAlarm = () => {
      // 保存逻辑
      // 检验提醒事项是否输入
      if (!reminderTask.value.trim()) {
        showToast('请输入提醒事项')
        return
      }
      // 时间，事项，重复，提醒方式
      tixing_item.value = {
        target_time:
          selectedHour.value.toString().padStart(2, '0') +
          ':' +
          selectedMinute.value.toString().padStart(2, '0'),
        task: reminderTask.value,
        repeat: repeatText.value,
        method: methodText.value,
        brief_task: briefTask.value,
      }
      console.log('tixing_item', tixing_item.value)
      tixing_item_update(tixing_id.value, tixing_item.value).then((res) => {
        console.log('res', res.data)
        if (res.data && res.data.code === 0) {
          showToast('保存成功！')
        } else {
          showToast('保存失败，请联系管理员处理！')
          initData()
        }
      })
      console.log('保存闹钟:', {
        time: `${selectedHour.value}:${selectedMinute.value}`,
        repeat: repeatText.value,
        method: methodText.value,
      })
      router.back()
    }
    const deleteAlarm = () => {
      delete_tixing_by_id(tixing_id.value).then((res) => {
        if (res.data && res.data.code === 1) {
          showToast('删除成功')
          router.back()
        }
      })
    }
    const goBack = () => {
      router.back()
    }

    return {
      blueAudio,
      greyAudio,
      audio_url,
      audioDuration,
      briefTask,
      reminderTask,
      selectedHour,
      selectedMinute,
      hoursColumn,
      minutesColumn,
      showRepeatPicker,
      showMethodPicker,
      repeatOptions,
      methodOptions,
      repeatText,
      methodText,
      onRepeatConfirm,
      onMethodConfirm,
      saveAlarm,
      deleteAlarm,
      goBack,
      handleScroll,
      handleAudioClick,
      playAudio,
    }
  },
}
</script>
<style scoped>
.add-alarm-container {
  height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #eee;
}

.left-group {
  display: flex;
  align-items: center;
}

.close-btn {
  font-size: 28px;
  padding: 0 12px;
  border: none;
  background: none;
}

.title {
  font-size: 18px;
  margin-left: 8px;
}

.confirm-btn {
  font-size: 19px;
  color: #2196f3;
  padding: 8px;
  border: none;
  background: none;
}

.time-picker {
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin: 16px;
  border-radius: 12px;
}

.column {
  flex: 1;
  height: 80%;
  overflow-y: auto;
  text-align: center;
  scroll-snap-type: y mandatory;
}

.number {
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  scroll-snap-align: center;
  color: #666;
}

.number.active {
  color: #2196f3;
  font-weight: bold;
}

.separator {
  font-size: 24px;
  margin-bottom: 17px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  margin: 8px 16px;
  background: white;
  border-radius: 8px;
}

.value {
  color: #666;
}

/* 新增输入框样式 */
.input-item {
  margin-top: 16px; /* 与顶部保持间距 */
}

.task-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
}

.task-input::placeholder {
  color: #999;
}

/* 保持原有设置项样式统一 */
.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  margin: 8px 16px;
  background: white;
  border-radius: 8px;
  align-items: center; /* 垂直居中 */
}

.intro {
  margin-left: 14px;
  color: #7e7e7e;
}
.intro2 {
  color: #7e7e7e;
}
.intro-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 16px;
  margin-top: 16px;
}

.audio-component {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 15px;
  transition: all 0.3s;
  cursor: pointer;
}

.audio-component.has-audio {
  background-color: #e8f4ff;
}

.audio-icon {
  width: 20px;
  height: 20px;
}

.duration {
  font-size: 14px;
  color: #666;
}

.has-audio .duration {
  color: #2196f3;
}
</style>
