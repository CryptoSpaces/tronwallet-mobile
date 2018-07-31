export default url => {
  let tempUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  if (tempUrl.length > 35) {
    tempUrl = `${tempUrl.slice(0, 32)}...`
  }
  return tempUrl
}

// url = url.replace(/(^\w+:|^)\/\//, '')
