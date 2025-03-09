import {check_auth} from "@/util/auth.js";
import {showToast} from "vant";
import router from "@/router/index.js";
import WavEncoder from "wav-encoder";
import {asr_tixing_create, upload_audio} from "@/api/aliyun.js";

// 1、 user_id  2、tixing_id
export async function audio_record(id,type) {
  // 1. 权限检查
  const isAuth = await check_auth();
  if (!isAuth) {
    showToast('请先登录');
    await router.push('/login');
    return;
  }

  // 2. 获取麦克风权限
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);

  // 使用 ScriptProcessorNode 获取原始音频数据
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  let audioData = [];

  source.connect(processor);
  processor.connect(audioContext.destination);

  // 3. 收集原始音频数据
  processor.onaudioprocess = (e) => {
    const channelData = e.inputBuffer.getChannelData(0);
    audioData.push(new Float32Array(channelData));
  };
  // 4. 开始录音
  showToast('正在录音中... (5秒后自动停止)');

  // 5. 设置5秒自动停止
  setTimeout(async () => {
    // 停止录音
    processor.disconnect();
    source.disconnect();

    // 合并音频数据
    const mergedData = mergeBuffers(audioData);

    // 使用 wav-encoder 生成正确的WAV文件
    const wavBlob = await WavEncoder.encode({
      sampleRate: audioContext.sampleRate,
      channelData: [mergedData]
    });

    const audioFile = new File([wavBlob], `recording_${Date.now()}.wav`, {
      type: 'audio/wav'
    });
    console.log(audioFile);
    // 8. 上传云存储+写入数据库
    if (type === '1') {
      showToast('ASR识别，事项创建中...');
      await asr_tixing_create(id, audioFile);
      showToast('事项创建成功');
    }
    if (type === '2') {
      showToast('语音录入中...');
      await upload_audio(id,audioFile);
      showToast('语音录入成功');
    }

    // 后续上传逻辑...
  }, 5000);
}
// 合并缓冲区工具函数
function mergeBuffers(chunks) {
  const length = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Float32Array(length);
  let offset = 0;

  chunks.forEach(chunk => {
    result.set(chunk, offset);
    offset += chunk.length;
  });

  return result;
}
// 示例时长格式化函数
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
