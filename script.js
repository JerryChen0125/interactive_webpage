const image = document.getElementById('image');
const imageContainer = document.getElementById('image-container');
const zoomInBottomRightButton = document.getElementById('zoom-in-bottomright');
const zoomOutBottomRightButton = document.getElementById('zoom-out-bottomright');
const target = document.querySelector('.target');
const overlay = document.getElementById('overlay');

let scale = 1;
let dragging = false;
let offsetX = 0;
let offsetY = 0;
let imageOffsetX = 0;
let imageOffsetY = 0;
let gameRunning = true;

// 初始圖片大小
const initialImageWidth = 200;
const initialImageHeight = 200;

// 設定初始圖片大小
image.onload = function() {
    image.style.width = initialImageWidth + 'px'; // 修改寬度
    image.style.height = initialImageHeight + 'px'; // 修改高度
    updateOverlaySize();
};

function zoomIn() {
    const widthIncrement = 50; // 寬度增量
    const heightIncrement = 50; // 高度增量
    const newWidth = parseInt(image.style.width || initialImageWidth) + widthIncrement;
    const newHeight = parseInt(image.style.height || initialImageHeight) + heightIncrement;
    setImageSize(newWidth, newHeight);
}

function zoomOut() {
    const widthDecrement = 50; // 寬度減量
    const heightDecrement = 50; // 高度減量
    const newWidth = Math.max(20, parseInt(image.style.width || initialImageWidth) - widthDecrement);
    const newHeight = Math.max(20, parseInt(image.style.height || initialImageHeight) - heightDecrement);
    setImageSize(newWidth, newHeight);
}

function setImageSize(newWidth, newHeight) {
    image.style.width = newWidth + 'px';
    image.style.height = newHeight + 'px';
    updateOverlaySize();
}

function updateOverlaySize() {
    overlay.style.width = target.offsetWidth + 'px';
    overlay.style.height = target.offsetHeight + 'px';
}

function checkAlignment() {
    const imageRect = image.getBoundingClientRect();

    if (imageRect.width === 100 && imageRect.height === 100 && isNearCenter(imageRect)) {
        // 圖片大小為150x150且靠近網頁中心點
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = centerX - imageRect.left - imageRect.width / 2;
        const offsetY = centerY - imageRect.top - imageRect.height / 2;

        imageContainer.style.left = `${imageOffsetX + offsetX}px`;
        imageContainer.style.top = `${imageOffsetY + offsetY}px`;

        alert('恭喜你完成這個遊戲，西鎮堂建立於1851年，這是齊天大聖的神像，接下來便去玩玩其他組別製作的遊戲吧！'); // 對齊時發送訊息
        gameRunning = false; // 停止遊戲
    }
}

function isNearCenter(rect) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return (
        Math.abs(rect.left + rect.width / 2 - centerX) < 75 && // 修改為 75
        Math.abs(rect.top + rect.height / 2 - centerY) < 75    // 修改為 75
    );
}

function handleMouseDown(e) {
    dragging = true;
    offsetX = e.clientX - imageContainer.getBoundingClientRect().left;
    offsetY = e.clientY - imageContainer.getBoundingClientRect().top;
}

function handleMouseMove(e) {
    if (dragging && gameRunning) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        imageContainer.style.left = newX + 'px';
        imageContainer.style.top = newY + 'px';

        // 更新圖片的偏移量
        imageOffsetX = newX;
        imageOffsetY = newY;

        checkAlignment();
    }
}

function handleMouseUp() {
    dragging = false;
}

zoomInBottomRightButton.addEventListener('click', zoomIn);
zoomOutBottomRightButton.addEventListener('click', zoomOut);

// 拖曳功能
imageContainer.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

// 觸控開始時
imageContainer.addEventListener('touchstart', function(e) {
    dragging = true;
    offsetX = e.touches[0].clientX - imageContainer.getBoundingClientRect().left;
    offsetY = e.touches[0].clientY - imageContainer.getBoundingClientRect().top;
});

// 觸控移動時
document.addEventListener('touchmove', function(e) {
    if (dragging && gameRunning) {
        const newX = e.touches[0].clientX - offsetX;
        const newY = e.touches[0].clientY - offsetY;
        imageContainer.style.left = newX + 'px';
        imageContainer.style.top = newY + 'px';

        // 更新圖片的偏移量
        imageOffsetX = newX;
        imageOffsetY = newY;

        e.preventDefault(); // 防止觸控滑動默認行為
        checkAlignment();
    }
});