import md5 from 'js-md5'
const encrypt = () => {
  const time = md5('Fuyi' + formatDate())
  return time
}

function formatDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}`
}

// export default encrypt;
// console.log(formatDate());
export default encrypt
