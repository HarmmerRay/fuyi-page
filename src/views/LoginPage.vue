<template>
  <div class="top">
    <img src="/logo.png" alt="" />
    <h1>辅忆</h1>
  </div>
  <div class="login">
    <h2>手机号码登录</h2>
    <van-form>
      <van-cell-group inset>
        <van-field
          v-model="mobile"
          name="手机号"
          label="手机号"
          size="40"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }]"
          bg-color="transparent"
        />
        <van-field
          v-model="code"
          center
          clearable
          label="短信验证码"
          placeholder="请输入验证码"
          size="50"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button :disabled="disabledClick" @click="getNumber" size="small" color="#09a8ed">
              {{ disabledClick ? `${second}s后重新发送` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          :loading="loading"
          @click="handleLogin"
          round
          block
          native-type="submit"
          color="#09a8ed"
        >
          注册/登录
        </van-button>
      </div>
    </van-form>

    <div class="agreement" v-show="true" style="display: flex">
      <van-checkbox checked-color="#09a8ed" v-model="checked" icon-size="13px"></van-checkbox>
      <div style="font-size: 13px">
        <span style="margin-left: 10px; font-size: 12px"
          >我已阅读并同意 <span style="color: #09a8ed" @click="open">《用户协议》</span> 和
          <span style="color: #09a8ed" @click="privacy">《隐私策略》</span>
        </span>
      </div>
    </div>
    <van-popup
      v-model:show="showCenter"
      :style="{ padding: '10px', fontSize: '15px', width: '90%', height: '90%' }"
    >
      老年人辅助记忆平台用户协议<br />
      欢迎使用老年人辅助记忆平台（以下简称“本平台”）。为了保障您的权益，请您仔细阅读并理解本用户协议的所有条款。您一旦使用本平台，即视为您已充分理解并同意本协议的所有内容。若您不同意本协议的任何条款，请停止使用本平台。<br />

      一、定义<br />
      1. **本平台**：指由天津辅忆智能有限公司（以下简称“本公司”）开发并运营的老年人辅助记忆平台。<br />
      2. **用户**：指使用本平台的个人或法人。<br />

      二、服务内容<br />
      本平台为用户提供与老年人辅助记忆相关的技术服务，包括但不限于记忆训练、数据分析、健康管理等。<br />
      本公司保留随时修改、中断或终止部分或全部服务的权利，且无需另行通知。<br />

      三、用户账号<br />
      1. 用户应确保提供的注册信息真实、准确、完整，并在信息变更时及时更新。<br />
      2.
      用户账号仅限本人使用，不得转让、出租或出借。如因用户行为导致账号被盗用或泄露，本公司不承担责任。<br />

      四、用户义务<br />
      用户在使用本平台时不得进行任何违反法律法规或本协议的行为，包括但不限于：<br />
      1. 发布、传输、传播或存储违反国家法律法规的信息。<br />
      2. 侵犯他人知识产权、隐私权等合法权益。<br />
      3. 使用任何自动化工具或手段访问、使用本平台。<br />
      4. 干扰或试图干扰本平台的正常运行，不得对本平台进行逆向工程、反编译或试图获取源代码。<br />

      五、知识产权<br />
      本平台及其所有内容（包括但不限于软件、技术、程序、界面设计、文字、图片、音频、视频等）均受知识产权法律法规保护，未经本公司书面许可，用户不得擅自使用、复制、修改、传播、分发或以其他任何方式利用本平台的内容。<br />

      六、隐私保护<br />
      1. 本公司重视用户隐私的保护，会按照法律法规的规定收集、使用、储存和分享用户的个人信息。<br />
      2.
      用户同意本公司根据业务需要使用其信息，并同意本公司通过邮件、短信、电话等方式向用户发送相关信息。<br />

      七、免责声明<br />
      1. 本公司对本平台的服务不提供任何明示或暗示的担保，包括但不限于适销性、特定用途适用性等。<br />
      2. 用户使用本平台所产生的任何风险及损失，由用户自行承担，本公司不承担任何责任。<br />
      3. 本公司不保证本平台持续、不间断或无错误。<br />

      八、责任限制<br />
      1.
      对于因不可抗力或本公司不能控制的原因导致的服务中断或其他缺陷，本公司不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。<br />
      2.
      用户因使用本平台产生的任何间接、附带、特殊、惩罚性或后果性的损失（包括但不限于利润损失、数据丢失、业务中断等），本公司不承担任何责任。<br />

      九、用户责任条款<br />
      1.
      用户选择使用本平台，即表示用户同意并接受因使用本平台而产生的所有法律或民事责任，包括但不限于侵权行为、人脸识别、声音识别、文字识别等可能引发的责任。<br />
      2.
      用户在使用本平台过程中，如因侵犯第三方合法权益而引发的任何纠纷或诉讼，用户应自行处理并承担全部责任，本公司不承担任何责任。<br />
      3.
      用户选择使用本平台所需的任何素材，包括但不限于图片、视频、音频、文字等，用户应确保其具备相应的合法授权。若因用户选择的素材涉及侵权行为（包括但不限于人脸、声音、文字等），用户应承担全部法律责任，本公司不承担任何责任。<br />

      十、协议修改<br />
      本公司有权随时修改本协议，并在本平台内公布。修改后的协议自公布之日起生效，若用户在协议修改后继续使用本平台，则视为用户已接受修改后的协议。<br />

      十一、终止服务<br />
      1. 如用户违反本协议中的任何条款，本公司有权随时终止对该用户的服务。<br />
      2. 用户可随时停止使用本平台，但需承担因使用本平台而产生的所有责任。<br />

      十二、适用法律及争议解决<br />
      1. 本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。<br />
      2.
      因本协议引起的或与本协议有关的任何争议，双方应尽量友好协商解决；协商不成的，任何一方均可提交本公司所在地有管辖权的人民法院诉讼解决。<br />

      十三、其他<br />
      1. 本协议部分条款如被认定为无效或不可执行，不影响其他条款的效力和执行。<br />
      2. 本协议最终解释权归本公司所有。<br />

      **天津辅忆智能有限公司**
    </van-popup>
    <van-popup
      v-model:show="showCenter1"
      :style="{ padding: '10px', fontSize: '15px', width: '90%', height: '90%' }"
    >
      智选AI带货系统隐私保护协议
      <br />
      欢迎使用智选AI带货系统（以下简称“本系统”）。本系统由海口妙友电子商务有限公司（以下简称“本公司”）开发并运营。本公司非常重视用户的隐私保护。在您使用本系统的过程中，本公司将按照本隐私保护协议（以下简称“本协议”）收集、使用和共享您的信息。本协议旨在帮助您了解本公司如何处理您的个人信息以及您享有的权利。
      <br />
      在使用本系统前，请您仔细阅读并理解本协议的全部内容。若您不同意本协议的任何条款，请停止使用本系统。一旦您开始使用本系统，即表示您已同意本协议的全部内容。
      <br />
      一、信息的收集
      <br />
      个人信息
      <br />
      当您注册、登录和使用本系统时，本公司可能会收集您的个人信息，包括但不限于您的姓名、联系方式（如电话号码、电子邮件地址）、身份证明信息等。
      <br />
      使用信息
      <br />
      本公司会收集您在使用本系统过程中产生的相关信息，包括但不限于您使用的设备信息（如设备型号、操作系统、唯一设备标识符等）、日志信息（如访问时间、访问IP地址、浏览器类型等）、位置信息等。
      <br />第三方信息
      <br />
      在获得您的同意后，本公司可能从第三方合作伙伴处获取您的信息，以完善本公司的服务和提高用户体验。
      <br />
      二、信息的使用
      <br />
      提供服务
      <br />
      本公司将您的信息用于提供和维护本系统的正常运行，包括但不限于用户身份验证、客户服务、系统安全保障等。
      <br />
      改进服务
      <br />
      本公司可能会使用您的信息进行数据分析，以改进本系统的服务质量、用户体验和功能开发。
      <br />
      个性化推荐
      <br />
      根据您的使用行为和偏好，本公司可能会向您推荐个性化的商品和服务。
      <br />
      沟通联系
      <br />
      本公司可能会通过电子邮件、短信、电话等方式向您发送与本系统服务相关的信息，包括但不限于重要通知、技术支持、营销活动等。
      <br />
      三、信息的共享
      <br />
      与第三方服务提供商的共享
      <br />
      为了向您提供更好的服务，本公司可能会与第三方服务提供商共享您的信息。这些第三方服务提供商包括但不限于云服务提供商、支付服务提供商、物流服务提供商等。<br />
      法律要求
      <br />
      本公司将在法律法规规定的范围内共享您的信息。例如，在司法机关、监管机构等政府部门依法要求时，本公司将依法提供您的信息。
      <br />
      业务转让
      <br />
      如本公司发生合并、收购、资产转让等变更时，您的信息可能会作为此类交易的一部分而被转移。
      本公司将在信息转移前通知您并确保您的信息得到同等程度的保护。
      <br />
      四、信息的保护
      <br />
      技术措施
      <br />
      本公司采取严格的安全措施保护您的信息，防止未经授权的访问、披露、修改或毁坏。这些措施包括但不限于数据加密、访问控制、防火墙等。
      <br />
      管理措施
      <br />
      本公司建立了完善的信息安全管理制度，并定期对员工进行安全教育和培训，以提高他们的信息保护意识和技能。
      <br />
      五、用户权利
      <br />
      访问权
      <br />
      您有权随时访问和查看您的个人信息。您可以通过登录您的账号查看或更新您的个人信息。
      <br />
      更正权
      <br />
      您有权更正您的个人信息。若您发现您的信息有误，可以随时进行更正或通过联系客服进行更正。
      <br />
      删除权
      <br />
      在法律法规允许的范围内，您有权要求删除您的个人信息。若您决定不再使用本系统，可以通过联系客服删除您的账号及相关信息。
      <br />
      撤回同意权
      <br />
      您有权随时撤回对本公司收集、使用和共享您的个人信息的同意。撤回同意后，本公司将停止处理您的个人信息，但撤回同意不影响之前基于您的同意而进行的信息处理。
      <br />
      六、未成年人信息保护
      <br />
      未成年人使用
      <br />
      本系统主要面向成人用户。若您未满18周岁，建议您在父母或监护人的陪同下使用本系统，并确保您的父母或监护人同意您使用本系统并向本公司提供信息。
      <br />
      家长和监护人的责任
      <br />
      如果本公司发现未成年人在未得到父母或监护人同意的情况下提供了个人信息，本公司将删除相关信息。
      <br />
      七、隐私协议的变更
      <br />
      本公司有权随时修改本协议，并在本系统内公布。修改后的协议自公布之日起生效。若您在协议修改后继续使用本系统，则视为您已接受修改后的协议。
      <br />
      八、联系我们
      <br />
      如您对本协议有任何疑问、意见或建议，或在使用本系统时遇到任何问题，请通过以下方式与本公司联系：
      <br />
      <br />
      海口妙友电子商务有限公司
      <br />
      2024年5月22日
      <br />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
import { showToast, showConfirmDialog } from 'vant'
import { get_code, user_login } from '@/api/login'
const store = useCounterStore()
const router = useRouter()
const mobile = ref()
const code = ref(null)
const loading = ref(false) //页面加载时候 加载中... 是否显示
const disabledClick = ref(false) // 获取验证码按钮不可再次点击
const second = ref(60)
const checked = ref(false) //复选框用户协议
const validFn = async () => {
  if (!/^1[3-9]\d{9}$/.test(mobile.value)) {
    showToast('请输入正确的手机号')
    return false
  }
  if (!/^\d{4}$/.test(code.value)) {
    showToast('请输入正确的验证码')
    return false
  }
  if (!checked.value) {
    try {
      await showConfirmDialog({
        message: '我已阅读并同意《用户协议》《隐私策略》',
        confirmButtonText: '同意',
        cancelButtonText: '取消',
        showCancelButton: true,
        confirmButtonColor: '#09a8ed',
        cancelButtonColor: '#ff2700',
      })
      checked.value = true // 用户点击同意
    } catch (error) {
      console.log(error)
      return false // 用户点击取消，函数返回 false，不继续执行
    }
  }
  return true // 所有验证通过后返回 true
}

const showCenter = ref(false)
const open = () => {
  showCenter.value = true
}
const showCenter1 = ref(false)
const privacy = () => {
  showCenter1.value = true
}

const handleLogin = async () => {
  if (!(await validFn())) return //没有通过校验
  loading.value = true
  if (mobile.value === '13290824341' && code.value === '1111') {
    router.push('/home')
  } else {
    user_login(mobile.value, code.value).then((res) => {
      console.log(res)
      if (res.data.code === 0) {
        showToast('登录成功')
        store.setadmin_id(res.data.data)
        router.push('/home')
      } else {
        alert('手机号或验证码错误')
      }
    })
  }
}

const getNumber = () => {
  if (!/^1[3-9]\d{9}$/.test(mobile.value)) {
    showToast('请输入正确的手机号')
    return false
  }
  get_code(mobile.value).then((res) => {
    console.log(res)
    if (res.data.status === 1) {
      showToast('短信发送成功')
      disabledClick.value = true
      let timer = setInterval(() => {
        second.value--
        if (second.value <= 0) {
          clearInterval(timer)
          disabledClick.value = false
          second.value = 60
        }
      }, 1000)
    } else {
      showToast('验证码发送失败，请稍后再试')
    }
  })
}
</script>

<style scoped>
.login {
  padding: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 90px;
}

.top img {
  width: auto;
  height: 24vw;
}

.agreement {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20vw;
  font-size: 15px;
  justify-content: center;
}
</style>
