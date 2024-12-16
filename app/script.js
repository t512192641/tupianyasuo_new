document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const originalImage = document.getElementById('originalImage');
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                document.getElementById('originalSize').innerText = `文件大小: ${file.size} 字节`;
            };
        };
        reader.readAsDataURL(file);
    }
});

// 更新压缩比例显示
document.getElementById('compressionRatio').addEventListener('input', function() {
    const value = this.value;
    document.getElementById('compressionValue').innerText = `${value}%`; // 更新显示的压缩比例
});

document.getElementById('compressButton').addEventListener('click', function() {
    const originalImage = document.getElementById('originalImage');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 确保原始图片已加载
    if (!originalImage.src || originalImage.src.includes('placeholder.png')) {
        alert("请先上传一张图片！");
        return;
    }

    // 设置画布宽度和高度为原始图片的自然宽度和高度
    canvas.width = originalImage.naturalWidth; // 使用自然宽度
    canvas.height = originalImage.naturalHeight; // 使用自然高度

    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height); // 将原始图片绘制到画布上

    // 压缩图片并转换为数据URL
    const compressionRatio = document.getElementById('compressionRatio').value / 100; // 获取压缩比例
    const compressedDataUrl = canvas.toDataURL('image/jpeg', compressionRatio);
    document.getElementById('compressedImage').src = compressedDataUrl;

    // 计算压缩后的文件大小
    const compressedSize = Math.round((compressedDataUrl.length * 3) / 4); // 计算压缩后的字节数
    document.getElementById('compressedSize').innerText = `文件大小: ${compressedSize} 字节`;

    // 使用 Blob 对象创建下载链接
    const byteString = atob(compressedDataUrl.split(',')[1]);
    const mimeString = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ab[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'compressed_image.jpg'; // 设置下载文件名
}); 