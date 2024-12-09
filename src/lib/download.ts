export async function downloadZip(files: { name: string; blob: Blob }[]) {
  // 动态导入 JSZip
  const JSZip = (await import('jszip')).default
  
  const zip = new JSZip()
  
  // 添加文件到zip
  files.forEach(({ name, blob }) => {
    zip.file(name, blob)
  })
  
  // 生成zip文件
  const content = await zip.generateAsync({ type: "blob" })
  
  // 下载zip文件
  const url = URL.createObjectURL(content)
  const a = document.createElement("a")
  a.href = url
  a.download = "processed_images.zip"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
} 