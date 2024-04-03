chrome.storage.sync.get( function (storage) {
  var activeTextElement = document.activeElement
  var textAreaStr = activeTextElement.value

  if (textAreaStr === undefined) { return }
  var params = createParams(storage)

  var replacedText
  if (isTextSelected(activeTextElement)) {
    var start = activeTextElement.selectionStart;
    var end = activeTextElement.selectionEnd;
    replacedText = convertOnlySelectionToImgTag(textAreaStr, params, start, end)
  } else {
    replacedText = convertToImgTag(textAreaStr, params)
  }

  if (replacedText != null) {
    activeTextElement.value = replacedText
  }
 })

 function isTextSelected(activeTextElement) {
   return activeTextElement.selectionStart !== activeTextElement.selectionEnd
 }


function convertOnlySelectionToImgTag(text, params, start, end) {
    const selectedText = text.substring(start, end)
    const imgTagText = convertToImgTag(selectedText, params)
    if (imgTagText == null) {
      return null
    }

    let replacedText
    if (start === 0) {
      replacedText = imgTagText + text.substring(end, text.length)
    } else if (end === 0) {
      replacedText = text.substring(0, start) + imgTagText
    } else {
      replacedText = text.substring(0, start) + imgTagText + text.substring(end, text.length)
    }
    return replacedText
}

function convertToImgTag(text, params) {
  let replacedText = text

  // Markdown notasyonu içeren bir resmi çıkart
  const mdImageArray = createMarkdownImages(text, params)

  if (mdImageArray == null) { return null }

  // Markdown notasyonundan görüntü etiketine değiştir
  for (const mdImage of mdImageArray) {
    replacedText = replacedText.replace(mdImage.mdImageText, mdImage.imageTag)
  }

  return replacedText
}

function createMarkdownImages(text, params) {
  let markdownImageArray = []
  const results = text.match(/\!\[.*?\]\(https:\S+?\)/gmi)
  if (results == null) { return null }

  for (const mdImage of results) {
    const imageURL = mdImage.match(/\((https:\S+)\)/i)[1]
      const imageTag = `<img alt="" src="${imageURL}" ${params}>`;
      const markdownImage = new MarkdownImage(imageURL, mdImage, imageTag)
    markdownImageArray.push(markdownImage)
  }
  return markdownImageArray
}

function createParams(storage) {
  let result = ""
  if (storage.width != null && storage.width !== "") {
    result += ` width="${storage.width}"`
  }

  if (storage.height != null && storage.height !== "") {
    result += ` height="${storage.height}"`
  }

  // Başlangıç değerleri
  if (result === "") {
    result = " width='50%' height='50%'"
  }

  return result
}
